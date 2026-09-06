/**
 * Dev-only: serve Vercel-style `api/*.js` handlers from the Vite server
 * so first-party analytics ingest works at localhost:5173/api/analytics.
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ALLOWED = new Set(['analytics', 'analytics-rollup']);

function readJsonBody(req) {
  return new Promise((resolveBody, reject) => {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
      resolveBody({});
      return;
    }
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) {
        resolveBody({});
        return;
      }
      try {
        resolveBody(JSON.parse(raw));
      } catch {
        resolveBody(null);
      }
    });
    req.on('error', reject);
  });
}

export function viteDevApiPlugin(env = {}) {
  return {
    name: 'yarntrails-dev-api',
    configureServer(server) {
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined && value !== undefined && value !== '') {
          process.env[key] = String(value);
        }
      }

      server.middlewares.use(async (req, res, next) => {
        const path = (req.url || '').split('?')[0];
        if (!path.startsWith('/api/')) {
          next();
          return;
        }
        const name = path.slice('/api/'.length);
        if (!ALLOWED.has(name)) {
          next();
          return;
        }
        const file = resolve(process.cwd(), 'api', `${name}.js`);
        if (!existsSync(file)) {
          next();
          return;
        }

        try {
          const body = await readJsonBody(req);
          if (body === null) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return;
          }

          const { default: handler } = await import(`${pathToFileURL(file).href}?t=${Date.now()}`);
          let ended = false;
          const vercelRes = {
            statusCode: 200,
            setHeader(key, value) {
              res.setHeader(key, value);
            },
            status(code) {
              this.statusCode = code;
              res.statusCode = code;
              return this;
            },
            json(payload) {
              if (ended) return this;
              ended = true;
              res.statusCode = this.statusCode;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(payload));
              return this;
            },
            end(payload) {
              if (ended) return this;
              ended = true;
              res.statusCode = this.statusCode;
              res.end(payload);
              return this;
            },
          };

          await handler({
            method: req.method,
            headers: req.headers,
            body,
            socket: req.socket,
          }, vercelRes);

          if (!ended) {
            res.statusCode = vercelRes.statusCode;
            res.end();
          }
        } catch (error) {
          console.error(`[dev-api] ${path}`, error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'API handler failed' }));
          }
        }
      });
    },
  };
}
