import { dbAll } from "@/src/lib/db";
export const runtime = "edge";
export async function GET(){ const rows = await dbAll(`SELECT id, url, interval_min, next_run FROM crawl_schedules ORDER BY id DESC`); return Response.json({ ok: true, rows }); }
