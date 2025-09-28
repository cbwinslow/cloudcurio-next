"use client";
import { useState } from "react";

export default function ResearchPage() {
  const [url, setUrl] = useState("");
  const [queued, setQueued] = useState(false);

  async function queueCrawl() {
    const r = await fetch("/api/crawl/submit", { method: "POST", body: JSON.stringify({ url }) });
    setQueued((await r.json()).ok);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Deep Research</h2>
      <p className="text-neutral-300">Queue a crawl job. The Worker will fetch, extract text and ingest into the KB.</p>
      <input className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded"
             placeholder="https://example.com/article" value={url} onChange={e=>setUrl(e.target.value)} />
      <button onClick={queueCrawl} className="px-3 py-2 bg-sky-600 rounded">Queue Crawl</button>
      {queued && <div className="text-green-400">Queued!</div>}
    </div>
  );
}
