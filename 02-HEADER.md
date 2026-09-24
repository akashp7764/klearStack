# 02 — HEADER & NAVIGATION (P0)  — can run in PARALLEL with 03, 04, 05  ~25 min

Read 00-MASTER-CONTEXT.md first. Edit ONLY `components/header/**`.
Use screenshots `/design/header*.png`, `/design/mega-menu*.png`, `/design/mobile-*.png`.

## ⚠️ USER INPUT REQUIRED — menu structure (copy exact labels from Figma)
```
Logo: <<FILL: text or put logo SVG at public/logo.svg>>
Top-level items (5–7), in order, with type:
1. <<label>> — link | dropdown | mega
2. <<label>> — ...
3. ...
Dropdown items for "<<label>>": <<item1, item2, ...>> (+ icon/description if shown)
Mega menu for "<<label>>": columns →
   Column 1 title: <<>> items: <<>>
   Column 2 title: <<>> items: <<>>
   Featured card / image / CTA inside mega menu: <<describe or "none">>
Header CTA button text: <<FILL>>
Which item is ACTIVE by default: <<FILL>>
Sticky on scroll per design? <<yes / no / unclear>>
Hover style shown in design: <<underline / colour change / chevron rotate / etc>>
```

## Build
- `components/header/nav-data.ts`: typed config from the input above (no hardcoded labels in JSX).
- `Header.tsx` (client component only where needed), `DesktopNav.tsx`, `Dropdown.tsx`, `MegaMenu.tsx`, `MobileDrawer.tsx`.
- Links use `href="#"` + `onClick` preventDefault (brief: must look/behave right, no routing). CTA scrolls to `#contact`.

## Behaviour (all required)
- Hover: underline/colour/chevron per design, 150–200ms transitions.
- Open on hover with intent delay (~100ms open, ~200ms close grace so moving into the panel doesn't close it) AND on click (click toggles; for touch devices click only).
- Close on: outside click (pointerdown listener), Escape (return focus to trigger), window scroll, selecting an item, opening another menu. Only one menu open at a time.
- Animation: opacity + translateY(-4px→0) + slight scale, 180ms ease-out open / 120ms close. Keep panels mounted but hidden (`visibility`+`opacity`) so close animates. Disabled under `prefers-reduced-motion`.
- Keyboard: Tab through top items; Enter/Space opens; ArrowDown moves into the panel; Escape closes; Tab past the last item closes the panel. Triggers are `<button aria-expanded aria-controls>`. Use `<nav aria-label="Main">`.
- Active item styled per design (`aria-current="page"`).
- CTA: its own hover/press animation (e.g. background shift + arrow nudge + `active:scale-[0.98]`).
- Sticky: if design unclear → ASSUME sticky, transparent → solid background + shadow after scrollY > 8px. Log assumption in docs/ai-log.md.
- < 1024px: hamburger → slide-in drawer from right (translateX, 250ms), backdrop, body scroll lock, focus trap, Escape closes, close button. Dropdowns + mega menu become accordions (`aria-expanded`). Min touch target 44px. CTA at bottom of drawer.
- No layout shift when header becomes sticky (reserve height).

## Done when
All of the above works with mouse, keyboard and touch at 375/768/1440. lint + build + commit "phase-02: header".
