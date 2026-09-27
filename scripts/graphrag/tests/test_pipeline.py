import sys
import unittest
import ssl
from pathlib import Path

from pydantic import ValidationError


MODULE_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(MODULE_ROOT))

from chunking import Chunk, parse_markdown_sections, split_sentences
from models import (
    ChunkExtraction,
    EntityExtraction,
    EntityType,
    RelationshipExtraction,
    reject_unresolved_relationships,
)
from neo4j_store import secure_driver_configuration
from resolution import (
    canonicalize_name,
    deterministic_entity_id,
    resolve_extractions,
)


class PipelineTests(unittest.TestCase):
    def test_markdown_sections_become_ordered_semantic_chunks(self) -> None:
        markdown = """# Title

## First Section

First sentence. Second sentence.

## Second Section

Another section.
"""
        chunks = parse_markdown_sections(markdown, "document-v1", "data/source.md")

        self.assertEqual([chunk.chunk_id for chunk in chunks], ["first-section", "second-section"])
        self.assertEqual([chunk.heading for chunk in chunks], ["First Section", "Second Section"])
        self.assertEqual([chunk.order for chunk in chunks], [1, 2])
        self.assertEqual(chunks[0].text, "First sentence. Second sentence.")

    def test_sentence_aware_split_does_not_cut_sentences(self) -> None:
        parts = split_sentences("Alpha is complete. Beta is also complete. Gamma ends.", 25)

        self.assertEqual(parts, ["Alpha is complete.", "Beta is also complete.", "Gamma ends."])

    def test_canonical_name_normalization(self) -> None:
        cases = {
            "Ted": "Teddy Agustinus",
            "Teddy": "Teddy Agustinus",
            "Teddy Agustinus": "Teddy Agustinus",
            "BigQuery": "Google BigQuery",
            "SAP S4HANA": "SAP S/4HANA",
            "RAG": "Retrieval-Augmented Generation",
            "PIR": "PIR Tracking Data",
            "Price/Item Request": "PIR Tracking Data",
            "PIR tracking data": "PIR Tracking Data",
        }
        for raw, expected in cases.items():
            with self.subTest(raw=raw):
                self.assertEqual(canonicalize_name(raw), expected)

    def test_ted_teddy_and_full_name_resolve_to_one_entity(self) -> None:
        names = ["Ted", "Teddy", "Teddy Agustinus"]
        chunks = [
            Chunk(f"chunk-{index}", "document-v1", f"Heading {index}", name, index, "source.md")
            for index, name in enumerate(names, start=1)
        ]
        extractions = {
            chunk.chunk_id: ChunkExtraction(
                entities=[
                    EntityExtraction(
                        name=name,
                        entity_type=EntityType.PERSON,
                        description=f"Source-grounded description for {name}.",
                        aliases=[],
                    )
                ],
                relationships=[],
            )
            for chunk, name in zip(chunks, names)
        }

        graph = resolve_extractions(chunks, extractions)

        self.assertEqual(len(graph.entities), 1)
        entity = next(iter(graph.entities.values()))
        self.assertEqual(entity.name, "Teddy Agustinus")
        self.assertEqual(entity.aliases, {"Ted", "Teddy"})
        self.assertEqual(len(entity.source_chunk_ids), 3)

    def test_entity_ids_are_deterministic_and_type_sensitive(self) -> None:
        first = deterministic_entity_id(EntityType.PERSON, "Teddy Agustinus")
        second = deterministic_entity_id(EntityType.PERSON, "Teddy Agustinus")
        other_type = deterministic_entity_id(EntityType.ROLE, "Teddy Agustinus")

        self.assertEqual(first, second)
        self.assertNotEqual(first, other_type)
        self.assertTrue(first.startswith("entity:person:teddy-agustinus:"))

    def test_unknown_relationship_endpoint_is_rejected_without_losing_chunk(self) -> None:
        extraction = ChunkExtraction(
            entities=[
                EntityExtraction(
                    name="Teddy Agustinus",
                    entity_type=EntityType.PERSON,
                    description="A person named in the source.",
                    aliases=["Ted"],
                )
            ],
            relationships=[
                RelationshipExtraction(
                    source_entity="Teddy Agustinus",
                    target_entity="Missing Organization",
                    relationship_type="WORKS_AT",
                    description="A source-grounded employment relationship.",
                ),
                RelationshipExtraction(
                    source_entity="Teddy Agustinus",
                    target_entity="Ted",
                    relationship_type="KNOWN_AS",
                    description="A source-grounded alias relationship.",
                ),
            ],
        )

        filtered, rejected = reject_unresolved_relationships(extraction)

        self.assertEqual(len(filtered.relationships), 1)
        self.assertEqual(filtered.relationships[0].relationship_type, "KNOWN_AS")
        self.assertEqual(len(rejected), 1)
        self.assertEqual(rejected[0].target_entity, "Missing Organization")

    def test_pir_aliases_resolve_to_one_dataset(self) -> None:
        chunk = Chunk(
            "employee-workload-dashboard",
            "document-v1",
            "Employee Workload Dashboard",
            "PIR tracking data.",
            1,
            "source.md",
        )
        extraction = ChunkExtraction(
            entities=[
                EntityExtraction(
                    name="Teddy Agustinus",
                    entity_type=EntityType.PERSON,
                    description="The person described by the source.",
                    aliases=["Ted"],
                ),
                EntityExtraction(
                    name="PIR",
                    entity_type=EntityType.CONCEPT,
                    description="Price/Item Request tracking data.",
                    aliases=["Price/Item Request"],
                ),
                EntityExtraction(
                    name="PIR tracking data",
                    entity_type=EntityType.DATASET,
                    description="Internal tracking data used by the dashboard.",
                    aliases=["PIR"],
                ),
            ],
            relationships=[
                RelationshipExtraction(
                    source_entity="Teddy Agustinus",
                    target_entity="PIR",
                    relationship_type="USED_DATA",
                    description="Ted used the PIR tracking data.",
                )
            ],
        )

        graph = resolve_extractions([chunk], {chunk.chunk_id: extraction})

        self.assertEqual(len(graph.entities), 2)
        pir = next(entity for entity in graph.entities.values() if entity.name == "PIR Tracking Data")
        self.assertEqual(pir.entity_type, "Dataset")
        self.assertEqual(len(graph.relationships), 1)
        self.assertEqual(graph.rejected_relationships, [])

    def test_genuinely_ambiguous_alias_rejects_only_affected_relationship(self) -> None:
        chunk = Chunk("ambiguous", "document-v1", "Ambiguous", "Text.", 1, "source.md")
        extraction = ChunkExtraction(
            entities=[
                EntityExtraction(
                    name="Alpha",
                    entity_type=EntityType.CONCEPT,
                    description="First distinct entity.",
                    aliases=["Shared"],
                ),
                EntityExtraction(
                    name="Beta",
                    entity_type=EntityType.CONCEPT,
                    description="Second distinct entity.",
                    aliases=["Shared"],
                ),
            ],
            relationships=[
                RelationshipExtraction(
                    source_entity="Shared",
                    target_entity="Alpha",
                    relationship_type="RELATES_TO",
                    description="An ambiguous relationship.",
                )
            ],
        )

        graph = resolve_extractions([chunk], {chunk.chunk_id: extraction})

        self.assertEqual(len(graph.entities), 2)
        self.assertEqual(graph.relationships, [])
        self.assertEqual(len(graph.rejected_relationships), 1)
        self.assertIn("ambiguous endpoint", graph.rejected_relationships[0].reason)

    def test_extraction_schema_rejects_non_normalized_relationship_type(self) -> None:
        with self.assertRaises(ValidationError):
            RelationshipExtraction(
                source_entity="Teddy Agustinus",
                target_entity="Kawan Lama Group",
                relationship_type="works_at",
                description="A source-grounded employment relationship.",
            )

    def test_neo4j_secure_uri_uses_verified_certifi_tls(self) -> None:
        uri, options = secure_driver_configuration(
            "neo4j+s://b515b29b.databases.neo4j.io"
        )

        self.assertEqual(uri, "neo4j://b515b29b.databases.neo4j.io")
        context = options["ssl_context"]
        self.assertIsInstance(context, ssl.SSLContext)
        self.assertEqual(context.verify_mode, ssl.CERT_REQUIRED)
        self.assertTrue(context.check_hostname)

    def test_non_tls_neo4j_uri_is_left_unchanged(self) -> None:
        uri, options = secure_driver_configuration("neo4j://localhost:7687")

        self.assertEqual(uri, "neo4j://localhost:7687")
        self.assertEqual(options, {})


if __name__ == "__main__":
    unittest.main()
