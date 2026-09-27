from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass


SECTION_PATTERN = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)
SENTENCE_BOUNDARY = re.compile(r"(?<=[.!?])\s+(?=[A-Z0-9])")


@dataclass(frozen=True)
class Chunk:
    chunk_id: str
    document_id: str
    heading: str
    text: str
    order: int
    source_file: str


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"[^a-z0-9]+", "-", ascii_value).strip("-")


def split_sentences(text: str, max_chars: int) -> list[str]:
    """Split oversized text without cutting a sentence in half."""
    if max_chars < 1:
        raise ValueError("max_chars must be a positive integer.")
    if len(text) <= max_chars:
        return [text.strip()]

    sentences: list[str] = []
    for paragraph in re.split(r"\n\s*\n", text.strip()):
        sentences.extend(part.strip() for part in SENTENCE_BOUNDARY.split(paragraph) if part.strip())

    parts: list[str] = []
    current: list[str] = []
    current_length = 0
    for sentence in sentences:
        separator_length = 1 if current else 0
        if current and current_length + separator_length + len(sentence) > max_chars:
            parts.append(" ".join(current))
            current = []
            current_length = 0
        current.append(sentence)
        current_length += separator_length + len(sentence)
    if current:
        parts.append(" ".join(current))
    return parts


def parse_markdown_sections(
    markdown: str,
    document_id: str,
    source_file: str,
    max_chars: int = 6_000,
) -> list[Chunk]:
    matches = list(SECTION_PATTERN.finditer(markdown))
    if not matches:
        raise ValueError("The knowledge base has no level-two (##) Markdown sections.")

    chunks: list[Chunk] = []
    order = 1
    for index, match in enumerate(matches):
        heading = match.group(1).strip()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(markdown)
        section_text = markdown[match.end() : end].strip()
        if not section_text:
            raise ValueError(f"Section '{heading}' is empty.")

        pieces = split_sentences(section_text, max_chars=max_chars)
        base_id = slugify(heading)
        for piece_index, piece in enumerate(pieces, start=1):
            chunk_id = base_id if len(pieces) == 1 else f"{base_id}-{piece_index}"
            chunks.append(
                Chunk(
                    chunk_id=chunk_id,
                    document_id=document_id,
                    heading=heading,
                    text=piece,
                    order=order,
                    source_file=source_file,
                )
            )
            order += 1
    return chunks
