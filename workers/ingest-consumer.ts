import { fetchFredSeries } from '../lib/adapters/fred'
import { fetchDaily } from '../lib/adapters/stocks'
import { fetchAcs } from '../lib/adapters/census'
import { fetchFbiOffense } from '../lib/adapters/fbi'

export default {
  async queue(batch:any, env:any) {
    for (const m of batch.messages){
      const job = JSON.parse(m.body)
      if(job.kind === 'fred'){
        const { meta, obs } = await fetchFredSeries(job.seriesId)
        await env.DB.batch([
          env.DB.prepare('INSERT OR REPLACE INTO fred_series (id,title,units,last_updated) VALUES (?,?,?,?)')
            .bind(job.seriesId, meta?.seriess?.[0]?.title||job.seriesId, meta?.seriess?.[0]?.units||'', meta?.seriess?.[0]?.last_updated||'')
        ])
        const stmts = []
        for(const o of (obs?.observations||[])){
          stmts.push(env.DB.prepare('INSERT OR REPLACE INTO fred_observations (series_id, obs_date, value) VALUES (?,?,?)')
            .bind(job.seriesId, o.date, (o.value==='.'? null: +o.value)))
        }
        if(stmts.length) await env.DB.batch(stmts)
      } else if(job.kind === 'stocks'){
        const rows = await fetchDaily(job.symbol)
        const stmts = rows.map(r=> env.DB.prepare('INSERT OR REPLACE INTO stocks_prices (symbol, ts, open, high, low, close, volume) VALUES (?,?,?,?,?,?,?)')
          .bind(job.symbol, r.ts, r.open, r.high, r.low, r.close, r.volume))
        if(stmts.length) await env.DB.batch(stmts)
      } else if(job.kind === 'census'){
        const rows = await fetchAcs(job.var, job.year)
        const stmts = rows.map((r:any)=> env.DB.prepare('INSERT OR REPLACE INTO census_obs (ds_id, geo_id, var, val, year) VALUES (?,?,?,?,?)')
          .bind('acs1-'+job.year, r.state, job.var, r.val, job.year))
        if(stmts.length) await env.DB.batch(stmts)
      } else if(job.kind === 'fbi'){
        const rows = await fetchFbiOffense(job.offense, job.since, job.until)
        const stmts = rows.map((r:any)=> env.DB.prepare('INSERT OR REPLACE INTO fbi_offense (offense, year, state, value) VALUES (?,?,?,?)')
          .bind(job.offense, r.data_year, r.state_abbr, r.offense_rate||r.actual||0))
        if(stmts.length) await env.DB.batch(stmts)
      } else if(job.kind === 'doc-index'){
        const key = job.key
        const obj = await env.R2_DOCS.get(key)
        if(!obj) continue
        const text = await obj.text()
        const id = crypto.randomUUID()
        await env.DB.exec(`INSERT OR REPLACE INTO doc_text (id, doc_id, text) VALUES (?, ?, ?)`, [id, job.docId, text])
        const chunks = []
        const CHUNK=1200, OVER=200
        for(let i=0;i<text.length;i+=CHUNK){
          const end = Math.min(text.length, i+CHUNK)
          const slice = text.slice(i, end)
          chunks.push(slice); i -= OVER
        }
        for(let idx=0; idx<chunks.length; idx++){
          const c = chunks[idx]
          const res = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: c })
          const vec = res.data?.[0]; if(!vec) continue
          await env.VEC.upsert([{ id: `${job.docId}:${idx}`, values: vec, metadata: { docId: job.docId, chunk: idx } }])
          await env.DB.exec(`INSERT OR REPLACE INTO doc_embeddings (id, doc_id, chunk, vector) VALUES (?, ?, ?, ?)`, [`${job.docId}:${idx}`, job.docId, idx, new Uint8Array(new Float32Array(vec).buffer)])
        }
      }
    }
  }
}
