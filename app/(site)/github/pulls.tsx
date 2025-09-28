export const runtime = 'edge'
async function getPRs(){ const res = await fetch('/api/github/pulls', { cache: 'no-store' }); return res.json() }
export default async function Pulls(){
  const data = await getPRs(); const nodes = data?.data?.user?.pullRequests?.nodes || []
  return (
    <ul className="space-y-3">
      {nodes.map((p:any)=>(
        <li key={p.url} className="p-3 rounded bg-cloudcurio-surface">
          <a href={p.url} className="text-cloudcurio-mint font-semibold">{p.title}</a>
          <div className="text-xs opacity-70">{p.state} · {p.repository?.name}</div>
        </li>
      ))}
    </ul>
  )
}
