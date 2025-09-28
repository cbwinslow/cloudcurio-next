import Link from "next/link";

export default function HomePage() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-4xl font-extrabold mb-4">CloudCurio</h1>
        <p className="text-neutral-300 mb-6">
          A professional AI research hub for {`cloudcurio.cc`} — featuring OAuth, JWT,
          RAG chatbot, Vectorize knowledge base, scheduled crawler, and an agent
          workbench powered by OpenRouter.
        </p>
        <div className="flex gap-3">
          <Link className="px-4 py-2 bg-sky-600 rounded" href="/chat">Try RAG Chat</Link>
          <Link className="px-4 py-2 bg-neutral-800 rounded" href="/blog">Open Blog</Link>
        </div>
      </div>
      <div className="border border-neutral-800 rounded-xl p-6">
        <ul className="space-y-3 text-neutral-300 text-sm">
          <li>• OAuth + JWT (Auth.js / NextAuth)</li>
          <li>• D1 audit log + posts + documents</li>
          <li>• KV memories per user/session</li>
          <li>• R2 uploads with signed URLs</li>
          <li>• Vectorize embeddings + semantic search</li>
          <li>• OpenRouter-backed RAG + Agents</li>
          <li>• Worker Crawler (cron) to ingest fresh content</li>
        </ul>
      </div>
    </section>
  );
}
