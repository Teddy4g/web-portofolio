from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from neo4j.exceptions import DriverError, Neo4jError
from openai import OpenAIError

from chunking import Chunk, parse_markdown_sections
from constants import (
    DATASET_ID,
    DEFAULT_SOURCE_PATH,
    DOCUMENT_TITLE,
    REPOSITORY_ROOT,
    SOURCE_FILE_LABEL,
)
from extractor import OpenAIExtractor
from models import ChunkExtraction, reject_unresolved_relationships
from neo4j_store import Neo4jStore
from resolution import ResolvedGraph, resolve_extractions


def require_environment(dry_run: bool) -> dict[str, str]:
    required = ["OPENAI_API_KEY", "OPENAI_EXTRACTION_MODEL"]
    if not dry_run:
        required = ["NEO4J_URI", "NEO4J_USERNAME", "NEO4J_PASSWORD", *required]
    missing = [name for name in required if not os.getenv(name, "").strip()]
    if missing:
        raise RuntimeError(
            "Missing required environment variable(s): " + ", ".join(missing) + ". "
            "Add them to the repository .env file; never commit real secrets."
        )
    return {name: os.environ[name].strip() for name in required}


def extract_chunks(
    chunks: list[Chunk], extractor: OpenAIExtractor
) -> dict[str, ChunkExtraction]:
    extractions: dict[str, ChunkExtraction] = {}
    total = len(chunks)
    for index, chunk in enumerate(chunks, start=1):
        print(f"[{index}/{total}] Processing: {chunk.heading}")
        extraction, rejected = reject_unresolved_relationships(extractor.extract(chunk))
        extractions[chunk.chunk_id] = extraction
        print(
            f"       extracted {len(extraction.entities)} entities, "
            f"{len(extraction.relationships)} relationships"
        )
        for relationship in rejected:
            print(
                "       rejected unresolved relationship: "
                f"{relationship.source_entity} --{relationship.relationship_type}--> "
                f"{relationship.target_entity}"
            )
    return extractions


def print_resolution_statistics(graph: ResolvedGraph) -> None:
    merged = graph.raw_entity_count - len(graph.entities)
    print("\nEntity resolution:")
    print(f"{graph.raw_entity_count} raw entities")
    print(f"{len(graph.entities)} canonical entities")
    print(f"{merged} aliases/duplicates merged")
    print(f"{len(graph.rejected_relationships)} ambiguous/self-referential relationships rejected")
    for relationship in graph.rejected_relationships:
        print(
            f"- [{relationship.heading}] {relationship.source_entity} "
            f"--{relationship.relationship_type}--> {relationship.target_entity} "
            f"({relationship.reason})"
        )


def print_dry_run(chunks: list[Chunk], graph: ResolvedGraph) -> None:
    print("\nDRY RUN — Neo4j will not be modified")
    for chunk in chunks:
        print(f"\n[{chunk.heading}]")
        print("\nEntities:")
        entity_ids = graph.mentions[chunk.chunk_id]
        for entity in sorted(
            (graph.entities[entity_id] for entity_id in entity_ids),
            key=lambda item: (item.entity_type, item.name.casefold()),
        ):
            alias_suffix = ""
            if entity.aliases:
                alias_suffix = f" [aliases: {', '.join(sorted(entity.aliases, key=str.casefold))}]"
            print(f"- {entity.name} ({entity.entity_type}){alias_suffix}")

        print("\nRelationships:")
        relationships = [
            relationship
            for relationship in graph.relationships
            if chunk.chunk_id in relationship.source_chunk_ids
        ]
        if not relationships:
            print("- None")
        for relationship in relationships:
            source = graph.entities[relationship.source_id].name
            target = graph.entities[relationship.target_id].name
            print(f"- {source} --{relationship.relationship_type}--> {target}")


