import { dbExec } from "@/src/lib/db";
import { vec } from "@/src/lib/vectorize";
import { openrouterEmbed } from "@/src/lib/openrouter";
import { rateLimit } from "@/src/lib/kv";
import { requireAdmin } from "../../_util/guard";
import { verifyTurnstile } from "@/src/lib/turnstile";
export const runtime = "edge";
export async function POST(req: Request) {
  if (!(await rateLimit((req.headers.get('cf-connecting-ip')||'unknown'), 'rag:ingest'))) return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  const ip = req.headers.get('cf-connecting-ip')||undefined; const tkn = req.headers.get('x-turnstile-token')||"";
  const v = await verifyTurnstile(tkn, ip); if (!v?.success) return Response.json({ ok:false, error:'turnstile' }, { status: 400 });
  const forbidden = await requireAdmin(); if (forbidden) return forbidden;
  const { title, url, content } = await req.json(); const embedding = await openrouterEmbed(content); const id = crypto.randomUUID();
  await dbExec(`INSERT INTO documents (title, url, r2_key, content, created_at) VALUES (?, ?, ?, ?, datetime('now'))`, [title, url || null, null, content.slice(0, 20000)]);
  await (vec() as any).upsert([{ id, values: embedding, metadata: { title, url } }]);
  await dbExec(`INSERT INTO audit_log (actor, action, details, ts) VALUES (?, ?, ?, datetime('now'))`, ["admin", "rag.ingest", JSON.stringify({ id, title, url })]);
  return Response.json({ ok: true, id });
}
