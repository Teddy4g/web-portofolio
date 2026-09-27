import 'dotenv/config';
import { answerWithJsonRag } from './_lib/json-rag.js';

const MAX_QUERY_LENGTH = 1_000;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
  if (!query) return res.status(400).json({ error: 'Query is required.' });
  if (query.length > MAX_QUERY_LENGTH) {
    return res.status(400).json({ error: `Query must be ${MAX_QUERY_LENGTH} characters or fewer.` });
  }

  const startedAt = Date.now();
  try {
    const result = await answerWithJsonRag(query);
    const topScore = result.matches[0]?.score ?? 0;
    return res.status(200).json({
      match: result.match,
      fallback: result.fallback,
      greeting: Boolean(result.greeting),
      quotaExhausted: Boolean(result.quotaExhausted),
      answer: result.answer,
      category: result.greeting
        ? 'Teddy’s assistant'
        : result.quotaExhausted
        ? 'Assistant unavailable'
        : result.match ? 'About Teddy' : 'Notice',
      score: topScore,
      latencyMs: Date.now() - startedAt,
      source: result.greeting
        ? 'Greeting response'
        : result.quotaExhausted
        ? 'Gemini quota fallback'
        : result.match ? 'Portfolio knowledge search' : 'RAG relevance filter',
    });
  } catch (error) {
    console.error('[JSON RAG error]', error);
    const configurationError = error.message?.startsWith('Missing required environment variable');
    return res.status(500).json({
      error: configurationError
        ? error.message
        : 'The portfolio assistant could not retrieve an answer right now.',
    });
  }
}
