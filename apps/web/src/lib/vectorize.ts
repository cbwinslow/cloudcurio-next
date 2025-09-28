// @ts-expect-error
import { env as cf } from 'cloudflare:env';

export const vec = () => cf.CLOUDCURIO_VEC as VectorizeIndex;
