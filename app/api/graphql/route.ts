import { createSchema, createYoga } from 'graphql-yoga'
export const runtime = 'edge'
const typeDefs = /* GraphQL */ `
  type FredObservation { series_id: String!, obs_date: String!, value: Float }
  type StockCandle { symbol: String!, ts: String!, open: Float, high: Float, low: Float, close: Float, volume: Float }
  type CensusObs { ds_id: String!, geo_id: String!, var: String!, val: Float, year: Int }
  type FBIStat { offense: String!, year: Int!, state: String!, value: Float }
  type Doc { id: ID!, filename: String!, key: String! }
  type Query {
    fred(series_id: String!): [FredObservation!]!
    stocks(symbol: String!, since: String, until: String): [StockCandle!]!
    census(ds_id: String!, year: Int!): [CensusObs!]!
    fbi(offense: String!, since: Int!, until: Int!): [FBIStat!]!
    documents(limit: Int = 50): [Doc!]!
  }
`
const resolvers = {
  Query: {
    fred: async (_:any, { series_id }:any, ctx:any) =>
      (await ctx.env.DB.prepare('SELECT series_id, obs_date, value FROM fred_observations WHERE series_id=? ORDER BY obs_date').bind(series_id).all()).results||[],
    stocks: async (_:any, { symbol, since, until }:any, ctx:any) => {
      let q = 'SELECT symbol, ts, open, high, low, close, volume FROM stocks_prices WHERE symbol=?'
      const bind:any[] = [symbol]; if(since){ q+=' AND ts>=?'; bind.push(since) } if(until){ q+=' AND ts<=?'; bind.push(until) } q+=' ORDER BY ts'
      return (await ctx.env.DB.prepare(q).bind(...bind).all()).results||[]
    },
    census: async (_:any, { ds_id, year }:any, ctx:any) =>
      (await ctx.env.DB.prepare('SELECT ds_id, geo_id, var, val, year FROM census_obs WHERE ds_id=? AND year=?').bind(ds_id, year).all()).results||[],
    fbi: async (_:any, { offense, since, until }:any, ctx:any) =>
      (await ctx.env.DB.prepare('SELECT offense, year, state, value FROM fbi_offense WHERE offense=? AND year>=? AND year<=?').bind(offense, since, until).all()).results||[],
    documents: async (_:any, { limit }:any, ctx:any) =>
      (await ctx.env.DB.prepare('SELECT id, filename, key FROM documents ORDER BY uploaded_ts DESC LIMIT ?').bind(limit).all()).results||[]
  }
}
const yoga = createYoga({ schema: createSchema({ typeDefs, resolvers }), graphqlEndpoint: '/api/graphql', fetchAPI: { Response, Request, Headers } })
export { yoga as GET, yoga as POST }
