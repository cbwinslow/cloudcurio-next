// @ts-expect-error
import { env as cf } from 'cloudflare:env';

export const r2 = () => cf.CLOUDCURIO_BUCKET as R2Bucket;
