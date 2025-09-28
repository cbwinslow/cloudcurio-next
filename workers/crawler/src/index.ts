export interface Env {
  CLOUDCURIO_DB: D1Database;
  CLOUDCURIO_BUCKET: R2Bucket;
}

async function extractText(html: string) {
  // ultra-naive text extract
  return html.replace(/<script[\s\S]*?<\/script>/g, " ")
             .replace(/<style[\s\S]*?<\/style>/g, " ")
             .replace(/<[^>]+>/g, " ")
             .replace(/\s+/g, " ")
             .trim();
}

async function processQueued(env: Env) {
  const { results } = await env.CLOUDCURIO_DB.prepare(
    "SELECT id, url FROM crawl_jobs WHERE status = 'queued' LIMIT 5"
  ).all();
  for (const row of results ?? []) {
    const id = row.id as number;
    const url = row.url as string;
    try {
      await env.CLOUDCURIO_DB.prepare("UPDATE crawl_jobs SET status = 'running', updated_at = datetime('now') WHERE id = ?").bind(id).run();
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const text = await extractText(html);

      // Save raw snapshot to R2
      const key = `crawls/${id}.txt`;
      await env.CLOUDCURIO_BUCKET.put(key, text);

      // Insert document
      await env.CLOUDCURIO_DB.prepare(
        "INSERT INTO documents (title, url, r2_key, content, created_at) VALUES (?, ?, ?, ?, datetime('now'))"
      ).bind(url, url, key, text.slice(0, 20000)).run();

      await env.CLOUDCURIO_DB.prepare("UPDATE crawl_jobs SET status='done', updated_at=datetime('now') WHERE id=?").bind(id).run();
    } catch (e: any) {
      await env.CLOUDCURIO_DB.prepare(
        "UPDATE crawl_jobs SET status='error', last_error=?, updated_at=datetime('now') WHERE id=?"
      ).bind(String(e?.message||e), id).run();
    }
  }
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    await processQueued(env);
  },
  async fetch(req: Request, env: Env) {
    const url = new URL(req.url);
    if (url.pathname === "/health") return new Response("ok");
    if (url.pathname === "/run") { await processQueued(env); return new Response("ran"); }
    return new Response("not found", { status: 404 });
  }
} satisfies ExportedHandler<Env>;
