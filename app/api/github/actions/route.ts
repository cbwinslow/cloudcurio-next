import { ghFetch, queries } from '@/lib/github'
export const runtime = 'edge'
export async function GET(){
  const login = process.env.GITHUB_USER || 'cbwinslow'
  const data = await ghFetch(queries.actions, { login })
  return Response.json(data)
}
