// @ts-expect-error
import { env as cf } from 'cloudflare:env';
export async function verifyTurnstile(token: string, ip?: string) {
  const secret = (cf?.TURNSTILE_SECRET ?? process.env.TURNSTILE_SECRET) as string | undefined;
  if (!secret) return { success: false, error: "missing_secret" };
  const body = new URLSearchParams(); body.set("secret", secret); body.set("response", token); if (ip) body.set("remoteip", ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body }); return r.json();
}
