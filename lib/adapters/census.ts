export async function fetchAcs(popVar='B01003_001E', year=2022){
  const key = process.env.CENSUS_API_KEY
  if(!key) throw new Error('Missing CENSUS_API_KEY')
  const url = `https://api.census.gov/data/${year}/acs/acs1?get=NAME,${popVar}&for=state:*&key=${key}`
  const j = await fetch(url).then(r=>r.json())
  const [header, ...rows] = j
  return rows.map((r:any)=>({ name:r[0], val:+r[1], state:r[2] }))
}
