export const runtime = 'edge';

export async function GET() {
  try {
    // @ts-ignore
    const { results } = await (globalThis as any).CLOUDCURIO_DB.prepare(
      "SELECT id, ts, event, payload FROM audit ORDER BY ts DESC LIMIT 25"
    ).all();
    return Response.json(results);
  } catch (e: any) {
    console.error({ message: e.message, cause: e.cause });
    return Response.json({ error: "Failed to fetch data from database" }, { status: 500 });
  }
}