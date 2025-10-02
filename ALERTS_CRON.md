# Alerts Cron Scheduling (Supabase)

Use Supabase Scheduled Triggers to run the alerts evaluation periodically.

## Option A: Schedule Edge Function (alerts)

1) Deploy function:
```
supabase functions deploy alerts
```

2) Create a schedule (every 5 minutes):
```
POST https://api.supabase.com/v1/projects/<project-ref>/schedules
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "alerts-5min",
  "cron": "*/5 * * * *",
  "request": {
    "method": "POST",
    "url": "https://<project>.supabase.co/functions/v1/alerts",
    "headers": { "Content-Type": "application/json" },
    "body": "{}"
  }
}
```
- Get `<access-token>` from your Supabase account (Personal Access Token)
- Replace `<project>` and `<project-ref>` accordingly

Docs: https://supabase.com/docs/guides/functions/schedule-functions

## Option B: Call SQL function via cron

If you prefer to keep logic in SQL (`check_price_alerts()` is provided in `supabase/migrations/20250101_phase1_features.sql`), you can run it via an Edge Function or Postgres cron extension.

Example Edge Function wrapper:
```
serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { error } = await sb.rpc('check_price_alerts')
  if (error) return new Response(JSON.stringify({ error }), { status: 500 })
  return new Response(JSON.stringify({ ok: true }))
})
```

Then schedule it as in Option A.

## Verification

- Check `notifications` table for inserted rows after the schedule runs
- Inspect Supabase Logs → Edge Functions for runtime logs
