export const runtime = 'edge'
async function getActions(){ const res = await fetch('/api/github/actions', { cache: 'no-store' }); return res.json() }
export default async function Actions(){
  const data = await getActions(); const nodes = data?.data?.user?.repositories?.nodes || []
  return (
    <ul className="space-y-3">
      {nodes.map((r:any)=>(
        <li key={r.url} className="p-3 rounded bg-cloudcurio-surface">
          <a href={r.url} className="text-cloudcurio-mint font-semibold">{r.name}</a>
          <div className="text-xs opacity-70">Default branch: {r.defaultBranchRef?.name||'main'}</div>
        </li>
      ))}
    </ul>
  )
}
