"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { getCountries, getCountryCallingCode, AsYouType, CountryCode } from "libphonenumber-js";
import { ChevronDown } from "lucide-react";

interface PhoneInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  "aria-describedby"?: string;
  disabled?: boolean;
}

export function PhoneInput({
  id,
  value,
  onChange,
  onBlur,
  invalid,
  "aria-describedby": ariaDescribedBy,
  disabled,
}: PhoneInputProps) {
  // Extract country from value if possible, else default to US
  const initialCountry = "US"; // Default
  const [country, setCountry] = useState<CountryCode>(initialCountry);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const countries = getCountries().map((c) => ({
    code: c,
    callingCode: getCountryCallingCode(c),
  }));

  // Handle outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  const formatNumber = (val: string, countryCode: CountryCode) => {
    const asYouType = new AsYouType(countryCode);
    return asYouType.input(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatNumber(raw, country);
    onChange(formatted);
  };

  const selectCountry = (c: CountryCode) => {
    setCountry(c);
    setOpen(false);
    // Optionally format existing value for new country
    const formatted = formatNumber(value, c);
    onChange(formatted);
  };

  return (
    <div className="relative flex" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={[
          "flex items-center gap-1 px-3 py-2.5 text-sm border-y border-l rounded-l-[var(--radius-input)]",
          "bg-[var(--color-bg-base)] transition-colors duration-150 shrink-0",
          invalid ? "border-[var(--color-error)]" : "border-[var(--color-border)] hover:bg-[var(--color-border-light)]",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <span>{country} (+{getCountryCallingCode(country)})</span>
        <ChevronDown size={14} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <ul className="absolute top-full left-0 z-50 mt-1 max-h-60 w-64 overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border-light)] rounded-[var(--radius-card)] shadow-[var(--shadow-dropdown)] py-1">
          {countries.map((c, i) => (
            <li
              key={c.code}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-[var(--color-bg-section)] hover:text-[var(--color-primary)] transition-colors"
              onClick={() => selectCountry(c.code)}
            >
              {c.code} (+{c.callingCode})
            </li>
          ))}
        </ul>
      )}

      <input
        id={id}
        type="tel"
        value={value}
        onChange={handleInputChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={invalid}
        aria-describedby={ariaDescribedBy}
        placeholder="Phone number"
        className={[
          "flex-1 px-3 py-2.5 text-sm border rounded-r-[var(--radius-input)]",
          "bg-[var(--color-surface)] transition-colors duration-150",
          invalid ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]" : "border-[var(--color-border)] focus-visible:ring-[var(--color-link)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      />
    </div>
  );
}
