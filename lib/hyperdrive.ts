// Example Hyperdrive + Postgres.js client
// Note: add postgres to deps if you plan to use it in Workers (edge compatible build)
import postgres from 'postgres'
export function connect(env: any) {
  const url = env?.HYPER?.connectionString || process.env.HYPERDRIVE_CONNECTION
  if (!url) throw new Error('Missing Hyperdrive connection string')
  return postgres(url, { ssl: 'prefer', max: 1 })
}
