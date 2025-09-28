export const runtime='edge'
async function list(prefix='logs/', limit=100){
  // @ts-ignore
  const objects = await (globalThis as any).R2.list({ prefix, limit, delimiter: undefined })
  return objects.objects?.map((o:any)=>o.key) || []
}
export default async function Logs(){
  const keys = await list()
  return (
    <div>
      <h1 className="text-2xl font-bold">Log Explorer</h1>
      <ul className="mt-4 space-y-2">{keys.map((k:string)=> <li key={k}><a href={`/logs/view?key=${encodeURIComponent(k)}`}>{k}</a></li>)}</ul>
    </div>
  )
}
