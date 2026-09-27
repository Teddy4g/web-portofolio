# React + Vite

## Portfolio chatbot

The chatbot uses a pre-embedded JSON knowledge index for cosine-similarity
retrieval, then Gemini for the grounded response. OpenAI creates only the
visitor query embedding at runtime. The JSON index is bundled with the
serverless API, so no database connection or MongoDB environment variables are
required.

Required deployment variables:

```ini
OPENAI_API_KEY=
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_EMBEDDING_DIMENSIONS=1536
GEMINI_API_KEY=
GEMINI_CHAT_MODEL=gemini-3.5-flash-lite
JSON_RAG_TOP_K=5
JSON_RAG_MIN_SCORE=0.60
```

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
