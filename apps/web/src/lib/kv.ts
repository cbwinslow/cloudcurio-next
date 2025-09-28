// @ts-expect-error
import { env as cf } from 'cloudflare:env';

export const kv = () => cf.CLOUDCURIO_KV as KVNamespace;
