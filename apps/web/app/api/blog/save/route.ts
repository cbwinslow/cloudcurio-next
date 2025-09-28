import { dbExec } from "@/src/lib/db";

export const runtime = "edge";

export async function POST(req: Request) {
  const { title, content } = await req.json();
  await dbExec(
    `INSERT INTO posts (title, content, created_at) VALUES (?, ?, datetime('now'))`,
    [title, content]
  );
  await dbExec(
    `INSERT INTO audit_log (actor, action, details, ts) VALUES (?, ?, ?, datetime('now'))`,
    ["system", "blog.save", JSON.stringify({ title })]
  );
  return Response.json({ ok: true });
}
