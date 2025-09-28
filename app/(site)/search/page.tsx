'use client'
import { useState } from 'react'
export default function SearchPage(){
  const [q,setQ]=useState(''); const [res,setRes]=useState<any[]>([])
  async function go(){ const r=await fetch('/api/search?q='+encodeURIComponent(q)); setRes((await r.json()).results) }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Search Cloudcurio</h1>
      <div className="flex gap-2">
        <input className="w-full rounded bg-black/60 p-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search posts, guides, gists..." />
        <button className="btn-primary" onClick={go}>Search</button>
      </div>
      <ul className="space-y-3">
        {res.map((r:any)=> (
          <li key={r.id} className="p-3 rounded bg-cloudcurio-surface">
            <a href={`/blog/${r.id}`} className="text-cloudcurio-mint font-semibold">{r.metadata?.title||r.id}</a>
            <p className="text-sm opacity-80">{r.metadata?.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
