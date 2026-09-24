"use client";

interface FieldErrorProps {
  id: string;
  message?: string;
  /** live="polite" for on-blur errors; role="alert" for first-submit errors */
  variant?: "polite" | "alert";
}

export function FieldError({ id, message, variant = "polite" }: FieldErrorProps) {
  if (!message) return null;

  const isAlert = variant === "alert";

  return (
    <p
      id={id}
      role={isAlert ? "alert" : undefined}
      aria-live={!isAlert ? "polite" : undefined}
      aria-atomic="true"
      className="mt-1 text-xs font-medium text-[var(--color-error)] flex items-center gap-1"
    >
      <svg
        aria-hidden="true"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className="shrink-0"
      >
        <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
        <path
          d="M6 3.5v3M6 8v.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      {message}
    </p>
  );
}
