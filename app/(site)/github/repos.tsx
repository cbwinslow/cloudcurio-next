export const runtime = 'edge'
async function getRepos(){ const res = await fetch('/api/github/repos', { cache: 'no-store' }); return res.json() }
export default async function Repos(){
  const data = await getRepos(); const nodes = data?.data?.user?.repositories?.nodes || []
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {nodes.map((r:any)=>(
        <a key={r.name} href={r.url} className="block rounded bg-cloudcurio-surface p-4 hover:shadow-glow">
          <div className="font-semibold text-cloudcurio-mint">{r.name}</div>
          <p className="text-xs opacity-80 mt-1">{r.description||''}</p>
          <div className="text-xs mt-2 opacity-70">⭐ {r.stargazerCount} · 🍴 {r.forkCount} · {r.primaryLanguage?.name||''}</div>
        </a>
      ))}
    </div>
  )
}
