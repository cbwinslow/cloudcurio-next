export const runtime = 'edge'
export function GET() {
  const body = `User-agent: *\nAllow: /\nSitemap: https://cloudcurio.cc/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } })
}
