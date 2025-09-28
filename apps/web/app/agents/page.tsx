"use client";
import { useEffect, useState } from "react";

type AgentConfig = {
  id?: number;
  name: string;
  description?: string;
  model?: string;
  system?: string;
  tools?: string[];
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [editing, setEditing] = useState<AgentConfig>({ name: "", description: "", model: "openai/gpt-4o-mini" , system: "", tools: []});

  async function refresh() {
    const r = await fetch("/api/agents/list");
    setAgents((await r.json()).agents || []);
  }
  useEffect(() => { refresh(); }, []);

  async function save() {
    const r = await fetch("/api/agents/save", { method: "POST", body: JSON.stringify(editing)});
    if ((await r.json()).ok) { setEditing({ name: "", description: "", model: "openai/gpt-4o-mini", system: "", tools: [] }); refresh(); }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-semibold mb-2">New / Edit Agent</h3>
        <div className="space-y-2">
          <input className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded" placeholder="Name"
                 value={editing.name} onChange={e=>setEditing({...editing, name:e.target.value})} />
          <textarea className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded h-24" placeholder="Description"
                 value={editing.description||""} onChange={e=>setEditing({...editing, description:e.target.value})} />
          <input className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded" placeholder="Model"
                 value={editing.model||""} onChange={e=>setEditing({...editing, model:e.target.value})} />
          <textarea className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded h-24" placeholder="System prompt"
                 value={editing.system||""} onChange={e=>setEditing({...editing, system:e.target.value})} />
          <button onClick={save} className="px-3 py-2 bg-sky-600 rounded">Save</button>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Saved Agents</h3>
        <ul className="space-y-2">
          {agents.map(a => (
            <li key={a.id} className="border border-neutral-800 rounded p-3">
              <div className="font-medium">{a.name}</div>
              <div className="text-sm text-neutral-400">{a.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
