export const runtime = 'edge'
export async function POST(req: Request){
  const body = await req.json()
  if (body.action === 'closed' && body.pull_request?.merged) {
    const title = body.pull_request.title
    const url = body.pull_request.html_url
    const mdx = `---\ntitle: ${title}\ndate: ${new Date().toISOString()}\nsummary: Auto-drafted from PR ${url}\ntags: [auto, github]\n---\n\nThis post was drafted from **${url}**.`
    // @ts-ignore
    await (globalThis as any).DB.exec(`INSERT INTO drafts (slug, mdx) VALUES (?, ?)`, [crypto.randomUUID(), mdx])
  }
  return new Response('ok')
}
