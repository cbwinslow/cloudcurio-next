# Cloudcurio Next.js Blog (Cloudflare Ready)

Feature-rich Next.js + MDX blog with GitHub integrations, AI search (Vectorize), RAG chat, data pipelines (FRED, Census, FBI, Stocks), GraphQL, and Cloudflare-native deploy.

## Quickstart
```bash
npm ci
echo "GITHUB_TOKEN=..." > .env
npm run dev
```

## Cloudflare resources
Create and bind (fill IDs in wrangler.toml):
```bash
wrangler kv namespace create KV_VIEWS
wrangler d1 create cloudcurio_blog
wrangler d1 execute cloudcurio_blog --file migrations.sql
wrangler r2 bucket create cloudcurio-assets
wrangler r2 bucket create cloudcurio-docs
wrangler vectorize create cloudcurio-posts
wrangler queues create cloudcurio-audit
wrangler queues create cloudcurio-ingest
# optional
wrangler hyperdrive create cloudcurio-hyper --connection-string='postgres://...'
```

## Endpoints
- `/api/search` – semantic search (Vectorize)
- `/api/chat` – RAG Q&A
- `/api/ai/summarize` – TL;DR helper
- `/api/github/*` – repos/pulls/actions
- `/api/ingest/kickoff` – enqueue data jobs (FRED/ACS/FBI/Stocks)
- `/api/ingest/upload` – upload docs to R2 → index
- `/api/graphql` – GraphQL over D1 datasets

## Admin & Auth
- `/admin/*` and `/logs` gated by Cloudflare Access (middleware checks `Cf-Access-Jwt-Assertion`).

## SEO/Analytics
- `robots.txt`, `sitemap.xml`, `/api/og` social cards
- Cloudflare Web Analytics + GA4 hooks
- Zaraz template: `zaraz-config.template.json`

## DNS
- Import `dns/cloudcurio.cc.zone` (edit hostnames) in Cloudflare DNS.

## Deploy
- `npm run cf:build && npm run cf:deploy` (or push to `main` to trigger GitHub Actions).

## Notes
- Set FRED/Census/FBI/Stocks API keys in environment.
- Workers AI models: `@cf/meta/llama-3.1-8b-instruct` and `@cf/baai/bge-base-en-v1.5`.
