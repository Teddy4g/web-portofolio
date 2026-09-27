import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import handler from './api/rag-search.js'

// Lightweight middleware to handle /api/rag-search in local Vite dev server
function apiPlugin() {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/rag-search' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              req.body = JSON.parse(body || '{}');
            } catch {
              req.body = {};
            }

            // Mock Vercel response helper methods
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            await handler(req, res);
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiPlugin()],
  optimizeDeps: {
    exclude: ['@huggingface/transformers'],
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
