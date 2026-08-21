/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireUser } from "../../../../../lib/auth";
import { required, publicOrigin } from "../../../../../lib/env";
import { body } from "../../../../../lib/http";
export async function POST(request: Request) {
  try { const user = await requireUser(); const { priceId } = await body<{ priceId: string }>(request); if (!priceId?.startsWith("price_")) return Response.json({ error: "Invalid plan" }, { status: 400 });
    const form = new URLSearchParams({ mode: "subscription", "line_items[0][price]": priceId, "line_items[0][quantity]": "1", customer_email: user.email, client_reference_id: user.id, success_url: `${publicOrigin()}/account?billing=success`, cancel_url: `${publicOrigin()}/pricing?billing=cancelled`, "subscription_data[metadata][user_id]": user.id });
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { authorization: `Bearer ${required("STRIPE_SECRET_KEY")}`, "content-type": "application/x-www-form-urlencoded" }, body: form }); const data = await response.json() as any; if (!response.ok) throw new Error(data.error?.message || "Stripe checkout failed"); return Response.json({ url: data.url });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Checkout failed" }, { status: 503 }); }
}
