/* eslint-disable @typescript-eslint/no-explicit-any */
import { body } from "../../../../lib/http";
import { required, publicOrigin } from "../../../../lib/env";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await body<{ email: string; password: string; name: string }>(request);
    const response = await fetch(`${required("SUPABASE_URL")}/auth/v1/signup`, { method: "POST", headers: { apikey: required("SUPABASE_ANON_KEY"), "content-type": "application/json" }, body: JSON.stringify({ email, password, data: { name }, email_redirect_to: `${publicOrigin()}/login?verified=1` }) });
    const data = await response.json() as any;
    if (!response.ok) return Response.json({ error: data.msg || "Registration failed" }, { status: 400 });
    return Response.json({ message: "Check your email to verify your account." });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Registration failed" }, { status: 503 }); }
}
