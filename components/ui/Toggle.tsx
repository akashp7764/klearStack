"use client";

interface ToggleProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  "aria-describedby"?: string;
}

export function Toggle({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  "aria-describedby": ariaDescribedBy,
}: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full",
        "transition-colors duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2",
        checked ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md",
          "transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}

/* ─── Segmented Control ─────────────────────────────────────────────────── */

export interface SegmentOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  id?: string;
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export function SegmentedControl({
  id,
  options,
  value,
  onChange,
  label,
  disabled = false,
}: SegmentedControlProps) {
  const handleKey = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (idx + 1) % options.length;
      onChange(options[next].value);
      (e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (idx - 1 + options.length) % options.length;
      onChange(options[prev].value);
      (e.currentTarget.parentElement?.children[prev] as HTMLElement)?.focus();
    }
  };

  return (
    <div
      id={id}
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5 gap-0.5"
    >
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => handleKey(e, i)}
            className={[
              "px-4 py-1.5 text-sm font-medium rounded-[calc(var(--radius-btn)-2px)]",
              "transition-all duration-150 select-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-1",
              selected
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]",
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
