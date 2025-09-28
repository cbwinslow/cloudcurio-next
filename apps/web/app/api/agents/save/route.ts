import { dbExec } from "@/src/lib/db";
export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json();
  await dbExec(
    `INSERT INTO agents (name, description, model, system, created_at) VALUES (?, ?, ?, ?, datetime('now'))`,
    [body.name, body.description || "", body.model || "", body.system || ""]
  );
  return Response.json({ ok: true });
}
