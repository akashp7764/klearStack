"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavItem } from "./nav-data";

const OPEN_DELAY = 100; // ms — hover intent delay to open
const CLOSE_DELAY = 200; // ms — grace period so mouse can travel into panel

interface DropdownProps {
  item: NavItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function Dropdown({ item, isOpen, onOpen, onClose }: DropdownProps) {
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const scheduleOpen = useCallback(() => {
    clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(onOpen, OPEN_DELAY);
  }, [onOpen]);

  const scheduleClose = useCallback(() => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(onClose, CLOSE_DELAY);
  }, [onClose]);

  const cancelClose = useCallback(() => {
    clearTimeout(closeTimer.current);
  }, []);

  // Keyboard: Escape closes and returns focus to trigger
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      triggerRef.current?.focus();
    }
    if (e.key === "ArrowDown" && !isOpen) {
      e.preventDefault();
      onOpen();
    }
  };

  const panelId = `dropdown-${item.label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div
      className="relative"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-current={item.isActive ? "page" : undefined}
        onClick={() => (isOpen ? onClose() : onOpen())}
        onKeyDown={handleKeyDown}
        className={[
          "flex items-center gap-1 px-1 py-2 text-sm font-medium",
          "transition-colors duration-150 rounded-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2",
          item.isActive
            ? "text-[var(--color-link)] font-semibold underline decoration-2 underline-offset-4"
            : "text-[var(--color-text-body)] hover:text-[var(--color-link)]",
        ].join(" ")}
      >
        {item.label}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={[
            "transition-transform duration-150 mt-px",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {/* Panel — mounted always, shown via visibility+opacity for animated close */}
      <div
        ref={panelRef}
        id={panelId}
        role="menu"
        aria-label={item.label}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className={[
          "absolute top-full left-0 mt-1 min-w-[200px]",
          "bg-[var(--color-surface)] rounded-[var(--radius-card)]",
          "border border-[var(--color-border-light)] shadow-[var(--shadow-dropdown)]",
          "py-1 z-50",
          "transition-all duration-[180ms] ease-out",
          isOpen
            ? "opacity-100 translate-y-0 scale-100 visible"
            : "opacity-0 -translate-y-1 scale-[0.98] invisible pointer-events-none",
        ].join(" ")}
        style={{ transformOrigin: "top left" }}
      >
        {item.dropdown?.map((child) => (
          <Link
            key={child.label}
            href={child.href}
            role="menuitem"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className={[
              "block px-4 py-2 text-sm text-[var(--color-text-body)]",
              "hover:bg-[var(--color-bg-section)] hover:text-[var(--color-primary)]",
              "transition-colors duration-100",
            ].join(" ")}
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
