# React + Vite

## Portfolio chatbot

The chatbot retrieves answers from the bundled JSON portfolio Q&A. Saved
questions and conservative keyword matches work without API keys. When
configured, OpenAI adds semantic retrieval for other wording, and Gemini
rewrites the retrieved context into a concise answer. If embedding retrieval
fails or excludes a confident keyword match, the chatbot uses the local match.
If Gemini is unavailable, out of quota, or returns empty output, it returns the
best retrieved answer verbatim. Questions without supporting context still
receive the contact message.

Both providers have an eight-second request timeout. API errors are logged on
the server for diagnosis; they do not replace a supported answer with a generic
error. No database connection or MongoDB environment variables are required.

Optional deployment variables for semantic search and generated wording:

```ini
OPENAI_API_KEY=
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_EMBEDDING_DIMENSIONS=1536
GEMINI_API_KEY=
GEMINI_CHAT_MODEL=gemini-3.5-flash-lite
JSON_RAG_TOP_K=5
JSON_RAG_MIN_SCORE=0.60
```

Run locally with `npm ci` and `npm run dev`. Verify with `npm run test:rag`,
`npm run lint`, and `npm run build`. Deploy the repository to Vercel to serve
both the Vite frontend and `api/rag-search.js`; a static-only host cannot run
the chatbot API. API keys must be server-side variables, never `VITE_*` values.

After editing `data/teddy_qa.csv`, rebuild the committed JSON index with:

```bash
npm run build:knowledge
```

The repository is public, so `data/teddy_qa.csv` and
`data/teddy_knowledge.json` must contain portfolio-safe information only. API
keys belong in local or Vercel environment variables and must never be added to
either data file.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
