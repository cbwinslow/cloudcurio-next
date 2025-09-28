"use client";
import { useState } from "react";

export default function ChatPage() {
  const [q, setQ] = useState("");
  const [a, setA] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  async function ask() {
    setSearching(true);
    try {
      const r = await fetch("/api/rag/query", { method: "POST", body: JSON.stringify({ q }) });
      const j = await r.json();
      setA(j.answer || "No answer.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">RAG Chat</h2>
      <input className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded"
             placeholder="Ask about the knowledge base..." value={q}
             onChange={e=>setQ(e.target.value)} />
      <button onClick={ask} className="px-3 py-2 bg-sky-600 rounded" disabled={searching}>
        {searching ? "Searching..." : "Ask"}
      </button>
      {a && <div className="border border-neutral-800 rounded p-3 whitespace-pre-wrap">{a}</div>}
    </div>
  );
}
