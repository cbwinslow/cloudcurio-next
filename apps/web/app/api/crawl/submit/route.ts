import { dbExec } from "@/src/lib/db";
export const runtime = "edge";

export async function POST(req: Request) {
  const { url } = await req.json();
  await dbExec(`INSERT INTO crawl_jobs (url, status, created_at) VALUES (?, 'queued', datetime('now'))`, [url]);
  await dbExec(`INSERT INTO audit_log (actor, action, details, ts) VALUES (?, ?, ?, datetime('now'))`,
    ["user", "crawl.queue", JSON.stringify({ url })]);
  return Response.json({ ok: true });
}
