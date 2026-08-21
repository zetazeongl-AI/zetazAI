import { cookies } from "next/headers";
import { configured, required } from "./env";

export type AuthUser = { id: string; email: string; role: string };

export async function getUser(): Promise<AuthUser | null> {
  if (!configured("SUPABASE_URL", "SUPABASE_ANON_KEY")) return null;
  const token = (await cookies()).get("zz_session")?.value;
  if (!token) return null;
  const response = await fetch(`${required("SUPABASE_URL")}/auth/v1/user`, {
    headers: { apikey: required("SUPABASE_ANON_KEY"), authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const user = await response.json() as { id: string; email?: string; app_metadata?: { role?: string } };
  return { id: user.id, email: user.email || "", role: user.app_metadata?.role || "user" };
}

export async function requireUser() {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
