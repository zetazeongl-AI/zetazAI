import { requireUser } from "../../../lib/auth";
import { db } from "../../../lib/supabase";
export async function GET() { try { const user = await requireUser(); const rows = await db(`messages?user_id=eq.${user.id}&select=*&order=created_at.desc&limit=50`); return Response.json({ messages: rows }); } catch { return Response.json({ error: "Unauthorized" }, { status: 401 }); } }
