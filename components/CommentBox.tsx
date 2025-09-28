'use client'
import { useState } from 'react'
export default function CommentBox({ postSlug }: { postSlug: string }) {
  const [body, setBody] = useState('')
  const [ok, setOk] = useState(false)
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    // @ts-ignore
    const token = (window as any).turnstile?.getResponse?.()
    const r = await fetch(`/api/comments?slug=${postSlug}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, token })
    })
    setOk(r.ok)
  }
  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea value={body} onChange={e=>setBody(e.target.value)} className="w-full rounded border p-2 bg-black/50 text-green-200" placeholder="Say hello" />
      <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>
      <button className="px-3 py-2 rounded bg-emerald-500/80 hover:bg-emerald-400">Comment</button>
      {ok && <p className="text-sm text-emerald-400">Thanks! Pending moderation.</p>}
    </form>
  )
}
