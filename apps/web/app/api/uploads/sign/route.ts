import { presignR2 } from "@/src/lib/r2sign";
import { rateLimit } from "@/src/lib/kv";
import { verifyTurnstile } from "@/src/lib/turnstile";
export const runtime = "edge";
export async function POST(req: Request) {
  if (!(await rateLimit((req.headers.get('cf-connecting-ip')||'unknown'), 'upload:sign', 20, 60))) return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  const ip = req.headers.get('cf-connecting-ip')||undefined; const tkn = req.headers.get('x-turnstile-token')||"";
  const v = await verifyTurnstile(tkn, ip); if (!v?.success) return Response.json({ ok:false, error:'turnstile' }, { status: 400 });
  const { key, method } = await req.json(); const url = await presignR2((method || 'PUT'), key); return Response.json({ ok: true, url });
}
