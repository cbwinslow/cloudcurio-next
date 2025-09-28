export async function fetchFredSeries(seriesId: string){
  const key = process.env.FRED_API_KEY
  if(!key) throw new Error('Missing FRED_API_KEY')
  const meta = await fetch(`https://api.stlouisfed.org/fred/series?series_id=${seriesId}&api_key=${key}&file_type=json`).then(r=>r.json())
  const obs = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${key}&file_type=json`).then(r=>r.json())
  return { meta, obs }
}
