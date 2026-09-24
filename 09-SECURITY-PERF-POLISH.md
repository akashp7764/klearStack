# 09 — SECURITY HEADERS, PERFORMANCE, A11Y POLISH (P3)  ~10 min

Read 00-MASTER-CONTEXT.md first.

## Security
1. `next.config.ts` → `headers()` for all routes:
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
   - `Content-Security-Policy`: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'` (next/font self-hosts fonts). Add `'unsafe-eval'` to script-src ONLY in development. Note in ai-log: `'unsafe-inline'` accepted for Next.js inline hydration scripts; nonce-based CSP is the next fix.
   - `poweredByHeader: false`.
2. Secret leak check: after `npm run build`, grep `.next/static` for `pat-`, `HUBSPOT`, `APPS_SCRIPT`, `script.google.com` → must find nothing. Also `git log -p | grep -iE "pat-na|AKfy|secret="` → nothing. Record the commands + results in ai-log.
3. Confirm no `NEXT_PUBLIC_` env var holds a secret.
4. API errors return generic messages only; no `err.message` to client.
5. Run `npm audit --omit=dev` and save output to `docs/npm-audit.txt`.

## Performance
- No unused dependencies (`npx depcheck` optional). Client components only where interactivity is needed; section wrappers stay server components.
- Marquee uses transform only (GPU, no layout thrash); `will-change: transform` on the track only.
- Fonts: next/font, subset latin, only used weights.
- Below-the-fold sections: images lazy; nothing heavy loaded before interaction.

## A11y polish
- Visible `:focus-visible` ring on every interactive element (brand colour, 2px offset).
- Colour contrast ≥ 4.5:1 for body text (check muted text and placeholder colours).
- Skip link "Skip to content" as first focusable element.
- `prefers-reduced-motion`: disable marquee, menu/drawer animations become instant.

lint + build + test. Commit "phase-09: security headers + polish". Push.
