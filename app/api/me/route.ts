import { getUser } from "../../../lib/auth";
export async function GET() { const user = await getUser(); return user ? Response.json({ user }) : Response.json({ user: null }, { status: 401 }); }
