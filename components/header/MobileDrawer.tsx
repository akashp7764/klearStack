"use client";

import { useEffect, useRef, useCallback, useReducer } from "react";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";
import type { NavItem } from "./nav-data";
import { CTA_PRIMARY, CTA_SECONDARY } from "./nav-data";
import { Button } from "@/components/ui/Button";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

type AccordionState = Record<string, boolean>;
type AccordionAction = { label: string };

function accordionReducer(state: AccordionState, action: AccordionAction): AccordionState {
  return { ...state, [action.label]: !state[action.label] };
}

export function MobileDrawer({ isOpen, onClose, navItems }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [accordion, dispatch] = useReducer(accordionReducer, {});

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key + focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]",
          "transition-opacity duration-[250ms]",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={[
          "fixed top-0 right-0 bottom-0 z-50 w-[300px] max-w-[85vw]",
          "bg-[var(--color-surface)] shadow-[var(--shadow-dropdown)]",
          "flex flex-col overflow-y-auto",
          "transition-transform duration-[250ms] ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--color-border-light)] shrink-0">
          <span className="font-bold text-[var(--color-primary)] flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="28" height="28" rx="6" fill="#1B2B6B" />
              <path d="M16 5L9 15h6l-3 8 9-11h-6l3-7z" fill="#F97316" />
            </svg>
            KlearStack
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className={[
              "p-2 rounded-md text-[var(--color-text-muted)]",
              "hover:bg-[var(--color-bg-section)] hover:text-[var(--color-primary)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)]",
              "min-w-[44px] min-h-[44px] flex items-center justify-center",
            ].join(" ")}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Nav items */}
        <nav aria-label="Mobile navigation" className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (item.type === "link") {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); onClose(); }}
                  aria-current={item.isActive ? "page" : undefined}
                  className={[
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md min-h-[44px]",
                    "transition-colors duration-150",
                    item.isActive
                      ? "text-[var(--color-link)] bg-[var(--color-bg-section)]"
                      : "text-[var(--color-text-body)] hover:bg-[var(--color-bg-section)] hover:text-[var(--color-primary)]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            }

            const expanded = !!accordion[item.label];
            const subItems =
              item.type === "dropdown"
                ? (item.dropdown ?? [])
                : (item.megaColumns ?? []).flatMap((col) => col.items);

            return (
              <div key={item.label}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`mobile-acc-${item.label}`}
                  onClick={() => dispatch({ label: item.label })}
                  className={[
                    "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md",
                    "min-h-[44px] transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)]",
                    item.isActive
                      ? "text-[var(--color-link)] bg-[var(--color-bg-section)]"
                      : "text-[var(--color-text-body)] hover:bg-[var(--color-bg-section)] hover:text-[var(--color-primary)]",
                  ].join(" ")}
                >
                  {item.label}
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={[
                      "transition-transform duration-150 text-[var(--color-text-muted)]",
                      expanded ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                {expanded && (
                  <div
                    id={`mobile-acc-${item.label}`}
                    className="ml-4 pl-3 border-l-2 border-[var(--color-border-light)] mt-1 mb-1 space-y-0.5"
                  >
                    {subItems.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={(e) => { e.preventDefault(); onClose(); }}
                        className={[
                          "flex items-center px-3 py-2.5 text-sm rounded-md min-h-[44px]",
                          "text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-section)]",
                          "transition-colors duration-100",
                        ].join(" ")}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* CTAs pinned at bottom */}
        <div className="px-4 py-4 border-t border-[var(--color-border-light)] space-y-3 shrink-0">
          <Button
            variant="secondary"
            size="md"
            className="w-full justify-center"
            onClick={onClose}
          >
            {CTA_SECONDARY.label}
          </Button>
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center"
            onClick={onClose}
          >
            {CTA_PRIMARY.label} →
          </Button>
        </div>
      </div>
    </>
  );
}
