export const runtime = 'edge'
export async function PUT(req: Request){
  const { searchParams } = new URL(req.url)
  const filename = searchParams.get('filename')||'upload.bin'
  const buf = await req.arrayBuffer()
  const key = `incoming/${Date.now()}-${filename}`
  // @ts-ignore
  await (globalThis as any).R2_DOCS.put(key, buf)
  const docId = crypto.randomUUID()
  // @ts-ignore
  await (globalThis as any).DB.exec(`INSERT OR REPLACE INTO documents (id, key, filename, content_type, bytes, uploaded_ts) VALUES (?, ?, ?, ?, ?, ?)`,
    [docId, key, filename, req.headers.get('content-type')||'application/octet-stream', buf.byteLength, Date.now()])
  // @ts-ignore
  await (globalThis as any).INGEST_PRODUCER.send(JSON.stringify({ kind:'doc-index', key, docId }))
  return new Response(JSON.stringify({ ok:true, docId, key }), { headers:{ 'Content-Type':'application/json' } })
}
