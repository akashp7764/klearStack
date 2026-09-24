# 00 — MASTER CONTEXT (give this to EVERY agent first)

## Project
Single marketing page for Hexanovate Round 2 (Technical Lead — MarTech). Sections: Header/Nav, Lead Generation (left panel + form), ROI Calculator, Footer. Plus a calendar booking step shown after a successful form submit. Deployed on Vercel.

## Stack (fixed — do not add other libraries without a reason written in docs/ai-log.md)
- Next.js (latest, App Router) + TypeScript + Tailwind CSS
- react-hook-form + zod + @hookform/resolvers (form + shared server/client validation)
- libphonenumber-js (phone validation, use the `min` metadata import)
- lucide-react (UI icons only; social brand icons as inline SVG)
- vitest (ROI unit tests)
- NO framer-motion / GSAP — CSS transitions + keyframes only (performance budget)

## Folder structure
```
app/
  layout.tsx, page.tsx, globals.css, icon.svg
  api/lead/route.ts        (Phase 07)
  api/slots/route.ts       (Phase 08)
  api/book/route.ts        (Phase 08)
components/
  ui/        Button, Select (custom listbox), Toggle, SegmentedControl, Field wrappers (Phase 01)
  header/    (Phase 02)
  lead/      (Phase 03)
  roi/       (Phase 04)
  footer/    (Phase 05)
  booking/   (Phase 08)
lib/
  validation/lead.ts       shared zod schema (client + server)
  validation/free-domains.ts
  roi.ts, roi.test.ts, format.ts
  integrations/hubspot.ts, integrations/apps-script.ts (server-only)
  rate-limit.ts
design/      screenshots + tokens (provided by user)
docs/        ai-log.md, SECURITY_REPORT.md, PERFORMANCE_REPORT.md, PROCESS.md
```

## Hard rules
1. Only edit the files/folders listed in your phase. Other agents are working in parallel.
2. Secrets ONLY via `process.env` in server code (route handlers + `lib/integrations/*` which must `import 'server-only'`). NEVER use `NEXT_PUBLIC_` for a secret. Never write real values into any committed file; only `.env.example` with empty values.
3. Match the design in `/design` exactly: use tokens from Tailwind theme (Phase 01), not eyeballed values.
4. Responsive at 375 / 768 / 1440. No horizontal overflow anywhere between 360px and 1920px.
5. Accessibility: semantic HTML, one `h1`, labels tied to inputs, visible `:focus-visible` rings, keyboard operable, respect `prefers-reduced-motion`.
6. After finishing a phase: `npm run lint` and `npm run build` must pass. Then `git add -A && git commit -m "phase-XX: <summary>"`.
7. Append to `docs/ai-log.md` under your phase: decisions made, assumptions (where design/brief was silent), anything you generated that was wrong and how it was fixed. Be factual — this feeds the process report.
8. Error messages to the browser are generic. Never send stack traces or provider error bodies to the client.
