import { dbExec } from "@/src/lib/db";
import { requireAdmin } from "../../../api/_util/guard";
export const runtime = "edge";
export async function POST(req: Request){
  const forbidden = await requireAdmin(); if (forbidden) return forbidden;
  const { id } = await req.json(); await dbExec(`DELETE FROM crawl_schedules WHERE id=?`, [id]);
  return Response.json({ ok: true });
}
