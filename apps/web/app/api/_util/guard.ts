import { getServerSession } from "next-auth";
export async function requireAdmin() { const session = await getServerSession(); if (!session || (session as any).role !== 'admin') { return Response.json({ ok: false, error: 'forbidden' }, { status: 403 }); } return null; }
