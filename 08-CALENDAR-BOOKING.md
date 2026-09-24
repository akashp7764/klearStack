# 08 — CALENDAR BOOKING STEP (P2)  ~15 min

Read 00-MASTER-CONTEXT.md first. Edit `app/api/slots/route.ts`, `app/api/book/route.ts`, `components/booking/**`, and the success branch of `components/lead/LeadForm.tsx` / LeadSection to mount the booking step.

Uses the SAME Apps Script web app (actions `slots` and `book`) → real Google Calendar owned by the user.

## API
- `GET /api/slots` → server calls Apps Script `{ secret, action:'slots' }`. Returns `{ ok, days:[{ date:'YYYY-MM-DD', label:'Fri, 25 Sep', slots:['ISO string', ...] }] }`. Cache: `no-store`. Rate limit 20/10min/IP. Origin check.
- `POST /api/book` body `{ leadId, name, email, start }` → zod validate (leadId uuid, email, start ISO in the future) → Apps Script `{ secret, action:'book', data }`. Map Apps Script errors: `slot_taken` → 409 "That slot was just taken — please pick another." ; others → 502 generic. Rate limit 5/10min/IP. Origin check.
- Name/email come from the successful lead submission held in client state (not re-typed).

## UI — `components/booking/BookingStep.tsx` (design it consistent with page tokens)
1. Heading "Book a 30-minute discovery call" + note "All times in IST (GMT+5:30)".
2. Day selector: horizontal pills for next 5 working days (scrollable on mobile, no page overflow).
3. Slot grid of time buttons (`aria-pressed`), 44px min height. Skeleton while loading. Empty state "No slots left this day — try another day." Error state with retry.
4. Confirm button (disabled until a slot is picked) → loading → confirmation card: date, time, "A calendar invite has been sent to <email>." On 409 refresh slots and show message.
5. "Skip for now" link — lead is already captured.
6. Focus moves to the booking heading when the step mounts (announce to screen readers).

## Done when
Picking a slot creates a real event in the user's Google Calendar with the lead as guest; taken slots disappear on refresh. Commit "phase-08: calendar booking".
