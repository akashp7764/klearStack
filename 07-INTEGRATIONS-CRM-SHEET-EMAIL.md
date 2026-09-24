# 07 — LEAD API: HubSpot CRM + Google Sheet + Email (P1 + P2 email)  ~20 min

Read 00-MASTER-CONTEXT.md first. Edit `app/api/lead/route.ts` (replace TEMP), `lib/integrations/**`, `lib/rate-limit.ts`, and `components/lead/LeadForm.tsx` only for response handling.

## ⚠️ USER INPUT REQUIRED (values go ONLY into .env.local and Vercel — NOT here)
Confirm these env vars exist locally in `.env.local`: HUBSPOT_TOKEN, APPS_SCRIPT_URL, APPS_SCRIPT_SECRET, ALLOWED_ORIGINS (e.g. `http://localhost:3000,https://<<your-app>>.vercel.app`) → <<confirm: yes>>
HubSpot custom property created? `enquiry_details` (multi-line text) → <<yes / no>>

## Architecture (write this in ai-log)
Browser → POST /api/lead (Vercel serverless, Node runtime) → 1) HubSpot Contacts API → 2) Apps Script web app (appends Sheet row with timestamp + CRM status, emails ai-labs@hexanovate.com). Secrets only in Vercel env. One `leadId` (UUID) travels to all systems for reconciliation.

## route.ts — POST only (App Router returns 405 for other methods automatically; also export nothing else)
Order of checks:
1. `export const runtime = 'nodejs'`.
2. Origin check: `Origin` header must be in ALLOWED_ORIGINS → else 403 `{ ok:false }`.
3. Content-Type must be application/json; body size < 10KB.
4. Rate limit (`lib/rate-limit.ts`): in-memory sliding window per IP (`x-forwarded-for` first value), 5 requests / 10 min → 429 "Too many attempts, please try again in a few minutes." Document limitation: per-instance memory on serverless; production would use Upstash/Vercel KV.
5. Honeypot `company_website` non-empty OR `Date.now() - startedAt < 3000` → return fake `{ ok:true }` (200) and forward NOTHING (don't tip off bots).
6. `leadSchema.safeParse` (same zod schema as client). On failure 400 `{ ok:false, errors: fieldErrors }` (field names + our own messages only).
7. Sanitise: strip control chars, trim, collapse whitespace. Never render user HTML anywhere.
8. `leadId = crypto.randomUUID()`.
9. HubSpot (`lib/integrations/hubspot.ts`, `import 'server-only'`):
   - POST `https://api.hubapi.com/crm/v3/objects/contacts` with Bearer HUBSPOT_TOKEN.
   - Map: firstname, lastname, email, phone (E.164), company, jobtitle (if field exists), website (if exists), `lifecyclestage: 'lead'`, and `enquiry_details` = readable text of all other fields + leadId (only if user confirmed the property exists; otherwise skip).
   - On 409 (contact exists): PATCH `/crm/v3/objects/contacts/{email}?idProperty=email` with the same properties.
   - `AbortSignal.timeout(6000)`. Return `{ status: 'ok', id } | { status: 'failed', reason }` — never throw to the route.
10. Apps Script (`lib/integrations/apps-script.ts`, server-only): POST APPS_SCRIPT_URL, header `Content-Type: text/plain;charset=utf-8`, `redirect: 'follow'`, body `JSON.stringify({ secret: APPS_SCRIPT_SECRET, action: 'lead', data: { leadId, crmStatus, fields } })`, timeout 8000ms. Response JSON `{ ok, email }`.
11. Partial-failure policy:
    - CRM ok + Sheet ok → 200 `{ ok:true, leadId }`
    - CRM failed + Sheet ok → 200 `{ ok:true, leadId }` (lead is safe in the Sheet; the notification email is flagged "CRM SYNC FAILED" so the team re-enters it; server logs `console.error('crm_failed', leadId, reason)` without PII).
    - CRM ok + Sheet failed → 200 `{ ok:true, leadId }`, server log `sheet_failed`.
    - Both failed → 502 `{ ok:false, message: 'We could not submit your details right now. Please try again, or email us directly.' }`. Log `lead_lost_risk` with leadId + submitted email domain only.
    - Client shows success card or error banner with retry + mailto fallback. Never a blank/broken page.
12. Return only `{ ok, leadId }` to the client — never provider responses.

## Done when
Local submit creates HubSpot contact, adds Sheet row, email arrives at ai-labs (use your own email while testing locally if you want — see Apps Script NOTIFY_EMAIL). Simulate failure by setting a wrong HUBSPOT_TOKEN locally → user still sees success, Sheet row shows `crm: failed`. Record this test in ai-log. Commit "phase-07: lead integrations".
