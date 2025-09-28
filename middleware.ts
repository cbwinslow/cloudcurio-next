import { NextResponse } from 'next/server'
const PROTECTED_PREFIXES = ['/admin', '/logs']
export function middleware(req: Request) {
  const url = new URL(req.url)
  if (!PROTECTED_PREFIXES.some(p => url.pathname.startsWith(p))) return NextResponse.next()
  const jwt = (req as any).headers.get('Cf-Access-Jwt-Assertion') || (process.env.NODE_ENV === 'development' ? 'dev' : '')
  if (!jwt) return new NextResponse('Unauthorized', { status: 401 })
  if (jwt !== 'dev' && jwt.split('.').length !== 3) return new NextResponse('Unauthorized (bad token)', { status: 401 })
  return NextResponse.next()
}
export const config = { matcher: ['/admin/:path*','/logs/:path*'] }
