'use client'
import { useState } from 'react'
export default function Chat(){
  const [q,setQ]=useState(''); const [a,setA]=useState(''); const [busy,setBusy]=useState(false)
  async function ask(){ setBusy(true); const r=await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ q }) }); const j=await r.json(); setA(j.answer||''); setBusy(false) }
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Cloudcurio Chat</h1>
      <div className="flex gap-2">
        <input className="w-full rounded bg-black/60 p-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about posts, code, or logs..." />
        <button className="btn-primary" disabled={busy} onClick={ask}>{busy?'Thinking...':'Ask'}</button>
      </div>
      <pre className="whitespace-pre-wrap bg-cloudcurio-surface p-4 rounded min-h-[120px]">{a}</pre>
    </section>
  )
}
