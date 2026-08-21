/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { body } from "../../../../lib/http";
import { required } from "../../../../lib/env";

export async function POST(request: Request) {
  try {
    const { email, password } = await body<{ email: string; password: string }>(request);
    const response = await fetch(`${required("SUPABASE_URL")}/auth/v1/token?grant_type=password`, { method: "POST", headers: { apikey: required("SUPABASE_ANON_KEY"), "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await response.json() as any;
    if (!response.ok) return Response.json({ error: data.error_description || data.msg || "Sign in failed" }, { status: 401 });
    (await cookies()).set("zz_session", data.access_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: data.expires_in || 3600 });
    return Response.json({ user: data.user });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Sign in failed" }, { status: 503 }); }
}
