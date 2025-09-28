import { r2 } from "@/src/lib/r2";
import { dbExec } from "@/src/lib/db";
import { vec } from "@/src/lib/vectorize";
import { openrouterEmbed } from "@/src/lib/openrouter";
import { rateLimit } from "@/src/lib/kv";
import { requireAdmin } from "../../_util/guard";
import { verifyTurnstile } from "@/src/lib/turnstile";
export const runtime = "edge";

function toChunks(text: string, max = 1500) {
  const out: string[] = []; let i = 0;
  while (i < text.length) { out.push(text.slice(i, i+max)); i += max; }
  return out;
}

export async function POST(req: Request) {
  if (!(await rateLimit((req.headers.get('cf-connecting-ip')||'unknown'), 'rag:ingest_r2', 20, 60))) return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  const ip = req.headers.get('cf-connecting-ip')||undefined; const tkn = req.headers.get('x-turnstile-token')||"";
  const v = await verifyTurnstile(tkn, ip); if (!v?.success) return Response.json({ ok:false, error:'turnstile' }, { status: 400 });
  const forbidden = await requireAdmin(); if (forbidden) return forbidden;

  const { key, title } = await req.json();
  const obj = await r2().get(key); if (!obj) return Response.json({ ok:false, error:'not_found' }, { status: 404 });
  const text = await obj.text();
  const chunks = toChunks(text);

  await dbExec(`INSERT INTO documents (title, url, r2_key, content, created_at) VALUES (?, ?, ?, ?, datetime('now'))`, [title || key, null, key, text.slice(0, 20000)]);

  // embed chunks
  for (const ch of chunks) {
    const embedding = await openrouterEmbed(ch);
    const id = crypto.randomUUID();
    // @ts-ignore vectorize typing
    await (vec() as any).upsert([{ id, values: embedding, metadata: { title: title || key, r2_key: key } }]);
  }

  await dbExec(`INSERT INTO audit_log (actor, action, details, ts) VALUES (?, ?, ?, datetime('now'))`, ["admin", "rag.ingest_r2", JSON.stringify({ key })]);
  return Response.json({ ok: true });
}
