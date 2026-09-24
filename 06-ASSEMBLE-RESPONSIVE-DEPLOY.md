# 06 — ASSEMBLE, RESPONSIVE CHECK, FIRST DEPLOY (P0 finish)  ~10 min

Run after 02–05 are merged/committed.

## Tasks
1. Check `app/page.tsx` renders all real sections (no stubs left). Section order matches design.
2. Horizontal-overflow audit: find any element wider than viewport at 360, 375, 768, 1024, 1440, 1920 (common culprits: marquee track, mega menu panel, fixed px widths, `100vw`). Fix causes. Add a dev-only check script in the browser console you can document: `[...document.querySelectorAll('*')].filter(e=>e.scrollWidth>document.documentElement.clientWidth)`.
3. Images: `next/image` with explicit width/height or `sizes`; below-the-fold images lazy (default); logo/hero `priority`. Formats AVIF/WebP (next/image default). No image > 200KB.
4. Heading hierarchy: exactly one h1, logical h2/h3.
5. lint + build + test pass. Commit "phase-06: assemble + responsive fixes". Push to `main`.

## ⚠️ USER ACTION after this phase (outside agent)
Confirm Vercel deployed and open the live URL on your phone. Paste the live URL here: <<FILL>>
