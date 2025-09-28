import { allPosts } from 'contentlayer/generated'
export const runtime = 'edge'
export async function GET() {
  const pages = ['/', '/blog', '/github', '/search', '/chat']
  const urls = [
    ...pages.map(p=>`<url><loc>https://cloudcurio.cc${p}</loc></url>`),
    ...allPosts.map(p=>`<url><loc>https://cloudcurio.cc/blog/${p.slug}</loc></url>`)
  ].join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' }})
}
