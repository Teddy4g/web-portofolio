/**
 * RAG Cosine Similarity Search Engine (Step 4)
 *
 * This module handles:
 * 1. Loading the embedding model in the browser (runs in a Web Worker via transformers.js)
 * 2. Embedding a user's query into a 384-dim vector (live at query time)
 * 3. Computing cosine similarity between the query vector and all pre-computed chunk vectors
 * 4. Returning the top-N most semantically similar chunks as the "answer"
 *
 * === How Cosine Similarity Works ===
 *
 * Given two vectors A and B:
 *
 *   similarity = (A · B) / (|A| × |B|)
 *
 * Because all-MiniLM-L6-v2 outputs NORMALIZED vectors (magnitude = 1),
 * this simplifies to just the dot product:
 *
 *   similarity = A · B = Σ(A[i] × B[i])
 *
 * Score ranges from -1 (opposite) to 1 (identical). In practice, 0.5+ is a good match.
 */

import { pipeline, env } from "@huggingface/transformers";

// ─────────────────────────────────────────────────────────────────
// Model: paraphrase-multilingual-MiniLM-L12-v2
//   - Supports 50+ languages including Indonesian (Bahasa), English,
//     Chinese, Japanese, Spanish, French, Arabic, and more.
//   - Output: 384-dim normalized vectors (same as all-MiniLM-L6-v2)
//   - Size: ~470 MB download, cached in browser IndexedDB after first load
// ─────────────────────────────────────────────────────────────────
const MODEL_ID = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

// ─────────────────────────────────────────────────────────────────
// Singleton Pattern: Load the model only ONCE per page session.
// Subsequent calls reuse the already-loaded pipeline.
// ─────────────────────────────────────────────────────────────────
let embedder = null;

/**
 * Loads and caches the all-MiniLM-L6-v2 model.
 * The model (~23 MB) is downloaded from HuggingFace on first use
 * and cached in the browser's IndexedDB cache automatically.
 *
 * @param {Function} onProgress - Optional callback (loaded, total) for progress UI
 * @returns {Promise<pipeline>} The ready-to-use feature extraction pipeline
 */
export async function loadEmbedder(onProgress) {
  if (embedder) return embedder;

  try {
    // v3 API: configure env before loading
    // Allow loading models from HuggingFace CDN (default in v3)
    env.allowLocalModels = false;
    env.allowRemoteModels = true;

    console.log("[RAG] Loading model: " + MODEL_ID + " …");

    // In @huggingface/transformers v3, model IDs still use Xenova namespace
    embedder = await pipeline("feature-extraction", MODEL_ID, {
      dtype: "fp32",
      progress_callback: (data) => {
        console.log("[RAG] Model progress:", data);
        if (onProgress && data.status === "downloading" && data.total > 0) {
          onProgress(data.loaded, data.total);
        }
      },
    });

    console.log("[RAG] Model loaded successfully ✓");
    return embedder;

  } catch (err) {
    console.error("[RAG] Failed to load embedding model:", err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────
// Core Math: Cosine Similarity
// ─────────────────────────────────────────────────────────────────

/**
 * Computes cosine similarity between two equal-length numeric arrays.
 *
 * Since all-MiniLM outputs L2-normalized vectors, we only need the dot product.
 * This is mathematically equivalent to cosine similarity when both vectors
 * have unit magnitude (magnitude = 1).
 *
 * @param {number[]} a - First vector (e.g., query embedding)
 * @param {number[]} b - Second vector (e.g., chunk embedding)
 * @returns {number} Similarity score between -1 and 1 (higher = more similar)
 */
export function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error(`Vector length mismatch: ${a.length} vs ${b.length}`);
  }
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

// ─────────────────────────────────────────────────────────────────
// Core Logic: Embed Query and Retrieve Top Chunks
// ─────────────────────────────────────────────────────────────────

/**
 * Embeds a user's text query and retrieves the most semantically similar chunks.
 *
 * Steps:
 * 1. Convert query text → 384-dim float vector using all-MiniLM-L6-v2
 * 2. Score each knowledge chunk using cosineSimilarity(queryVec, chunkVec)
 * 3. Sort all chunks by score descending
 * 4. Return the top-K chunks above the minimum threshold
 *
 * @param {string} query         - The user's natural language question
 * @param {Array}  chunks        - Array of knowledge chunks (must have .embedding and .text fields)
 * @param {Object} options
 * @param {number} options.topK  - How many top results to return (default: 3)
 * @param {number} options.minScore - Minimum similarity score to include (default: 0.25)
 * @param {Function} options.onProgress - Optional progress callback for model loading
 *
 * @returns {Promise<Array>} Sorted array of { chunk, score } objects
 */
export async function ragSearch(query, chunks, options = {}) {
  const { topK = 3, minScore = 0.25, onProgress } = options;

  // Guard: filter out any chunks that don't have embeddings yet
  const validChunks = chunks.filter(
    (c) => c.embedding && c.embedding.length > 0
  );

  if (validChunks.length === 0) {
    throw new Error("No embedded chunks found. Run scripts/generateEmbeddings.mjs first.");
  }

  // Step 1: Load model (from cache after first time)
  const model = await loadEmbedder(onProgress);

  // Step 2: Embed the query
  const output = await model(query, {
    pooling: "mean",
    normalize: true,
  });
  const queryVector = Array.from(output.data);

  // Step 3: Score each chunk
  const scored = validChunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryVector, chunk.embedding),
  }));

  // Step 4: Sort by score descending and filter by minimum threshold
  const topResults = scored
    .sort((a, b) => b.score - a.score)
    .filter((r) => r.score >= minScore)
    .slice(0, topK);

  return topResults;
}
