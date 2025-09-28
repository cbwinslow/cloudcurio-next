export const runtime = 'edge'
export async function POST(req: Request){
  const body = await req.json()
  const producer = (globalThis as any).INGEST_PRODUCER
  for(const s of (body.fredSeries||[])){ await producer.send(JSON.stringify({ kind:'fred', seriesId: s })) }
  for(const sym of (body.symbols||[])){ await producer.send(JSON.stringify({ kind:'stocks', symbol: sym })) }
  if(body.acs){ await producer.send(JSON.stringify({ kind:'census', var: body.acs.var||'B01003_001E', year: body.acs.year||2022 })) }
  if(body.fbi){ await producer.send(JSON.stringify({ kind:'fbi', offense: body.fbi.offense||'burglary', since: body.fbi.since||2019, until: body.fbi.until||2023 })) }
  return new Response(JSON.stringify({ ok:true }), { headers:{ 'Content-Type':'application/json' } })
}
