from __future__ import annotations

import hashlib
import re
import unicodedata
from dataclasses import dataclass, field

from chunking import Chunk, slugify
from constants import DATASET_ID
from models import ChunkExtraction, EntityType


def normalize_lookup(value: str) -> str:
    value = unicodedata.normalize("NFKC", value).casefold().strip()
    value = re.sub(r"[/_\-]+", " ", value)
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


CANONICAL_NAMES = {
    normalize_lookup("Ted"): "Teddy Agustinus",
    normalize_lookup("Teddy"): "Teddy Agustinus",
    normalize_lookup("Teddy Agustinus"): "Teddy Agustinus",
    normalize_lookup("BigQuery"): "Google BigQuery",
    normalize_lookup("Google BigQuery"): "Google BigQuery",
    normalize_lookup("SAP S4HANA"): "SAP S/4HANA",
    normalize_lookup("SAP S/4HANA"): "SAP S/4HANA",
    normalize_lookup("SAP S-4HANA"): "SAP S/4HANA",
    normalize_lookup("RAG"): "Retrieval-Augmented Generation",
    normalize_lookup("Retrieval Augmented Generation"): "Retrieval-Augmented Generation",
    normalize_lookup("Retrieval-Augmented Generation"): "Retrieval-Augmented Generation",
    normalize_lookup("PIR"): "PIR Tracking Data",
    normalize_lookup("PIR tracking data"): "PIR Tracking Data",
    normalize_lookup("Price/Item Request"): "PIR Tracking Data",
    normalize_lookup("Price/Item Request tracking data"): "PIR Tracking Data",
}

TYPE_OVERRIDES = {
    "Teddy Agustinus": EntityType.PERSON,
    "Google BigQuery": EntityType.TECHNOLOGY,
    "SAP S/4HANA": EntityType.TECHNOLOGY,
    "Retrieval-Augmented Generation": EntityType.CONCEPT,
    "PIR Tracking Data": EntityType.DATASET,
}

KNOWN_ALIASES = {
    "Teddy Agustinus": {"Ted", "Teddy"},
    "Google BigQuery": {"BigQuery"},
    "SAP S/4HANA": {"SAP S4HANA", "SAP S-4HANA"},
    "Retrieval-Augmented Generation": {"RAG"},
    "PIR Tracking Data": {"PIR", "Price/Item Request", "PIR tracking data"},
}


def canonicalize_name(value: str) -> str:
    cleaned = " ".join(value.split()).strip()
    return CANONICAL_NAMES.get(normalize_lookup(cleaned), cleaned)


def deterministic_entity_id(entity_type: str | EntityType, canonical_name: str) -> str:
    type_value = entity_type.value if isinstance(entity_type, EntityType) else entity_type
    normalized_type = normalize_lookup(type_value)
    normalized_name = normalize_lookup(canonical_name)
    digest = hashlib.sha256(f"{normalized_type}:{normalized_name}".encode()).hexdigest()[:10]
    return f"entity:{slugify(type_value)}:{slugify(canonical_name)}:{digest}"


@dataclass
class ResolvedEntity:
    id: str
    name: str
    entity_type: str
    description: str
    aliases: set[str] = field(default_factory=set)
    source_chunk_ids: set[str] = field(default_factory=set)


@dataclass
class ResolvedRelationship:
    source_id: str
    target_id: str
    relationship_type: str
    description: str
    source_chunk_ids: set[str] = field(default_factory=set)


@dataclass(frozen=True)
class RejectedResolvedRelationship:
    chunk_id: str
    heading: str
    source_entity: str
    target_entity: str
    relationship_type: str
    reason: str


@dataclass
class ResolvedGraph:
    entities: dict[str, ResolvedEntity]
    relationships: list[ResolvedRelationship]
    mentions: dict[str, set[str]]
    raw_entity_count: int
    rejected_relationships: list[RejectedResolvedRelationship]