def print_verification(results: dict[str, object]) -> None:
    print("\nNeo4j verification:")
    print("\nEntity counts by type:")
    for row in results["entity_counts"]:
        print(f"- {row['entity_type']}: {row['count']}")

    print("\nRelationship counts by type:")
    for row in results["relationship_counts"]:
        print(f"- {row['relationship_type']}: {row['count']}")

    print("\nTeddy Agustinus direct entity neighborhood:")
    for row in results["teddy_neighborhood"]:
        print(
            f"- {row['relationship_type']}: {row['connected_name']} "
            f"({row['connected_type']})"
        )

    print("\nProject-to-technology relationships:")
    for row in results["project_technologies"]:
        print(f"- {row['project']} --{row['relationship_type']}--> {row['technology']}")

    teddy_count = results["teddy_count"][0]["count"]
    print(f"\nCanonical Teddy Agustinus nodes: {teddy_count}")
    if teddy_count != 1:
        raise RuntimeError(
            f"Verification failed: expected one Teddy Agustinus entity, found {teddy_count}."
        )

    document_count = results["document_count"][0]["count"]
    chunk_count = results["chunk_count"][0]["count"]
    entity_count = results["entity_count"][0]["count"]
    mention_count = results["mention_count"][0]["count"]
    semantic_total = results["semantic_relationship_count"][0]["count"]
    print("\nNeo4j dataset totals:")
    print(f"- Documents: {document_count}")
    print(f"- Chunks: {chunk_count}")
    print(f"- Entities: {entity_count}")
    print(f"- MENTIONS relationships: {mention_count}")
    print(f"- Semantic relationships: {semantic_total}")


def source_label(path: Path) -> str:
    try:
        return path.resolve().relative_to(REPOSITORY_ROOT).as_posix()
    except ValueError:
        return path.resolve().as_posix()


def run(args: argparse.Namespace) -> None:
    load_dotenv(REPOSITORY_ROOT / ".env")
    environment = require_environment(args.dry_run)
    source_path = args.source.resolve()
    if not source_path.is_file():
        raise FileNotFoundError(f"Knowledge-base source file not found: {source_path}")

    store = None
    try:
        if not args.dry_run:
            store = Neo4jStore(
                environment["NEO4J_URI"],
                environment["NEO4J_USERNAME"],
                environment["NEO4J_PASSWORD"],
            )
            print("Connecting to Neo4j Aura...")
            store.verify_connectivity()
            print("Neo4j connectivity verified.")

        markdown = source_path.read_text(encoding="utf-8")
        chunks = parse_markdown_sections(
            markdown,
            document_id=DATASET_ID,
            source_file=source_label(source_path),
            max_chars=args.max_chunk_chars,
        )
        print(f"Loaded {DOCUMENT_TITLE}: {len(chunks)} semantic chunks.")

        extractor = OpenAIExtractor(
            api_key=environment["OPENAI_API_KEY"],
            model=environment["OPENAI_EXTRACTION_MODEL"],
        )
        extractions = extract_chunks(chunks, extractor)
        graph = resolve_extractions(chunks, extractions)
        print_resolution_statistics(graph)

        if args.dry_run:
            print_dry_run(chunks, graph)
            return

        assert store is not None
        print("\nWriting the resolved graph with idempotent MERGE operations...")
        store.upsert(chunks, graph)
        print("Graph write complete. Running read-only verification queries...")
        print_verification(store.verification())
    finally:
        if store is not None:
            store.close()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Extract and ingest Teddy's canonical personal knowledge graph."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Extract and resolve the graph without connecting to or modifying Neo4j.",
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=DEFAULT_SOURCE_PATH,
        help=f"Markdown knowledge-base path (default: {SOURCE_FILE_LABEL}).",
    )
    parser.add_argument(
        "--max-chunk-chars",
        type=int,
        default=6_000,
        help="Sentence-aware split threshold for unusually large sections.",
    )
    return parser


def main() -> int:
    try:
        run(build_parser().parse_args())
        return 0
    except (
        FileNotFoundError,
        RuntimeError,
        ValueError,
        OpenAIError,
        Neo4jError,
        DriverError,
    ) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
