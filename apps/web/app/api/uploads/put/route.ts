import { r2 } from "@/src/lib/r2";
import { rateLimit } from "@/src/lib/kv";
import { verifyTurnstile } from "@/src/lib/turnstile";
export const runtime = "edge";
export async function POST(req: Request) {
  if (!(await rateLimit((req.headers.get('cf-connecting-ip')||'unknown'), 'upload:put', 10, 60))) return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  const ip = req.headers.get('cf-connecting-ip')||undefined; const tkn = req.headers.get('x-turnstile-token')||"";
  const v = await verifyTurnstile(tkn, ip); if (!v?.success) return Response.json({ ok:false, error:'turnstile' }, { status: 400 });
  const ctype = req.headers.get('content-type') || ''; if (!ctype.startsWith('multipart/form-data')) return Response.json({ ok: false, error: 'bad_request' }, { status: 400 });
  const form = await req.formData(); const file = form.get('file'); if (!(file instanceof File)) return Response.json({ ok: false, error: 'no_file' }, { status: 400 });
  const key = `uploads/${Date.now()}-${file.name}`; const arrayBuffer = await file.arrayBuffer();
  await r2().put(key, arrayBuffer, { httpMetadata: { contentType: file.type || 'application/octet-stream' } }); return Response.json({ ok: true, key });
}
