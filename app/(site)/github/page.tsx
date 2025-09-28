export const runtime = 'edge'
export default function GH(){
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">GitHub Activity</h1>
      <ul className="list-disc list-inside opacity-80">
        <li><a href="/github/repos">Latest Repos</a></li>
        <li><a href="/github/pulls">My Pull Requests</a></li>
        <li><a href="/github/actions">Repos & default branches</a></li>
      </ul>
    </section>
  )
}
