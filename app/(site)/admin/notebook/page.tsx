export const runtime = 'edge'
async function listNotes(){
  // @ts-ignore
  const r = await (globalThis as any).DB.prepare('SELECT id, ts, title, tags FROM notebook ORDER BY ts DESC LIMIT 200').all()
  return r.results || []
}
export default async function Notebook(){
  const notes = await listNotes()
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Semantic Notebook</h1>
      <p className="opacity-80 text-sm">Vectorized notes for fast recall.</p>
      <ul className="space-y-2">
        {notes.map((n:any)=>(
          <li key={n.id} className="p-3 rounded bg-cloudcurio-surface">
            <div className="font-semibold">{n.title}</div>
            <div className="text-xs opacity-70">{n.tags}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
