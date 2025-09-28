"use client";
import { useEffect, useRef, useState } from "react";
const AGENTS_URL = process.env.NEXT_PUBLIC_AGENTS_URL as string;

export default function AgentsRunPage(){
  const [payload, setPayload] = useState('{"agent":"demo","input":"hello"}');
  const [resMsg, setResMsg] = useState<string>("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [polling, setPolling] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const logsRef = useRef<HTMLDivElement>(null);

  async function enqueue(){
    if (!AGENTS_URL) { alert("Set NEXT_PUBLIC_AGENTS_URL"); return; }
    const r = await fetch(AGENTS_URL + "/enqueue", { method: "POST", headers: { "content-type":"application/json" }, body: payload });
    const j = await r.json(); setResMsg(JSON.stringify(j, null, 2));
    try { await fetch(AGENTS_URL + "/process", { method: "POST" }); } catch {}
    if (!polling){ setPolling(true); }
  }
  async function processNow(){ if (!AGENTS_URL) return; await fetch(AGENTS_URL + "/process", { method: "POST" }); }
  async function tick(){ try { const r = await fetch(AGENTS_URL + "/status"); const j = await r.json(); if (j?.jobs) setJobs(j.jobs); } catch {} }

  useEffect(()=>{
    let id:any;
    if (polling){ tick(); id=setInterval(tick, 3000); }
    return ()=>{ if(id) clearInterval(id); };
  }, [polling]);

  useEffect(()=>{
    if (!AGENTS_URL || wsConnected) return;
    try {
      const ws = new WebSocket(AGENTS_URL.replace("https://","wss://").replace("http://","ws://") + "/ws");
      ws.onopen = ()=> setWsConnected(true);
      ws.onmessage = (ev)=> {
        try {
          const msg = JSON.parse(ev.data);
          if (msg?.type) {
            // Refresh jobs periodically based on incoming updates
            tick();
            if (logsRef.current) {
              const el = document.createElement("div");
              el.className = "text-xs text-neutral-300";
              el.textContent = `[${new Date().toLocaleTimeString()}] ${msg.type} ${msg.id?("#"+msg.id):""} ${msg.message||msg.artifactKey||""}`;
              logsRef.current.appendChild(el);
              logsRef.current.scrollTop = logsRef.current.scrollHeight;
            }
          }
        } catch {}
      };
      ws.onclose = ()=> setWsConnected(false);
      return ()=> ws.close();
    } catch {}
  }, [AGENTS_URL, wsConnected]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Agent Queue Runner</h2>
      <p className="text-neutral-300 text-sm">Set <code>NEXT_PUBLIC_AGENTS_URL</code> to your deployed Agents Worker.</p>
      <textarea className="w-full h-40 p-3 bg-neutral-900 border border-neutral-800 rounded" value={payload} onChange={e=>setPayload(e.target.value)} />
      <div className="flex gap-3">
        <button onClick={enqueue} className="px-3 py-2 bg-sky-600 rounded">Enqueue</button>
        <button onClick={()=>setPolling(p=>!p)} className="px-3 py-2 bg-neutral-800 rounded">{polling? "Stop Polling":"Start Polling"}</button>
        <button onClick={processNow} className="px-3 py-2 bg-neutral-800 rounded">Process</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Recent Jobs</h3>
          <ul className="space-y-2">
            {jobs.map((j)=> (
              <li key={j.id} className="border border-neutral-800 rounded p-3 text-sm">
                <div className="font-mono">{j.id}</div>
                <div>Status: {j.status}</div>
                {j.artifactKey && <div className="text-green-400">Artifact: {j.artifactKey}</div>}
                <div className="text-neutral-400">Created: {new Date(j.created).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Live Logs (WS)</h3>
          <div ref={logsRef} className="border border-neutral-800 rounded p-3 h-64 overflow-auto bg-neutral-950" />
        </div>
      </div>
    </div>
  );
}
