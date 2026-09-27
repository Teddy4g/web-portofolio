import 'dotenv/config';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import OpenAI from 'openai';
import { readQaRows } from './csv.js';

const sourcePath = resolve(process.argv[2] || 'data/teddy_qa.csv');
const outputPath = resolve(process.argv[3] || 'data/teddy_knowledge.json');
const apiKey = process.env.OPENAI_API_KEY?.trim();

if (!apiKey) {
  console.error('Missing required environment variable: OPENAI_API_KEY');
  process.exit(1);
}

const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL?.trim() || 'text-embedding-3-small';
const requestedDimensions = Number.parseInt(process.env.OPENAI_EMBEDDING_DIMENSIONS, 10);
const embeddingDimensions = Number.isInteger(requestedDimensions) && requestedDimensions > 0
  ? requestedDimensions
  : 1536;

const rows = readQaRows(await readFile(sourcePath, 'utf8'));
console.log(`Validated ${rows.length} Q&A records from ${sourcePath}.`);

const openai = new OpenAI({ apiKey });
console.log(`Generating ${embeddingDimensions}-dimension embeddings with ${embeddingModel}...`);
const response = await openai.embeddings.create({
  model: embeddingModel,
  dimensions: embeddingDimensions,
  input: rows.map((row) => row.content),
});

if (response.data.length !== rows.length) {
  throw new Error(`Expected ${rows.length} embeddings, received ${response.data.length}.`);
}

const index = {
  version: 1,
  source: 'data/teddy_qa.csv',
  embeddingModel,
  embeddingDimensions,
  generatedAt: new Date().toISOString(),
  entries: rows.map((row, position) => ({
    id: row._id,
    question: row.question,
    answer: row.answer,
    content: row.content,
    embedding: response.data[position].embedding,
  })),
};

await writeFile(outputPath, `${JSON.stringify(index)}\n`, 'utf8');
console.log(`Saved ${index.entries.length} embedded records to ${outputPath}.`);
