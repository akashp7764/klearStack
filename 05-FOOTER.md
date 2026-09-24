# 05 — FOOTER (P0)  — PARALLEL  ~10 min

Read 00-MASTER-CONTEXT.md first. Edit ONLY `components/footer/**`.
Screenshot: `/design/footer*.png`.

## ⚠️ USER INPUT REQUIRED
```
Logo + tagline: <<FILL>>
Link groups (title → links): <<FILL>>
Social icons (which platforms): <<FILL>>
Newsletter field? <<yes/no + placeholder + button text>>
Legal text / copyright / bottom links: <<FILL>>
Contact details (address/email/phone) if shown: <<FILL>>
```

## Build
- `<footer>` with `<nav aria-label="Footer">` groups as lists; `href="#"` with preventDefault.
- Link hover per design (colour + underline slide-in from left, 200ms). Social icons as inline SVG with `aria-label`, hover lift/colour, `active:scale-95`.
- Newsletter (if present): validate email syntax on blur + submit, specific error, success message "Thanks — you're subscribed." (not wired to a system — note in ai-log as optional per brief).
- Responsive stacking: desktop columns per design → tablet 2-col grid → mobile single column (or accordions if design shows). Log assumption if design lacks tablet.
- Year via `new Date().getFullYear()`.

lint + build + commit "phase-05: footer".
