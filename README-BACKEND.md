# ZetaZeon backend setup

1. Create a Supabase project, run `supabase/schema.sql`, enable email verification, and allow the production URL as an auth redirect.
2. Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to deployment environment variables.
3. Add one or more of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and `GOOGLE_AI_API_KEY`.
4. For Stripe, replace placeholder price IDs in `app/pricing/page.tsx`, then set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`. Point the webhook to `/api/billing/stripe/webhook`.
5. For bKash tokenized checkout, set `BKASH_BASE_URL`, `BKASH_USERNAME`, `BKASH_PASSWORD`, `BKASH_APP_KEY`, and `BKASH_APP_SECRET`. Use sandbox until merchant approval.
6. Set `NEXT_PUBLIC_APP_URL` to the exact production URL. Never commit service-role, AI, Stripe, or bKash secrets.
