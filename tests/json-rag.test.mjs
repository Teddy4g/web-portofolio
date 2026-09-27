import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  answerWithJsonRag,
  buildAnswerInput,
  buildContext,
  cosineSimilarity,
  GEMINI_QUOTA_MESSAGE,
  GREETING_MESSAGE,
  getRagConfig,
  isGeminiQuotaError,
  isGreeting,
  OUT_OF_CONTEXT_MESSAGE,
} from '../api/_lib/json-rag.js';
import { parseCsv, readQaRows } from '../scripts/json-rag/csv.js';
import { QUICK_ANSWERS } from '../src/data/chatbotTemplates.js';

const environment = {
  OPENAI_API_KEY: 'test',
  GEMINI_API_KEY: 'gemini-test',
};

function makeKnowledgeIndex(entries) {
  return {
    version: 1,
    embeddingModel: 'text-embedding-3-small',
    embeddingDimensions: 1536,
    entries,
  };
}

test('CSV parser handles quoted commas and escaped quotes', () => {
  const rows = parseCsv('"question","answer"\n"Who?","A, with ""quotes""."\n');
  assert.deepEqual(rows, [
    ['question', 'answer'],
    ['Who?', 'A, with "quotes".'],
  ]);
});

test('canonical Q&A dataset and generated JSON index are valid', async () => {
  const csv = await readFile(new URL('../data/teddy_qa.csv', import.meta.url), 'utf8');
  const rows = readQaRows(csv);
  const index = JSON.parse(
    await readFile(new URL('../data/teddy_knowledge.json', import.meta.url), 'utf8'),
  );

  assert.equal(rows.length, 27);
  assert.equal(index.entries.length, rows.length);
  assert.equal(index.embeddingModel, 'text-embedding-3-small');
  assert.equal(index.embeddingDimensions, 1536);
  assert.equal(index.entries[0].embedding.length, 1536);
  assert.equal(index.entries[0].id, rows[0]._id);
});

test('duplicate questions are rejected', () => {
  const csv = 'question,answer\nWho?,First\nwho?,Second\n';
  assert.throws(() => readQaRows(csv), /Duplicate question/);
});

test('quick-answer chips have complete local templates', () => {
  assert.equal(QUICK_ANSWERS.length, 3);
  assert.equal(new Set(QUICK_ANSWERS.map(({ id }) => id)).size, QUICK_ANSWERS.length);
  for (const template of QUICK_ANSWERS) {
    assert.ok(template.label);
    assert.ok(template.prompt);
    assert.ok(template.category);
    assert.ok(template.answer.length > 40);
  }
});

test('RAG config validates only the two API secrets', () => {
  const config = getRagConfig(environment);
  assert.equal(config.embeddingModel, 'text-embedding-3-small');
  assert.equal(config.embeddingDimensions, 1536);
  assert.equal(config.geminiModel, 'gemini-3.5-flash-lite');
  assert.equal(config.minScore, 0.6);
  assert.throws(() => getRagConfig({}), /OPENAI_API_KEY, GEMINI_API_KEY/);
});

test('cosine similarity ranks aligned vectors highest', () => {
  assert.equal(cosineSimilarity([1, 0], [1, 0]), 1);
  assert.equal(cosineSimilarity([1, 0], [0, 1]), 0);
  assert.equal(cosineSimilarity([1], [1, 0]), 0);
});

test('grounding context contains only retrieved Q&A records', () => {
  const matches = [{ question: 'Who is Teddy?', answer: 'Teddy is a student.', score: 0.9 }];
  assert.equal(buildContext(matches), '[1] Question: Who is Teddy?\nAnswer: Teddy is a student.');
  assert.match(buildAnswerInput('Tell me about Teddy', matches), /Retrieved Q&A context/);
});

test('greetings bypass API retrieval', async () => {
  assert.equal(isGreeting('hi'), true);
  assert.equal(isGreeting('Hi!!!'), true);
  assert.equal(isGreeting('halo'), true);
  assert.equal(isGreeting('What does Teddy do?'), false);

  const result = await answerWithJsonRag('Hi!', {});
  assert.equal(result.answer, GREETING_MESSAGE);
  assert.equal(result.greeting, true);
  assert.deepEqual(result.matches, []);
});

test('JSON RAG embeds the query, ranks local records, and calls Gemini', async () => {
  let embeddingOptions;
  let generatedRequest;
  const openai = {
    embeddings: {
      create: async (options) => {
        embeddingOptions = options;
        return { data: [{ embedding: [1, 0] }] };
      },
    },
  };
  const gemini = {
    models: {
      generateContent: async (options) => {
        generatedRequest = options;
        return { text: 'Teddy is an AI and data specialist.' };
      },
    },
  };
  const knowledgeIndex = makeKnowledgeIndex([
    { id: 'relevant', question: 'Who is Teddy?', answer: 'An AI and data specialist.', embedding: [1, 0] },
    { id: 'unrelated', question: 'Other', answer: 'Other answer.', embedding: [0, 1] },
  ]);

  const result = await answerWithJsonRag(
    'Who is Teddy?',
    environment,
    { openai, gemini, knowledgeIndex },
  );

  assert.equal(embeddingOptions.model, 'text-embedding-3-small');
  assert.equal(embeddingOptions.dimensions, 1536);
  assert.equal(generatedRequest.model, 'gemini-3.5-flash-lite');
  assert.match(generatedRequest.contents, /Who is Teddy\?/);
  assert.equal(result.matches[0].id, 'relevant');
  assert.equal(result.answer, 'Teddy is an AI and data specialist.');
  assert.equal(result.match, true);
});

test('JSON RAG refuses generation when retrieval is below the threshold', async () => {
  let generationCalled = false;
  const openai = {
    embeddings: { create: async () => ({ data: [{ embedding: [1, 0] }] }) },
  };
  const gemini = {
    models: {
      generateContent: async () => {
        generationCalled = true;
        return { text: 'This should not be used.' };
      },
    },
  };
  const knowledgeIndex = makeKnowledgeIndex([
    { id: 'unrelated', question: 'Unrelated', answer: 'No', embedding: [0, 1] },
  ]);

  const result = await answerWithJsonRag(
    'Unknown question',
    environment,
    { openai, gemini, knowledgeIndex },
  );

  assert.equal(result.fallback, true);
  assert.equal(result.answer, OUT_OF_CONTEXT_MESSAGE);
  assert.equal(generationCalled, false);
});

test('Gemini quota exhaustion returns the configured tired-assistant message', async () => {
  const openai = {
    embeddings: { create: async () => ({ data: [{ embedding: [1, 0] }] }) },
  };
  const gemini = {
    models: {
      generateContent: async () => {
        throw Object.assign(new Error('RESOURCE_EXHAUSTED: quota_exceeded'), { status: 429 });
      },
    },
  };
  const knowledgeIndex = makeKnowledgeIndex([
    { id: 'who', question: 'Who?', answer: 'Teddy.', embedding: [1, 0] },
  ]);

  const result = await answerWithJsonRag(
    'Who?',
    environment,
    { openai, gemini, knowledgeIndex },
  );

  assert.equal(result.answer, GEMINI_QUOTA_MESSAGE);
  assert.equal(result.quotaExhausted, true);
  assert.equal(isGeminiQuotaError({ status: 429 }), true);
  assert.equal(isGeminiQuotaError(new Error('invalid API key')), false);
});
