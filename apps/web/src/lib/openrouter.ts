import { ENV } from './env';

export async function openrouterChat(messages: Array<{role:'system'|'user'|'assistant', content:string}>, model = "openai/gpt-4o-mini") {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ENV.OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({ model, messages })
  });
  if (!r.ok) throw new Error("OpenRouter request failed");
  const j = await r.json();
  return j.choices?.[0]?.message?.content ?? "";
}

export async function openrouterEmbed(input: string, model = "openai/text-embedding-3-small") {
  const r = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ENV.OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({ model, input })
  });
  if (!r.ok) throw new Error("OpenRouter embeddings failed");
  const j = await r.json();
  return j.data?.[0]?.embedding as number[];
}
