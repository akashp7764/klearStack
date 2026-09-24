"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
  /** Optionally render as an anchor */
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--color-primary)] text-white",
    "hover:bg-[var(--color-primary-dark)] hover:shadow-[var(--shadow-btn)]",
    "active:scale-[0.98]",
    "disabled:bg-[var(--color-text-muted)] disabled:cursor-not-allowed disabled:shadow-none",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2",
  ].join(" "),
  secondary: [
    "bg-transparent text-[var(--color-primary)] border-2 border-[var(--color-primary)]",
    "hover:bg-[var(--color-primary)] hover:text-white",
    "active:scale-[0.98]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--color-primary)]",
    "hover:bg-[var(--color-bg-section)]",
    "active:scale-[0.98]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-2.5 text-sm gap-2",
  lg: "px-8 py-3 text-base gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={[
          "inline-flex items-center justify-center font-semibold",
          "rounded-[var(--radius-btn)] transition-all duration-150",
          "select-none whitespace-nowrap",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        {...props}
      >
        {loading && (
          <Loader2
            className="animate-spin shrink-0"
            size={size === "sm" ? 14 : 16}
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
