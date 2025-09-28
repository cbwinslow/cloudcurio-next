# CloudCurio.cc — Next.js + Cloudflare Starter (RAG + Agents + Crawler)

A production-ready starter for **cloudcurio.cc** on the Cloudflare platform:

- **Next.js (App Router)** on **Cloudflare Pages** via `@cloudflare/next-on-pages`
- **Auth.js (NextAuth)** with **JWT** sessions (edge runtime)
- **Cloudflare D1**: audit log, posts, documents, agent configs, crawl jobs
- **Cloudflare KV**: lightweight per-user memory store
- **Cloudflare R2**: file uploads & raw artifacts storage
- **Cloudflare Vectorize**: embeddings + semantic search
- **OpenRouter**: LLM inference for drafting posts, RAG, agents
- **RAG Chatbot**: sits on the knowledge base (Vectorize+D1 metadata)
- **Deep Research**: schedule crawls via a dedicated Worker with Cron
- **Agents**: minimal JSON spec + storage, run via OpenRouter tools-like calls

> Default domain baked in: **cloudcurio.cc** (can be overridden).

## Quick Start

```bash
# 1) Install deps
npm i

# 2) Copy env
cp .env.example .env.local
# Fill values (OpenRouter, NextAuth secret, Cloudflare bindings if needed locally)

# 3) Cloudflare resources
# Create/bind D1, KV, R2, Vectorize as in wrangler.toml
# Run migrations:
npx wrangler d1 migrations apply cloudcurio_db

# 4) Dev
npm run dev

# 5) Build
npm run build

# 6) Deploy to Cloudflare Pages
# (Set project to use this repo, build cmd: npm run pages:build, output: .vercel/output)
npm run deploy:pages
```

## Cloudflare Bindings

Bindings are defined in **wrangler.toml** and available via `cloudflare:env` (Edge runtime).
We also expose typed access via helpers in `src/lib/env.ts`.

- D1: `CLOUDCURIO_DB` (database name: `cloudcurio_db`)
- KV: `CLOUDCURIO_KV`
- R2: `CLOUDCURIO_BUCKET`
- Vectorize: `CLOUDCURIO_VEC`
- (Worker) Crawler scheduled via `workers/crawler/wrangler.toml`

## Structure

```
apps/web        # Next.js (App Router) app
workers/crawler # Cloudflare Worker that crawls & ingests -> D1 + Vectorize + R2
```

## Security

- JWT sessions, httpOnly cookies
- Audit log on every privileged action
- Server-side validation
- Minimal CORS surface (same-origin)
- Secrets from env only
- R2 signed upload URLs

## Next Steps

- Add RBAC (admin/moderator roles)
- Add multi-tenant projects/spaces
- Plug in Cloudflare Turnstile on forms/login
