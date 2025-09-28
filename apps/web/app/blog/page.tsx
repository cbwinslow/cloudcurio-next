"use client";
import { useState } from "react";

export default function BlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [drafting, setDrafting] = useState(false);

  async function draftWithAI() {
    setDrafting(true);
    try {
      const r = await fetch("/api/blog/draft", { method: "POST", body: JSON.stringify({ title }) });
      const j = await r.json();
      if (j.ok) setContent(j.content);
    } finally {
      setDrafting(false);
    }
  }

  async function savePost() {
    const r = await fetch("/api/blog/save", { method: "POST", body: JSON.stringify({ title, content }) });
    alert((await r.json()).ok ? "Saved!" : "Failed");
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Blog Studio</h2>
      <input className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded"
             placeholder="Post title" value={title} onChange={e=>setTitle(e.target.value)} />
      <div className="flex gap-3">
        <button onClick={draftWithAI} className="px-3 py-2 bg-sky-600 rounded" disabled={drafting}>
          {drafting ? "Drafting..." : "Draft with AI"}
        </button>
        <button onClick={savePost} className="px-3 py-2 bg-neutral-800 rounded">Save Post</button>
      </div>
      <textarea className="w-full h-80 p-3 bg-neutral-900 border border-neutral-800 rounded"
                value={content} onChange={e=>setContent(e.target.value)} />
    </div>
  );
}