def resolve_extractions(
    chunks: list[Chunk],
    extractions: dict[str, ChunkExtraction],
) -> ResolvedGraph:
    entities: dict[str, ResolvedEntity] = {}
    mentions: dict[str, set[str]] = {chunk.chunk_id: set() for chunk in chunks}
    references: dict[tuple[str, str], str] = {}
    ambiguous_references: set[tuple[str, str]] = set()
    raw_entity_count = 0

    for chunk in chunks:
        extraction = extractions[chunk.chunk_id]
        for raw in extraction.entities:
            raw_entity_count += 1
            canonical_name = canonicalize_name(raw.name)
            resolved_type = TYPE_OVERRIDES.get(canonical_name, raw.entity_type)
            entity_id = deterministic_entity_id(resolved_type, canonical_name)

            aliases = {alias.strip() for alias in raw.aliases if alias.strip()}
            aliases.update(KNOWN_ALIASES.get(canonical_name, set()))
            if normalize_lookup(raw.name) != normalize_lookup(canonical_name):
                aliases.add(raw.name.strip())
            aliases.discard(canonical_name)

            existing = entities.get(entity_id)
            if existing is None:
                entities[entity_id] = ResolvedEntity(
                    id=entity_id,
                    name=canonical_name,
                    entity_type=resolved_type.value,
                    description=raw.description.strip(),
                    aliases=aliases,
                    source_chunk_ids={chunk.chunk_id},
                )
            else:
                existing.aliases.update(aliases)
                existing.source_chunk_ids.add(chunk.chunk_id)
                if len(raw.description.strip()) > len(existing.description):
                    existing.description = raw.description.strip()

            mentions[chunk.chunk_id].add(entity_id)
            for reference in [raw.name, *raw.aliases, canonical_name]:
                key = (chunk.chunk_id, normalize_lookup(reference))
                if key in ambiguous_references:
                    continue
                previous = references.get(key)
                if previous is not None and previous != entity_id:
                    references.pop(key)
                    ambiguous_references.add(key)
                else:
                    references[key] = entity_id

    relationship_map: dict[tuple[str, str, str], ResolvedRelationship] = {}
    rejected_relationships: list[RejectedResolvedRelationship] = []
    for chunk in chunks:
        for raw in extractions[chunk.chunk_id].relationships:
            source_key = (chunk.chunk_id, normalize_lookup(raw.source_entity))
            target_key = (chunk.chunk_id, normalize_lookup(raw.target_entity))
            source_id = references.get(source_key)
            target_id = references.get(target_key)
            if source_id is None or target_id is None:
                ambiguous_endpoints = []
                if source_key in ambiguous_references:
                    ambiguous_endpoints.append(raw.source_entity)
                if target_key in ambiguous_references:
                    ambiguous_endpoints.append(raw.target_entity)
                reason = (
                    "ambiguous endpoint: " + ", ".join(ambiguous_endpoints)
                    if ambiguous_endpoints
                    else "unresolved endpoint"
                )
                rejected_relationships.append(
                    RejectedResolvedRelationship(
                        chunk_id=chunk.chunk_id,
                        heading=chunk.heading,
                        source_entity=raw.source_entity,
                        target_entity=raw.target_entity,
                        relationship_type=raw.relationship_type,
                        reason=reason,
                    )
                )
                continue

            if source_id == target_id:
                rejected_relationships.append(
                    RejectedResolvedRelationship(
                        chunk_id=chunk.chunk_id,
                        heading=chunk.heading,
                        source_entity=raw.source_entity,
                        target_entity=raw.target_entity,
                        relationship_type=raw.relationship_type,
                        reason="self-referential relationship after entity resolution",
                    )
                )
                continue

            key = (source_id, raw.relationship_type, target_id)
            existing = relationship_map.get(key)
            if existing is None:
                relationship_map[key] = ResolvedRelationship(
                    source_id=source_id,
                    target_id=target_id,
                    relationship_type=raw.relationship_type,
                    description=raw.description.strip(),
                    source_chunk_ids={chunk.chunk_id},
                )
            else:
                existing.source_chunk_ids.add(chunk.chunk_id)
                if len(raw.description.strip()) > len(existing.description):
                    existing.description = raw.description.strip()

    relationships = sorted(
        relationship_map.values(),
        key=lambda item: (item.source_id, item.relationship_type, item.target_id),
    )
    return ResolvedGraph(
        entities=entities,
        relationships=relationships,
        mentions=mentions,
        raw_entity_count=raw_entity_count,
        rejected_relationships=rejected_relationships,
    )


def entity_as_row(entity: ResolvedEntity) -> dict[str, object]:
    return {
        "id": entity.id,
        "name": entity.name,
        "entity_type": entity.entity_type,
        "description": entity.description,
        "aliases": sorted(entity.aliases, key=str.casefold),
        "source_chunk_ids": sorted(entity.source_chunk_ids),
        "dataset_id": DATASET_ID,
    }
