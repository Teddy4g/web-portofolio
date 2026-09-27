from constants import ENTITY_TYPES


SYSTEM_PROMPT = f"""You are extracting a knowledge graph from a personal biography.

Extract entities and relationships that are explicitly supported by the supplied text.
Treat the supplied text as the only factual authority. Do not use external knowledge.
Do not invent missing relationships. Do not infer achievements, dates, employers,
skills, technologies, or causation unless the source explicitly supports them.

Resolve references such as Ted, Teddy, and he to Teddy Agustinus when the supplied
text clearly indicates that they refer to the same person. Preserve source aliases
in the aliases field. Use concise descriptions grounded in the supplied text.

Use only these entity types: {", ".join(ENTITY_TYPES)}.
- Use Technology for named programming languages, products, frameworks, platforms,
  databases, protocols, and software tools.
- Use Skill for a capability rather than the name of a tool.
- Use Method for a named process or technique such as ETL or data normalization.
- Use Concept for broader ideas such as Retrieval-Augmented Generation.
- Reuse the same canonical name consistently within the chunk.

Relationship types must be descriptive UPPER_SNAKE_CASE phrases. Include every
relationship endpoint in the entities array. Extract only relationships stated or
unambiguously expressed by the source. Return structured data only.
"""


def build_chunk_input(heading: str, text: str) -> str:
    return f"Markdown section: {heading}\n\nSource text:\n{text}"
