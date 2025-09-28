export async function fetchFbiOffense(offense='burglary', since=2019, until=2023){
  const key = process.env.FBI_API_KEY
  if(!key) throw new Error('Missing FBI_API_KEY')
  const url = `https://api.usa.gov/crime/fbi/sapi/api/estimation/state/${offense}/${since}/${until}?API_KEY=${key}`
  const j = await fetch(url).then(r=>r.json())
  return j?.data||[]
}
