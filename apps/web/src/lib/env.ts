// Cloudflare Pages (Next on Pages) — env bindings via cloudflare:env
// Provides typed access. In node dev, fall back to process.env.

// @ts-expect-error virtual module provided at runtime
import { env as cf } from 'cloudflare:env';

export const ENV = {
  OPENROUTER_API_KEY: (cf?.OPENROUTER_API_KEY ?? process.env.OPENROUTER_API_KEY) as string,
  SITE_NAME: (cf?.SITE_NAME ?? process.env.SITE_NAME ?? 'CloudCurio') as string,
  SITE_DOMAIN: (cf?.SITE_DOMAIN ?? process.env.SITE_DOMAIN ?? 'cloudcurio.cc') as string
};

export type CfBindings = {
  CLOUDCURIO_DB: D1Database;
  CLOUDCURIO_KV: KVNamespace;
  CLOUDCURIO_BUCKET: R2Bucket;
  CLOUDCURIO_VEC: VectorizeIndex;
  OPENROUTER_API_KEY?: string;
  SITE_NAME?: string;
  SITE_DOMAIN?: string;
};

declare global {
  function getMiniflareBindings(): CfBindings | undefined
}
