import { dbExec } from "@/src/lib/db";
import { requireAdmin } from "../../../api/_util/guard";
export const runtime = "edge";
export async function POST(req: Request){
  const forbidden = await requireAdmin(); if (forbidden) return forbidden;
  const { url, interval_min } = await req.json();
  await dbExec(`INSERT INTO crawl_schedules (url, interval_min, next_run) VALUES (?, ?, datetime('now'))`, [url, interval_min||60]);
  return Response.json({ ok: true });
}
