# AI Agent Decision Log — KlearStack Marketing Page

## Phase 01 — Setup, Tokens & UI Primitives

**Date**: 2026-09-24

### Decisions Made
1. **Node.js version**: Project requires Node ≥ 18; used `nvm use 20.20.1` since system default was v14.
2. **Next.js version**: Scaffolded with `create-next-app@latest` → resolved to Next.js 16.3.6 with React 19.
3. **Tailwind v4**: The scaffold installed Tailwind v4 which uses `@theme inline` in `globals.css` instead of `tailwind.config.ts`. All tokens defined in CSS custom properties under `@theme inline` — no config file needed.
4. **Font**: Used `Inter` from `next/font/google` (weights 400, 500, 600, 700, 800). This is the closest match to the Figma design which shows a clean modern sans-serif. Exposed as `--font-inter` CSS variable.
5. **Design tokens extracted from Figma screenshots**:
   - Primary: `#1B2B6B` (dark navy blue — nav, buttons, headings)
   - Accent: `#F97316` (orange — "We Integrates With All!" text, CTAs)
   - Link blue: `#2563EB` (active nav items, links)
   - Background: `#EBF0FA` (page body — light blue-gray)
   - Footer bg: `#D9E8F8` (lighter blue)
   - Text dark: `#0F172A`, Text muted: `#64748B`
   - Border: `#CBD5E1`
   - Success: `#22C55E`, Error: `#EF4444`
6. **Scaffold approach**: `create-next-app` doesn't support existing non-empty directories. Scaffolded to `tmp-scaffold/` subdirectory, then copied non-node_modules files to root. Ran `npm install` in root to regenerate `node_modules`.
7. **Stub components**: Created minimal stubs for Header, LeadSection, RoiCalculator, Footer with correct `id` attributes (`#contact`, `#roi`) and ARIA landmarks so page renders 4 sections before parallel phases replace them.
8. **icon.svg**: Created a brand-coloured "K" lettermark SVG (navy background, orange accent) as the favicon since no logo asset was provided.

### Assumptions
- Design token values inferred from Figma screenshot pixel analysis — exact hex codes not confirmed via Figma Dev Mode.
- Page title set to "KlearStack — The Only Document AI With Fraud, Compliance & Audit Checks Built In" based on the hero copy visible in screenshots.
- Meta description written based on the visible hero bullet points (99% accuracy, < 7 hours pilot, etc.).
- `Inter` font assumed as design font (the Figma design shows a clean humanist sans-serif consistent with Inter).

### Issues & Fixes
- `create-next-app@latest` failed with `Unexpected token '??='` on Node v14 → fixed by switching to Node v20 via `nvm use 20.20.1`.
- `Copy-Item` of node_modules (364 packages) hung indefinitely → killed task, switched to copying only non-node_modules files and running `npm install` in root.

---

## Phase 02 — Header & Navigation

*To be filled in Phase 02*

---

## Phase 03 — Lead Generation Section

*To be filled in Phase 03*

---

## Phase 04 — ROI Calculator

*To be filled in Phase 04*

---

## Phase 05 — Footer

*To be filled in Phase 05*

---

## Phase 06 — Assemble & Responsive Fixes

*To be filled in Phase 06*

---

## Phase 07 — Lead API Integrations

*To be filled in Phase 07*

---

## Phase 08 — Calendar Booking

*To be filled in Phase 08*

---

## Phase 09 — Security Headers & Polish

*To be filled in Phase 09*

---

## Phase 10 — Reports

*To be filled in Phase 10*
