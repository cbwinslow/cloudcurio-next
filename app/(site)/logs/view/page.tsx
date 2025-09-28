export const runtime='edge'
export default async function View({ searchParams }:{ searchParams:{ key?:string }}){
  const key = searchParams.key||''
  if(!key) return <p>No key.</p>
  // @ts-ignore
  const obj = await (globalThis as any).R2.get(key)
  const text = await obj?.text()||''
  return <pre className="whitespace-pre-wrap text-xs bg-black/50 p-4 rounded">{text.slice(0,200000)}</pre>
}
