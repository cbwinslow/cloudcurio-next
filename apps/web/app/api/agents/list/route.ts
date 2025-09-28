import { dbAll } from "@/src/lib/db";
export const runtime = "edge";

export async function GET() {
  const agents = await dbAll(`SELECT id, name, description, model, system FROM agents ORDER BY id DESC LIMIT 50`);
  return Response.json({ agents });
}
