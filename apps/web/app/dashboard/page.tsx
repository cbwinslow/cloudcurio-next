export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <ul className="list-disc pl-6 text-neutral-300">
        <li>Audit log stream (D1)</li>
        <li>Storage stats (R2)</li>
        <li>Index size (Vectorize)</li>
        <li>Recent crawls + failures</li>
      </ul>
    </div>
  );
}
