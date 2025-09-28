export const runtime = 'edge'
export default function AdminHome(){
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      <ul className="list-disc list-inside">
        <li><a href="/admin/drafts">Drafts</a></li>
        <li><a href="/admin/notebook">Notebook</a></li>
        <li><a href="/logs">Log Explorer</a></li>
      </ul>
    </section>
  )
}
