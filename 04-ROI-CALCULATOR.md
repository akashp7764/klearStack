# 04 — ROI CALCULATOR (P0, PASS/FAIL on correctness)  — PARALLEL  ~25 min

Read 00-MASTER-CONTEXT.md first. Edit ONLY `components/roi/**`, `lib/roi.ts`, `lib/roi.test.ts`, `lib/format.ts`.
Screenshot: `/design/roi*.png`.

## ⚠️ USER INPUT REQUIRED — copy EXACTLY from the ROI sheet
(Tip: in Google Sheets press Ctrl + ` to show formulas, then copy.)
```
INPUTS (name | control type toggle/dropdown/segmented | options with their numeric values | default):
1. <<>>
2. <<>>
...

CONSTANTS / lookup tables in the sheet:
<<paste>>

FORMULAS (cell → formula, in calculation order, with cell names mapped to inputs):
<<paste e.g. C10 = ROUND(C4*C5*(1+C6),0)>>

OUTPUTS (label | cell | format in design: ₹ / %, decimals, L/Cr abbreviation?):
1. <<>>
2. <<>>

TEST CASES from the sheet (change inputs in the sheet, copy outputs):
Case A: inputs <<>> → outputs <<>>
Case B: inputs <<>> → outputs <<>>
Case C: inputs <<>> → outputs <<>>
Case D (min / zero edge): <<>>
Case E (max edge): <<>>
Default state outputs (sheet defaults): <<>>
```

## lib/roi.ts
- Pure function `calculateRoi(inputs: RoiInputs): RoiOutputs`, no UI, no formatting. Translate each sheet formula 1:1 with a comment citing the cell (e.g. `// Sheet C10`).
- Replicate spreadsheet functions exactly: `ROUND` = round half AWAY from zero (JS `Math.round` differs for negatives and .5 float errors) → implement `roundHalfAwayFromZero(n, digits)` using `Math.sign(n) * Math.round(Math.abs(n) * 10**d + Number.EPSILON) / 10**d`. Also ROUNDUP/ROUNDDOWN/IF/MIN/MAX/IFERROR if used. Only round where the sheet rounds.
- Division by zero → return what the sheet shows (e.g. 0 or "—") — mirror IFERROR behaviour.

## lib/roi.test.ts
- One test per USER INPUT test case (A–E + default). Assert exact equality with the sheet values (use toBeCloseTo only if the sheet displays rounded values; then compare the displayed formatted string too).
- `npm test` must pass. If a case fails, fix the formula — never adjust the expected value.

## lib/format.ts
- `formatCurrency`, `formatPercent`, `formatCompact` using `Intl.NumberFormat('en-IN')` unless design shows international grouping.
- L/Cr rule per design (e.g. ≥ 1,00,00,000 → "₹1.25 Cr", ≥ 1,00,000 → "₹4.5 L"); decimals exactly as design. Add tests for formatting too.

## UI (components/roi/)
- Inputs left, outputs right (stack on mobile, outputs below inputs; state assumption). Use `Toggle`, `SegmentedControl`, `Select` from components/ui as design shows.
- Outputs recalculate live on every change (useMemo; no submit button). Output area `aria-live="polite"`. Fixed-width / tabular-nums so numbers changing doesn't shift layout.
- Loads with sheet defaults.

## Done when
`npm test` green for all sheet cases; UI matches design; live updates. Put the test-case table (inputs | sheet output | app output) into docs/ai-log.md — it goes straight into the process report. Commit "phase-04: roi calculator".
