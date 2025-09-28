export const runtime = 'edge'
async function embed(text: string){
  // @ts-ignore
  const res = await (globalThis as any).AI.run('@cf/baai/bge-base-en-v1.5', { text })
  return res.data?.[0] || []
}
async function retrieve(query: string, k=6){
  // @ts-ignore
  const vec = (globalThis as any).VEC
  const qv = await embed(query)
  const r = await vec.query({ topK: k, vector: qv, returnValues: false, includeMetadata: true })
  return r.matches || []
}
export async function POST(req: Request){
  const { q } = await req.json()
  const matches = await retrieve(q)
  const context = matches.map((m:any)=>`- ${m.metadata?.title}: ${m.metadata?.summary}`).join('\n')
  // @ts-ignore
  const out = await (globalThis as any).AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role:'system', content:'You are Cloudcurio bot. Answer using the provided site context.'},
      { role:'user', content:`Question: ${q}\nContext:\n${context}`}
    ]
  })
  return Response.json({ answer: out.response, sources: matches })
}
