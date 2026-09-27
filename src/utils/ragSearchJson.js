/** Frontend client for the server-side JSON RAG API. */
export async function ragSearchJson(query) {
  const response = await fetch('/api/rag-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || `HTTP ${response.status}`);
  }

  return [{
    chunk: {
      id: data.fallback ? 'json-rag-fallback' : 'json-rag-answer',
      category: data.category || 'About Teddy',
      text: data.answer,
    },
    score: data.score ?? 0,
    latencyMs: data.latencyMs,
    source: data.source || 'Portfolio knowledge search',
    fallback: Boolean(data.fallback),
    greeting: Boolean(data.greeting),
    quotaExhausted: Boolean(data.quotaExhausted),
  }];
}
