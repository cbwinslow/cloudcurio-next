# CloudCurio — Next Steps 2 Overlay

Adds:
- Agents Worker: real OpenRouter execution, R2 artifact writes, **WebSocket live logs**.
- R2 ingest endpoint: `/api/rag/ingest-r2` to embed files by R2 key into Vectorize + D1 doc record.
- Crawler Worker: embeds crawled text into Vectorize; adds **Scheduler DO** with alarms.
- Research UI: `/research/schedules` to add/delete interval schedules; triggers DO sync.

## Apply
Unzip at repo root. Then:
- In `workers/agents`: add `OPENROUTER_API_KEY` (Wrangler secret or var) and deploy.
- In `workers/crawler`: add `OPENROUTER_API_KEY`, append the DO binding in `wrangler.toml`:
  ```toml
  [[durable_objects.bindings]]
  name = "SCHEDULER"
  class_name = "Scheduler"
  ```
  (this overlay includes `wrangler.do.append.toml` with the stanza. Merge it.)
- Run D1 migration `0002_schedules.sql`.

## Routes
- Agents Worker: `POST /enqueue`, `POST /process`, `GET /status`, `WS /ws`.
- Web: `POST /api/rag/ingest-r2` (admin + Turnstile), `/research/schedules` UI.
- Crawler Worker: `POST /scheduler/sync`, `GET /run`.

