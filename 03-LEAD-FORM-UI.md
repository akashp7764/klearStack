# 03 — LEAD GENERATION SECTION: UI + VALIDATION (P0, heaviest weight)  — PARALLEL  ~30 min

Read 00-MASTER-CONTEXT.md first. Edit ONLY `components/lead/**`, `lib/validation/**`, and create a TEMPORARY stub `app/api/lead/route.ts` (Phase 07 replaces it).
Screenshot: `/design/lead-section*.png`.

## ⚠️ USER INPUT REQUIRED — left panel
```
Title: <<FILL>>
Subtitle: <<FILL>>
Trust signals (stats/badges/bullets/ratings), exact text: <<FILL>>
Logos: <<"use placeholders" OR put files in public/logos/>>  count: <<FILL>>
```

## ⚠️ USER INPUT REQUIRED — form fields (in design order)
```
| name (key) | label | placeholder | type (text/email/tel/dropdown/textarea/checkbox) | required? | dropdown options |
|------------|-------|-------------|---------------------------------------------------|-----------|------------------|
| firstName  | <<>>  | <<>>        | text                                              | yes       |                  |
| ...        |       |             |                                                   |           |                  |
Submit button text: <<FILL>>
Any text under the button (privacy/consent)? <<FILL or "none">>
```

## Left panel
- Layout, type, spacing per design. Semantic: `<section aria-labelledby>`, title as `h1` if it is the page hero, else `h2`.
- Logo marquee (`LogoMarquee.tsx`): pure CSS. Render the logo list TWICE inside one track; `@keyframes` translateX(0 → -50%) linear infinite; track `width: max-content`; gap applied as padding on each item (not `gap` on the track) so the -50% point is seamless. `:hover { animation-play-state: paused }`. Fixed container height + explicit `width/height` on images → zero CLS. Second copy `aria-hidden="true"`. Edge fade via mask-image. Under reduced motion: no animation, wrap statically. Placeholder logos = simple inline SVG wordmarks (no network images).

## Validation — `lib/validation/lead.ts` (shared with server)
- zod schema built from the field table. Trim all strings. Max lengths: names 50, company 100, email 254, message 1000. Names: letters, spaces, `.'-` only.
- `free-domains.ts`: gmail, googlemail, yahoo (+ yahoo.co.in, ymail), outlook, hotmail, live, msn, icloud, me, mac, aol, proton, protonmail, pm.me, rediffmail, zoho.com (personal), gmx, mail.com, yandex, tutanota, fastmail, hey.com, inbox.com. Match on the domain AND any `yahoo.*` / `hotmail.*` / `outlook.*` / `live.*` TLD variants.
- Email error messages (specific): empty → "Please enter your work email." / bad syntax → "That doesn't look like a valid email address." / free domain → "Please use your work email — personal addresses like @gmail.com aren't accepted."
- Phone: country code picker (custom `Select` from ui, default +91 India, include ~15 common countries with flag emoji + dial code) + national number input (digits only, strip spaces). Validate with `isValidPhoneNumber(full, countryIso)` from `libphonenumber-js/min`. Error: "Enter a valid 10-digit mobile number for India." (message adapts to country). Send E.164 to server.
- Dropdown fields use the custom `Select` (as per design) and must show "Please select your <thing>." when empty.
- Every error message is specific and human.

## Form behaviour (`LeadForm.tsx`)
- react-hook-form, `mode: 'onTouched'` (validate on blur), `reValidateMode: 'onChange'`, zodResolver.
- Submit blocked while invalid: on submit, run validation, show all errors, focus the first invalid field. (Button stays clickable so users discover errors — document this choice.) Button disabled only while in flight.
- States: idle → submitting (spinner, "Submitting…", fields disabled) → success (replace form with success card + `onSuccess(lead)` callback that will mount the booking step in Phase 08) OR error (inline banner "We couldn't submit your details. Please try again." + retry button; form values preserved).
- Spam: hidden honeypot input `name="company_website"` (visually hidden off-screen, `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden`), plus `startedAt` timestamp sent with payload.
- Privacy note under submit if none in design: "By submitting, you agree to be contacted by Hexanovate about your enquiry. We never share your data." → log as assumption.
- Every input has a `<label htmlFor>`; errors linked via `aria-describedby`; `aria-invalid`.
- Payload POSTed to `/api/lead` as JSON: `{ ...fields, phone: E164, company_website, startedAt }`.
- Temporary `app/api/lead/route.ts`: validates with the same schema and returns `{ ok: true, leadId: crypto.randomUUID() }` after 600ms. Mark with `// TEMP: replaced in phase 07`.

## Done when
Every field validates on blur and on submit with specific messages; gmail/yahoo etc. rejected; phone validated per country; success/error states visible; marquee seamless and pauses on hover. lint + build + commit "phase-03: lead section".
