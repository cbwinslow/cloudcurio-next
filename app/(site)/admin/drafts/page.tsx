export const runtime = 'edge'
async function getDrafts(){
  // @ts-ignore
  const r = await (globalThis as any).DB.prepare('SELECT slug, substr(mdx,1,160) as preview FROM drafts ORDER BY rowid DESC LIMIT 100').all()
  return r.results || []
}
export default async function Drafts(){
  const drafts = await getDrafts()
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Drafts</h1>
      <ul className="space-y-2">
        {drafts.map((d:any)=>(
          <li key={d.slug} className="p-3 rounded bg-cloudcurio-surface">
            <code className="opacity-60">{d.slug}</code>
            <pre className="text-xs whitespace-pre-wrap">{d.preview}</pre>
          </li>
        ))}
      </ul>
    </div>
  )
}
