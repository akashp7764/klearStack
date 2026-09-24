# 01 — SETUP, TOKENS, SHARED UI PRIMITIVES  (sequential, run first) ~10 min

Read 00-MASTER-CONTEXT.md first.

## ⚠️ USER INPUT REQUIRED — design tokens (copy from Figma Dev Mode / inspect panel)
```
Primary colour:            <<FILL>>
Secondary / accent:        <<FILL>>
Text dark / text muted:    <<FILL>> / <<FILL>>
Background / surface:      <<FILL>> / <<FILL>>
Border colour:             <<FILL>>
Error / success colours:   <<FILL>> / <<FILL>>
Font family (headings):    <<FILL>>   (Google Font name)
Font family (body):        <<FILL>>
Type scale (h1,h2,h3,body,small px + weight + line-height): <<FILL>>
Border radius (buttons, inputs, cards): <<FILL>>
Shadows (card, dropdown):  <<FILL>>
Container max width + side padding (desktop/tablet/mobile): <<FILL>>
Page title:                <<FILL or "Hexanovate — Scale your marketing ROI">>
Meta description:          <<FILL>>
```
Design screenshots are in `/design` (header, header-dropdown, mega-menu, lead-section, roi, footer, mobile views). Look at them.

## Tasks
1. If the folder is empty: `npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm`. Otherwise skip.
2. `npm i zod react-hook-form @hookform/resolvers libphonenumber-js lucide-react server-only` and `npm i -D vitest`. Add `"test": "vitest run"` script.
3. Put tokens into Tailwind theme (colors, fontFamily, fontSize, radius, boxShadow) in globals.css / config — whichever the installed Tailwind version uses.
4. Fonts via `next/font/google` with `display: 'swap'`, only the weights used, exposed as CSS variables.
5. `app/layout.tsx`: `lang="en"`, metadata (title, description, openGraph basics, viewport), favicon `app/icon.svg` (simple brand-coloured "H").
6. `app/page.tsx`: `<Header/> <main> <LeadSection/> <RoiCalculator/> </main> <Footer/>`. Create stub components in each folder that render a section with an id (`#contact`, `#roi`) and "TODO" text, so parallel agents only replace their own files.
7. Shared primitives in `components/ui/`:
   - `Button` (variants: primary, secondary, ghost; loading state with spinner + `aria-busy`).
   - `Select`: custom accessible listbox (button with `aria-haspopup="listbox"`, `aria-expanded`; list `role="listbox"`, options `role="option"`, `aria-selected`; Arrow keys, Home/End, Enter/Space select, Escape closes, type-ahead, outside click closes). Props: `options`, `value`, `onChange`, `onBlur`, `placeholder`, `id`, `invalid`, `aria-describedby`. Styled per design.
   - `Toggle` (`role="switch"`, `aria-checked`) and `SegmentedControl` (radiogroup with arrow-key navigation).
   - `FieldError` (`id`, `role="alert"` only on submit-time errors, otherwise `aria-live="polite"`).
8. `.env.example` with empty keys: `HUBSPOT_TOKEN=`, `APPS_SCRIPT_URL=`, `APPS_SCRIPT_SECRET=`, `ALLOWED_ORIGINS=`. Confirm `.gitignore` contains `.env*` but NOT `.env.example` (add `!.env.example`).
9. Create `docs/ai-log.md` with headings per phase.
10. `globals.css`: `html { overflow-x: clip; }` is NOT allowed as a fix for overflow — fix real causes instead. Add `scroll-behavior: smooth` guarded by reduced-motion.
11. lint + build + commit.

## Done when
Build passes, page shows 4 stub sections, primitives render, tokens available as Tailwind classes.
