export default {
  async queue(batch:any, env:any) {
    for (const m of batch.messages){
      const e = JSON.parse(m.body)
      await env.DB.exec(`INSERT INTO audit (ts, event, payload) VALUES (?, ?, ?)`, [e.ts, e.event, JSON.stringify(e.payload)])
    }
  }
}
