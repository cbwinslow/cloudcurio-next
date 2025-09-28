export const runtime = 'edge'
export default function Home(){
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-extrabold text-cloudcurio-mint">Cloudcurio</h1>
      <p className="opacity-80">AI, DevOps, networking, and code—by CBW.</p>
      <div className="flex gap-3">
        <a className="btn-primary" href="/blog">Read the blog</a>
        <a className="btn-primary" href="/github">GitHub Activity</a>
        <a className="btn-primary" href="/search">Search</a>
        <a className="btn-primary" href="/chat">Chat</a>
      </div>
    </section>
  )
}
