from __future__ import annotations

import re
import ssl
from urllib.parse import urlsplit, urlunsplit

import certifi
from neo4j import GraphDatabase

from chunking import Chunk
from constants import DATASET_ID, DOCUMENT_TITLE, ENTITY_TYPES
from resolution import ResolvedGraph, entity_as_row


SAFE_RELATIONSHIP_TYPE = re.compile(r"^[A-Z][A-Z0-9_]*$")


def secure_driver_configuration(uri: str) -> tuple[str, dict[str, object]]:
    """Use Certifi for verified TLS when Python's system CA store is incomplete."""
    parsed = urlsplit(uri)
    if parsed.scheme not in {"neo4j+s", "bolt+s"}:
        return uri, {}

    tls_context = ssl.create_default_context(cafile=certifi.where())
    driver_uri = urlunsplit(parsed._replace(scheme=parsed.scheme.removesuffix("+s")))
    return driver_uri, {"ssl_context": tls_context}


class Neo4jStore:
    def __init__(self, uri: str, username: str, password: str) -> None:
        driver_uri, tls_options = secure_driver_configuration(uri)
        self.driver = GraphDatabase.driver(
            driver_uri,
            auth=(username, password),
            **tls_options,
        )

    def close(self) -> None:
        self.driver.close()

    def verify_connectivity(self) -> None:
        self.driver.verify_connectivity()

    def create_constraints(self) -> None:
        statements = (
            "CREATE CONSTRAINT document_id_unique IF NOT EXISTS "
            "FOR (d:Document) REQUIRE d.id IS UNIQUE",
            "CREATE CONSTRAINT chunk_id_unique IF NOT EXISTS "
            "FOR (c:Chunk) REQUIRE c.id IS UNIQUE",
            "CREATE CONSTRAINT entity_id_unique IF NOT EXISTS "
            "FOR (e:Entity) REQUIRE e.id IS UNIQUE",
        )
        with self.driver.session() as session:
            for statement in statements:
                session.run(statement).consume()

    def upsert(self, chunks: list[Chunk], graph: ResolvedGraph) -> None:
        self.create_constraints()
        with self.driver.session() as session:
            session.execute_write(self._upsert_document_and_chunks, chunks)
            session.execute_write(self._upsert_entities, graph)
            session.execute_write(self._upsert_mentions, graph)
            session.execute_write(self._upsert_relationships, graph)

    @staticmethod
    def _upsert_document_and_chunks(tx, chunks: list[Chunk]) -> None:
        tx.run(
            """
            MERGE (d:Document {id: $id})
            SET d.title = $title,
                d.dataset_id = $dataset_id,
                d.source_file = $source_file
            """,
            id=DATASET_ID,
            title=DOCUMENT_TITLE,
            dataset_id=DATASET_ID,
            source_file=chunks[0].source_file,
        ).consume()
        rows = [
            {
                "id": chunk.chunk_id,
                "document_id": chunk.document_id,
                "heading": chunk.heading,
                "text": chunk.text,
                "order": chunk.order,
                "source_file": chunk.source_file,
                "dataset_id": DATASET_ID,
            }
            for chunk in chunks
        ]
        tx.run(
            """
            MATCH (d:Document {id: $dataset_id})
            UNWIND $rows AS row
            MERGE (c:Chunk {id: row.id})
            SET c.document_id = row.document_id,
                c.heading = row.heading,
                c.text = row.text,
                c.order = row.order,
                c.source_file = row.source_file,
                c.dataset_id = row.dataset_id
            MERGE (d)-[r:HAS_CHUNK]->(c)
            SET r.dataset_id = $dataset_id
            """,
            dataset_id=DATASET_ID,
            rows=rows,
        ).consume()

    @staticmethod
    def _upsert_entities(tx, graph: ResolvedGraph) -> None:
        grouped: dict[str, list[dict[str, object]]] = {value: [] for value in ENTITY_TYPES}
        for entity in graph.entities.values():
            grouped[entity.entity_type].append(entity_as_row(entity))

        for entity_type, rows in grouped.items():
            if not rows:
                continue
            tx.run(
                f"""
                UNWIND $rows AS row
                MERGE (e:Entity {{id: row.id}})
                SET e:{entity_type},
                    e.name = row.name,
                    e.entity_type = row.entity_type,
                    e.description = row.description,
                    e.aliases = row.aliases,
                    e.source_chunk_ids = row.source_chunk_ids,
                    e.dataset_id = row.dataset_id
                """,
                rows=rows,
            ).consume()

    @staticmethod
    def _upsert_mentions(tx, graph: ResolvedGraph) -> None:
        rows = [
            {"chunk_id": chunk_id, "entity_id": entity_id}
            for chunk_id, entity_ids in graph.mentions.items()
            for entity_id in sorted(entity_ids)
        ]
        tx.run(
            """
            UNWIND $rows AS row
            MATCH (c:Chunk {id: row.chunk_id})
            MATCH (e:Entity {id: row.entity_id})
            MERGE (c)-[r:MENTIONS]->(e)
            SET r.dataset_id = $dataset_id
            """,
            rows=rows,
            dataset_id=DATASET_ID,
        ).consume()

    @staticmethod
    def _upsert_relationships(tx, graph: ResolvedGraph) -> None:
        grouped: dict[str, list[dict[str, object]]] = {}
        for relationship in graph.relationships:
            if not SAFE_RELATIONSHIP_TYPE.fullmatch(relationship.relationship_type):
                raise ValueError(
                    f"Unsafe relationship type: {relationship.relationship_type!r}"
                )
            grouped.setdefault(relationship.relationship_type, []).append(
                {
                    "source_id": relationship.source_id,
                    "target_id": relationship.target_id,
                    "description": relationship.description,
                    "source_chunk_ids": sorted(relationship.source_chunk_ids),
                }
            )

        for relationship_type, rows in grouped.items():
            tx.run(
                f"""
                UNWIND $rows AS row
                MATCH (source:Entity {{id: row.source_id}})
                MATCH (target:Entity {{id: row.target_id}})
                MERGE (source)-[r:{relationship_type} {{dataset_id: $dataset_id}}]->(target)
                SET r.description = row.description,
                    r.source_chunk_ids = row.source_chunk_ids
                """,
                rows=rows,
                dataset_id=DATASET_ID,
            ).consume()

    def verification(self) -> dict[str, object]:
        queries = {
            "document_count": """
                MATCH (d:Document {dataset_id: $dataset_id})
                RETURN count(d) AS count
            """,
            "chunk_count": """
                MATCH (c:Chunk {dataset_id: $dataset_id})
                RETURN count(c) AS count
            """,
            "entity_count": """
                MATCH (e:Entity {dataset_id: $dataset_id})
                RETURN count(e) AS count
            """,
            "mention_count": """
                MATCH (:Chunk)-[r:MENTIONS {dataset_id: $dataset_id}]->(:Entity)
                RETURN count(r) AS count
            """,
            "semantic_relationship_count": """
                MATCH (:Entity)-[r {dataset_id: $dataset_id}]->(:Entity)
                RETURN count(r) AS count
            """,
            "entity_counts": """
                MATCH (e:Entity {dataset_id: $dataset_id})
                RETURN e.entity_type AS entity_type, count(e) AS count
                ORDER BY entity_type
            """,
            "relationship_counts": """
                MATCH ()-[r {dataset_id: $dataset_id}]->()
                RETURN type(r) AS relationship_type, count(r) AS count
                ORDER BY relationship_type
            """,
            "teddy_neighborhood": """
                MATCH (t:Entity {name: 'Teddy Agustinus', dataset_id: $dataset_id})-[r]-(connected:Entity)
                RETURN type(r) AS relationship_type,
                       connected.name AS connected_name,
                       connected.entity_type AS connected_type
                ORDER BY relationship_type, connected_name
            """,
            "project_technologies": """
                MATCH (p:Entity:Project {dataset_id: $dataset_id})-[r]->
                      (technology:Entity:Technology {dataset_id: $dataset_id})
                RETURN p.name AS project, type(r) AS relationship_type,
                       technology.name AS technology
                ORDER BY project, relationship_type, technology
            """,
            "teddy_count": """
                MATCH (t:Entity {name: 'Teddy Agustinus', dataset_id: $dataset_id})
                RETURN count(t) AS count
            """,
        }
        results: dict[str, object] = {}
        with self.driver.session() as session:
            for name, query in queries.items():
                results[name] = [record.data() for record in session.run(query, dataset_id=DATASET_ID)]
        return results
