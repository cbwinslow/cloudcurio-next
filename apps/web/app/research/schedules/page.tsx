"use client";
import { useEffect, useState } from "react";
export default function SchedulesPage(){
  const [rows, setRows] = useState<any[]>([]);
  const [url, setUrl] = useState("");
  const [intervalMin, setIntervalMin] = useState(60);
  async function load(){ const r = await fetch("/api/research/schedules/list"); const j = await r.json(); setRows(j.rows||[]); }
  async function save(){ const r = await fetch("/api/research/schedules/save", { method:"POST", body: JSON.stringify({ url, interval_min: intervalMin }) }); const j = await r.json(); if (j.ok){ setUrl(""); setIntervalMin(60); await load(); /* kick worker sync */ try{ await fetch("/workers/crawler/scheduler/sync", { method: "POST" } as any); }catch{} } }
  async function del(id:number){ const r = await fetch("/api/research/schedules/delete", { method:"POST", body: JSON.stringify({ id }) }); const j = await r.json(); if (j.ok) { await load(); try{ await fetch("/workers/crawler/scheduler/sync", { method: "POST" } as any); }catch{} } }
  useEffect(()=>{ load(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Crawl Schedules</h2>
      <div className="grid md:grid-cols-3 gap-3">
        <input className="p-2 bg-neutral-900 border border-neutral-800 rounded" placeholder="https://example.com" value={url} onChange={e=>setUrl(e.target.value)} />
        <input className="p-2 bg-neutral-900 border border-neutral-800 rounded" type="number" min={5} value={intervalMin} onChange={e=>setIntervalMin(parseInt(e.target.value||"60"))} />
        <button onClick={save} className="px-3 py-2 bg-sky-600 rounded">Add Schedule</button>
      </div>
      <table className="w-full text-sm border border-neutral-800 rounded overflow-hidden">
        <thead className="bg-neutral-900"><tr><th className="text-left p-2">URL</th><th className="text-left p-2">Every (min)</th><th className="text-left p-2">Next Run</th><th className="p-2">Actions</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-t border-neutral-800">
              <td className="p-2">{r.url}</td>
              <td className="p-2">{r.interval_min}</td>
              <td className="p-2">{r.next_run || "-"}</td>
              <td className="p-2 text-right"><button onClick={()=>del(r.id)} className="px-2 py-1 bg-red-600 rounded">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-neutral-400 text-xs">Note: This uses a Durable Object alarm to emulate cron. Updating schedules triggers a sync.</p>
    </div>
  );
}
