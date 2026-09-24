"use client";

import {
  useRef,
  useState,
  useEffect,
  useId,
  useCallback,
  KeyboardEvent,
} from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  id?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  invalid?: boolean;
  "aria-describedby"?: string;
  disabled?: boolean;
  label?: string;
}

export function Select({
  id,
  options,
  value,
  onChange,
  onBlur,
  placeholder = "Select an option",
  invalid = false,
  "aria-describedby": ariaDescribedBy,
  disabled = false,
}: SelectProps) {
  const generatedId = useId();
  const buttonId = id ?? `select-btn-${generatedId}`;
  const listboxId = `select-list-${generatedId}`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [typeahead, setTypeahead] = useState("");
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? "";

  const openList = useCallback(() => {
    if (disabled) return;
    const idx = options.findIndex((o) => o.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
    setOpen(true);
  }, [disabled, options, value]);

  const closeList = useCallback(
    (returnFocus = true) => {
      setOpen(false);
      setActiveIndex(-1);
      if (returnFocus) buttonRef.current?.focus();
    },
    []
  );

  const selectOption = useCallback(
    (opt: SelectOption) => {
      onChange(opt.value);
      closeList(true);
    },
    [onChange, closeList]
  );

  /* Outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open, onBlur]);

  /* Scroll active option into view */
  useEffect(() => {
    if (!open) return;
    const li = listRef.current?.children[activeIndex] as HTMLElement;
    li?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  /* Keyboard on button */
  const handleButtonKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openList();
    }
  };

  /* Keyboard on listbox */
  const handleListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0) selectOption(options[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        closeList(true);
        break;
      default: {
        /* Type-ahead */
        const char = e.key.length === 1 ? e.key.toLowerCase() : "";
        if (!char) break;
        clearTimeout(typeaheadTimer.current);
        const next = typeahead + char;
        setTypeahead(next);
        const match = options.findIndex((o) =>
          o.label.toLowerCase().startsWith(next)
        );
        if (match >= 0) setActiveIndex(match);
        typeaheadTimer.current = setTimeout(() => setTypeahead(""), 600);
        break;
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={invalid}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        onClick={() => (open ? closeList(false) : openList())}
        onKeyDown={handleButtonKey}
        onBlur={() => {
          if (!open) onBlur?.();
        }}
        className={[
          "w-full flex items-center justify-between gap-2",
          "px-3 py-2.5 text-sm rounded-[var(--radius-input)]",
          "border bg-[var(--color-surface)]",
          "transition-colors duration-150",
          invalid
            ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
            : "border-[var(--color-border)] focus-visible:ring-[var(--color-link)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <span
          className={
            selectedLabel
              ? "text-[var(--color-text-body)]"
              : "text-[var(--color-text-muted)]"
          }
        >
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={[
            "shrink-0 text-[var(--color-text-muted)] transition-transform duration-150",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={buttonId}
          onKeyDown={handleListKey}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
          className={[
            "absolute z-50 mt-1 w-full max-h-60 overflow-y-auto",
            "rounded-[var(--radius-card)] border border-[var(--color-border-light)]",
            "bg-[var(--color-surface)] shadow-[var(--shadow-dropdown)]",
            "py-1",
          ].join(" ")}
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isActive = i === activeIndex;
            return (
              <li
                key={opt.value}
                id={`${listboxId}-opt-${i}`}
                role="option"
                aria-selected={isSelected}
                onPointerDown={(e) => {
                  e.preventDefault();
                  selectOption(opt);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={[
                  "px-3 py-2 text-sm cursor-pointer transition-colors duration-100",
                  isActive
                    ? "bg-[var(--color-bg-section)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-body)]",
                  isSelected ? "font-semibold" : "",
                ].join(" ")}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
