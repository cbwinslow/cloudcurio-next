// D1 access helpers
// @ts-expect-error
import { env as cf } from 'cloudflare:env';

export async function dbExec(sql: string, params: any[] = []) {
  const db = cf.CLOUDCURIO_DB as D1Database;
  return db.prepare(sql).bind(...params).run();
}

export async function dbAll<T = any>(sql: string, params: any[] = []) {
  const db = cf.CLOUDCURIO_DB as D1Database;
  const res = await db.prepare(sql).bind(...params).all<T>();
  return res.results ?? [];
}
