from __future__ import annotations

from openai import OpenAI

from chunking import Chunk
from models import ChunkExtraction
from prompt import SYSTEM_PROMPT, build_chunk_input


class OpenAIExtractor:
    def __init__(self, api_key: str, model: str) -> None:
        self.model = model
        self.client = OpenAI(api_key=api_key)

    def extract(self, chunk: Chunk) -> ChunkExtraction:
        response = self.client.responses.parse(
            model=self.model,
            instructions=SYSTEM_PROMPT,
            input=build_chunk_input(chunk.heading, chunk.text),
            text_format=ChunkExtraction,
        )
        if response.output_parsed is None:
            raise RuntimeError(
                f"The extraction model returned no validated output for chunk '{chunk.heading}'."
            )
        return response.output_parsed
