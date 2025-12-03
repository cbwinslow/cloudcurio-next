export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    // For now, we'll use a google search URL as a placeholder
    const url = `https://www.google.com/search?q=${encodeURIComponent(topic)}`;

    // @ts-ignore
    const { results } = await (globalThis as any).DB.prepare(
      "INSERT INTO crawl_jobs (url) VALUES (?) RETURNING id"
    ).bind(url).all();

    const jobId = results[0]?.id;

    if (!jobId) {
      throw new Error("Failed to create a new crawl job.");
    }

    // In a real-world scenario, you might trigger the worker here
    // For now, we'll rely on the scheduled worker to pick it up.

    return Response.json({ jobId });
  } catch (e: any) {
    console.error({ message: e.message, cause: e.cause });
    return Response.json({ error: "Failed to create research job" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return Response.json({ error: "jobId is required" }, { status: 400 });
  }

  try {
    // @ts-ignore
    const job = await (globalThis as any).DB.prepare(
      "SELECT id, status, url FROM crawl_jobs WHERE id = ?"
    ).bind(jobId).first();

    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    let results = null;
    if (job.status === 'done') {
        // @ts-ignore
        const doc = await (globalThis as any).DB.prepare(
            "SELECT content FROM documents WHERE url = ? ORDER BY created_at DESC LIMIT 1"
        ).bind(job.url).first();
        results = doc?.content;
    }

    return Response.json({ status: job.status, results });
  } catch (e: any) {
    console.error({ message: e.message, cause: e.cause });
    return Response.json({ error: "Failed to fetch job status" }, { status: 500 });
  }
}