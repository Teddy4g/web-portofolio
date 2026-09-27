# Canonical Personal Knowledge Graph Ingestion

This directory implements only the first GraphRAG indexing stage for Teddy's
personal knowledge base. It does not create embeddings, vector indexes,
communities, summaries, retrieval, or chatbot behavior.

## Architecture

```text
data/personal_knowledge.md
        ↓
Markdown `##` chunks
        ↓
OpenAI structured extraction
        ↓
Entity resolution
        ↓
Neo4j Aura
 ├── Document
 ├── Chunk
 ├── Entity (+ semantic type label)
 └── Relationships
```

Each Markdown `##` section is a semantic chunk. The configured OpenAI model
returns a Pydantic-validated entity/relationship structure. A deterministic
resolver canonicalizes safe aliases (including Ted/Teddy/Teddy Agustinus,
BigQuery/Google BigQuery, SAP S4HANA/SAP S/4HANA, and
RAG/Retrieval-Augmented Generation) before anything is written.

The graph uses this provenance model:

```text
(Document)-[:HAS_CHUNK]->(Chunk)-[:MENTIONS]->(Entity)
                                      (Entity)-[:SEMANTIC_FACT]->(Entity)
```

Every generated node and relationship has `dataset_id: "ted-personal-kb-v1"`.

## Environment

Copy `.env.example` to the repository's existing `.env` file and fill in real
values without committing the file:

```dotenv
NEO4J_URI=neo4j+s://b515b29b.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-aura-password
OPENAI_API_KEY=your-openai-api-key
OPENAI_EXTRACTION_MODEL=your-structured-output-model
```

The dry run requires only `OPENAI_API_KEY` and `OPENAI_EXTRACTION_MODEL`. A real
ingestion requires all five variables. Missing values fail before external work
begins, and secret values are never logged.

## Installation

From the repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r scripts/graphrag/requirements.txt
```

## Inspect extraction without writing

```bash
python scripts/graphrag/ingest.py --dry-run
```

The command calls the configured extraction model, resolves aliases, and prints
the canonical entities and relationships for every chunk. It does not connect
to or modify Neo4j.

## Ingest and verify

After reviewing the dry run:

```bash
python scripts/graphrag/ingest.py
```

The importer verifies Aura connectivity, creates uniqueness constraints for
`Document.id`, `Chunk.id`, and `Entity.id`, writes the dataset, and runs read-only
verification queries. It prints entity counts, relationship counts, Teddy's
direct neighborhood, project-to-technology links, and the number of canonical
Teddy nodes.

## Idempotency

Entity IDs are deterministic from normalized `entity_type + canonical_name`.
Neo4j nodes and relationships are written with `MERGE`, while source provenance
is stored in `source_chunk_ids`. Running the same ingestion repeatedly updates
this dataset rather than duplicating it. The importer never deletes unrelated
Neo4j data.

## Tests

Tests do not call OpenAI or Neo4j:

```bash
python -m unittest discover -s scripts/graphrag/tests -v
```

## Neo4j Browser queries

Entity counts by type:

```cypher
MATCH (e:Entity {dataset_id: "ted-personal-kb-v1"})
RETURN e.entity_type AS entity_type, count(e) AS count
ORDER BY entity_type;
```

Relationship counts by type:

```cypher
MATCH ()-[r {dataset_id: "ted-personal-kb-v1"}]->()
RETURN type(r) AS relationship_type, count(r) AS count
ORDER BY relationship_type;
```

Teddy's direct semantic neighborhood:

```cypher
MATCH (t:Entity {name: "Teddy Agustinus", dataset_id: "ted-personal-kb-v1"})-[r]-(connected:Entity)
RETURN type(r), connected.name, connected.entity_type
ORDER BY type(r), connected.name;
```

Project-to-technology links:

```cypher
MATCH (p:Entity:Project {dataset_id: "ted-personal-kb-v1"})-[r]->
      (technology:Entity:Technology {dataset_id: "ted-personal-kb-v1"})
RETURN p.name, type(r), technology.name
ORDER BY p.name, type(r), technology.name;
```

Verify the canonical Teddy entity is unique:

```cypher
MATCH (t:Entity {name: "Teddy Agustinus", dataset_id: "ted-personal-kb-v1"})
RETURN count(t) AS canonical_teddy_nodes;
```

Inspect source provenance:

```cypher
MATCH (d:Document {id: "ted-personal-kb-v1"})-[:HAS_CHUNK]->(c:Chunk)-[:MENTIONS]->(e:Entity)
RETURN c.order, c.heading, collect(e.name) AS mentioned_entities
ORDER BY c.order;
```
