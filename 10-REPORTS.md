# 10 — REPORTS (Security, Performance, Process)  ~15 min

Generate three files in `docs/`. RULE: only state facts you can verify in THIS repository or in the user-supplied numbers below. No invented findings. If something wasn't done, say so.

## ⚠️ USER INPUT REQUIRED
```
Live URL: <<FILL>>
GitHub URL: <<FILL>>
Lighthouse MOBILE: Perf <<>> A11y <<>> BP <<>> SEO <<>> | LCP <<>> CLS <<>> TBT <<>> FCP <<>> TTFB (from PageSpeed / WebPageTest / DevTools Network) <<>>
Lighthouse DESKTOP: Perf <<>> A11y <<>> BP <<>> SEO <<>> | LCP <<>> CLS <<>> TBT <<>> FCP <<>>
Total page weight (DevTools Network, transferred): <<>>   First-load JS (from `npm run build` output): <<>>
End-to-end test result — HubSpot contact created? <<>> Sheet row? <<>> Email received? <<>> Calendar event? <<>>
Time log (actual minutes per section): <<>>
One real thing AI got wrong + how I caught it: <<FILL — e.g. Math.round vs Excel ROUND, free-domain regex missed yahoo.co.in, CSP blocked something, etc.>>
What is NOT complete: <<FILL honestly>>
```

## docs/SECURITY_REPORT.md
Table: Area | Score 0–5 | Justification (one line) | Remediation | Fixed / Accepted. Areas (exactly these 9): Secrets management; Server-side input validation & sanitisation; Injection & XSS; API route protection; Third-party integration security (HubSpot private-app scopes = contacts read/write only; Apps Script shared secret — leaked secret would allow appending rows/sending notification emails/booking slots, not reading data); Transport & headers; Dependency vulnerabilities (paste docs/npm-audit.txt summary + judgement); PII handling (fields collected, flows: browser → Vercel fn → HubSpot, Google Sheet, Gmail, Google Calendar; who can read; privacy note present?; Sheet formula-injection guard); Error handling. Close with total /45 and the top 3 fixes (likely: persistent rate limit via Upstash, nonce-based CSP, retry queue for failed integrations / reCAPTCHA-Turnstile). Scores must be honest — don't give 5s for accepted risks.

## docs/PERFORMANCE_REPORT.md
Metric table (target vs measured, from USER INPUT), screenshot placeholders `![mobile](./lighthouse-mobile.png)` `![desktop](./lighthouse-desktop.png)`, then: image strategy, font loading strategy, marquee cost (CSS transform-only, compositor thread, no JS), animation approach (no animation library → 0KB), bundle size justification, missed targets with reasons, next optimisations.

## docs/PROCESS.md (~2 pages)
Approach + time spent per section; stack + why; integration data-flow diagram (ASCII) with where each call runs and where secrets live; build vs integrate (built API routes + one Apps Script instead of Zapier/Make: fewer moving parts, free, secrets controlled, partial-failure handling in our code); AI tools used (Antigravity agents per phase in parallel, Claude for planning) + what went wrong + fix; ROI verification table (≥3 cases, copy from ai-log); assumptions (from ai-log); incomplete items + how to finish; what I'd do with two more days.

Also update `README.md`: what it is, live URL, setup (`cp .env.example .env.local`, env var descriptions), `npm run dev/test/build`, Apps Script deployment note, known gaps.

Commit "phase-10: reports". Push.
