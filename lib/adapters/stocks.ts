type Candle = { ts: string, open:number, high:number, low:number, close:number, volume:number }
export async function fetchDaily(symbol: string): Promise<Candle[]>{
  const provider = (process.env.STOCKS_PROVIDER||'polygon').toLowerCase()
  if(provider === 'polygon'){
    const key = process.env.POLYGON_API_KEY
    if(!key) throw new Error('Missing POLYGON_API_KEY')
    const now = new Date()
    const past = new Date(Date.now()-1000*60*60*24*35)
    const from = past.toISOString().slice(0,10)
    const to = now.toISOString().slice(0,10)
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${key}`
    const j = await fetch(url).then(r=>r.json())
    return (j.results||[]).map((r:any)=>({ ts:new Date(r.t).toISOString(), open:r.o, high:r.h, low:r.l, close:r.c, volume:r.v }))
  } else if(provider === 'alphavantage'){
    const key = process.env.ALPHA_VANTAGE_KEY
    if(!key) throw new Error('Missing ALPHA_VANTAGE_KEY')
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${key}`
    const j = await fetch(url).then(r=>r.json())
    const data = j['Time Series (Daily)']||{}
    return Object.entries(data).map(([date, row]: any)=> ({
      ts: new Date(date+'T00:00:00Z').toISOString(),
      open: +row['1. open'], high:+row['2. high'], low:+row['3. low'], close:+row['4. close'], volume:+row['6. volume']
    })).sort((a,b)=> a.ts.localeCompare(b.ts))
  }
  throw new Error('Unknown provider')
}
