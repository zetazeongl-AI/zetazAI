import { configured } from "../../../lib/env";

export async function GET() {
  return Response.json({
    auth: configured("SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"),
    ai: { openai: configured("OPENAI_API_KEY"), anthropic: configured("ANTHROPIC_API_KEY"), google: configured("GOOGLE_AI_API_KEY") },
    payments: { stripe: configured("STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"), bkash: configured("BKASH_BASE_URL", "BKASH_USERNAME", "BKASH_PASSWORD", "BKASH_APP_KEY", "BKASH_APP_SECRET") },
  }, { headers: { "cache-control": "no-store" } });
}
