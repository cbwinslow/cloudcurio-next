import '../../styles/globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import { ReactNode } from 'react'

export const metadata = {
  metadataBase: new URL('https://cloudcurio.cc'),
  title: { default: 'Cloudcurio — CBW', template: '%s · Cloudcurio' },
  description: 'Guides, code, and experiments across AI, DevOps, and networking by CBW.',
  openGraph: { url: 'https://cloudcurio.cc', siteName: 'Cloudcurio', type: 'website' },
  twitter: { card: 'summary_large_image', creator: '@cbwinslow' }
}

export default function RootLayout({ children }:{ children: ReactNode }){
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <Nav />
          <main className="max-w-6xl mx-auto p-4">{children}</main>
          <Footer />
        </Providers>
        {/* Cloudflare Web Analytics */}
        <script defer src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token":"YOUR_CLOUDFLARE_WEB_ANALYTICS_TOKEN"}' />
        {/* GA4 (optional) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script dangerouslySetInnerHTML={{__html:`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','G-XXXXXXXXXX');`}} />
      </body>
    </html>
  )
}