import { openrouterChat } from "@/src/lib/openrouter";

export const runtime = "edge";

export async function POST(req: Request) {
  const { title } = await req.json();
  const sys = "You are an expert technical blogger for cloudcurio.cc. Write concise, insightful posts.";
  const content = await openrouterChat([
    { role: "system", content: sys },
    { role: "user", content: `Draft a blog post outline and content for: ${title}`}
  ]);
  return Response.json({ ok: true, content });
}
