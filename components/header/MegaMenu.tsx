"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavItem } from "./nav-data";

const OPEN_DELAY = 100;
const CLOSE_DELAY = 200;

interface MegaMenuProps {
  item: NavItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function MegaMenu({ item, isOpen, onOpen, onClose }: MegaMenuProps) {
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const scheduleOpen = useCallback(() => {
    clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(onOpen, OPEN_DELAY);
  }, [onOpen]);

  const scheduleClose = useCallback(() => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(onClose, CLOSE_DELAY);
  }, [onClose]);

  const cancelClose = useCallback(() => clearTimeout(closeTimer.current), []);

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

  const panelId = `mega-${item.label.toLowerCase().replace(/\s+/g, "-")}`;

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

      {/* Mega panel */}
      <div
        id={panelId}
        role="menu"
        aria-label={`${item.label} menu`}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className={[
          "absolute top-full left-1/2 -translate-x-1/2 mt-1",
          "w-[480px] max-w-[90vw]",
          "bg-[var(--color-surface)] rounded-[var(--radius-card)]",
          "border border-[var(--color-border-light)] shadow-[var(--shadow-dropdown)]",
          "p-4 z-50",
          "transition-all duration-[180ms] ease-out",
          isOpen
            ? "opacity-100 translate-y-0 scale-100 visible"
            : "opacity-0 -translate-y-1 scale-[0.98] invisible pointer-events-none",
        ].join(" ")}
        style={{ transformOrigin: "top center" }}
      >
        <div className="grid grid-cols-2 gap-x-6">
          {item.megaColumns?.map((col, colIdx) => (
            <div key={colIdx}>
              {col.isHeader && col.title ? (
                <Link
                  href={col.titleHref ?? "#"}
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                  }}
                  className={[
                    "flex items-center gap-1 text-sm font-bold text-[var(--color-link)]",
                    "mb-3 hover:underline",
                  ].join(" ")}
                >
                  {col.title}
                  <span aria-hidden="true" className="text-xs">→</span>
                </Link>
              ) : null}

              <ul className="space-y-0.5">
                {col.items.map((child) => (
                  <li key={child.label}>
                    <Link
                      href={child.href}
                      role="menuitem"
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                      }}
                      className={[
                        "flex items-center gap-2 px-2 py-2 text-sm rounded-md",
                        "text-[var(--color-text-body)]",
                        "hover:bg-[var(--color-bg-section)] hover:text-[var(--color-primary)]",
                        "transition-colors duration-100",
                      ].join(" ")}
                    >
                      {child.icon && (
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[var(--color-link)] flex items-center justify-center">
                          <svg
                            width="8"
                            height="6"
                            viewBox="0 0 8 6"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M1 3l2 2 4-4"
                              stroke="white"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
