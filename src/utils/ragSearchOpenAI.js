/**
 * RAG Search using OpenAI text-embedding-3-small (Browser Runtime)
 *
 * ⚠️  DEVELOPMENT ONLY: The VITE_OPENAI_API_KEY is visible in the browser.
 *     For production, replace this with a Vercel serverless function proxy.
 *
 * Flow:
 * 1. Read API key from import.meta.env.VITE_OPENAI_API_KEY
 * 2. POST the user's query to OpenAI Embeddings API → get 1536-dim vector
 * 3. Run cosine similarity against pre-computed 1536-dim chunk vectors
 * 4. Return top-K results
 *
 * === Why 1536 dimensions? ===
 * text-embedding-3-small produces 1536-dim vectors by default.
 * More dimensions = finer-grained semantic distinctions.
 * Compare: MiniLM = 384-dim, OpenAI small = 1536-dim, OpenAI large = 3072-dim
 */

import { cosineSimilarity } from "./ragSearch.js";

const OPENAI_EMBED_URL = "https://api.openai.com/v1/embeddings";
const OPENAI_MODEL = "text-embedding-3-small";

/**
 * Calls the OpenAI Embeddings API to convert a query string into a 1536-dim vector.
 *
 * @param {string} text - The user's query
 * @returns {Promise<number[]>} The embedding vector
 */
async function embedWithOpenAI(text) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey || apiKey === "your-openai-api-key-here") {
    throw new Error(
      "Missing OpenAI API key. Set VITE_OPENAI_API_KEY in your .env file."
    );
  }

  const response = await fetch(OPENAI_EMBED_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: text,
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `OpenAI API error ${response.status}: ${err?.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  return data.data[0].embedding; // number[] of length 1536
}

/**
 * RAG search using OpenAI embeddings.
 * Uses the same cosineSimilarity() as ragSearch.js — math is identical,
 * only the embedding source differs (API call vs local WASM model).
 *
 * @param {string} query         - User's question
 * @param {Array}  chunks        - Pre-embedded chunks with 1536-dim .embedding arrays
 * @param {Object} options
 * @param {number} options.topK  - Max results to return (default: 3)
 * @param {number} options.minScore - Minimum cosine score (default: 0.25)
 *
 * @returns {Promise<Array>} Sorted array of { chunk, score } objects
 */
export async function ragSearchOpenAI(query, chunks, options = {}) {
  const { topK = 3, minScore = 0.25 } = options;

  const validChunks = chunks.filter(
    (c) => c.embedding && c.embedding.length > 0
  );

  if (validChunks.length === 0) {
    throw new Error(
      "No OpenAI-embedded chunks found. Run scripts/generateEmbeddingsOpenAI.mjs first."
    );
  }

  // Embed the query via OpenAI API
  const queryVector = await embedWithOpenAI(query);

  // Score each chunk
  const scored = validChunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryVector, chunk.embedding),
  }));

  // Sort and filter
  return scored
    .sort((a, b) => b.score - a.score)
    .filter((r) => r.score >= minScore)
    .slice(0, topK);
}
