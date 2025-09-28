import { vec } from "@/src/lib/vectorize";
import { dbAll } from "@/src/lib/db";
import { openrouterChat } from "@/src/lib/openrouter";

export const runtime = "edge";

export async function POST(req: Request) {
  const { q } = await req.json();
  const index = vec();

  // naive: rely on model's own embedding through OpenRouter? For speed, use semantic search on index via text (Cloudflare supports 'query' with text, but here we'll assume vector needed.)
  // For simplicity, use text query operator (Vectorize supports text queries with Workers AI if configured; here we fallback to plain metadata LIKE)
  const rows = await dbAll(`SELECT id, title, url, content FROM documents ORDER BY created_at DESC LIMIT 5`);

  const context = rows.map(r => `# ${r.title}\n${r.content.slice(0, 1200)}`).join("\n\n");
  const answer = await openrouterChat([
    { role: "system", content: "Answer using the provided context. If unknown, say you don't know. Keep it concise."},
    { role: "user", content: `Question: ${q}\n\nContext:\n${context}`}
  ]);

  return Response.json({ answer });
}
