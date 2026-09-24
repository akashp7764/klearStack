"use client";

import Link from "next/link";
import { NAV_ITEMS, CTA_PRIMARY, CTA_SECONDARY, HEADER_HEIGHT } from "./nav-data";
import { Dropdown } from "./Dropdown";
import { MegaMenu } from "./MegaMenu";
import { Button } from "@/components/ui/Button";

interface DesktopNavProps {
  openMenu: string | null;
  onMenuOpen: (label: string) => void;
  onMenuClose: () => void;
}

export function DesktopNav({ openMenu, onMenuOpen, onMenuClose }: DesktopNavProps) {
  return (
    <nav
      aria-label="Main"
      className="hidden lg:flex items-center gap-1 flex-1 px-4"
      style={{ height: HEADER_HEIGHT }}
    >
      {/* Logo */}
      <Link
        href="#"
        onClick={(e) => e.preventDefault()}
        className="flex items-center gap-2 mr-6 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2 rounded-md"
        aria-label="KlearStack home"
      >
        <KlearStackLogo />
      </Link>

      {/* Nav items */}
      <div className="flex items-center gap-0.5">
        {NAV_ITEMS.map((item) => {
          if (item.type === "link") {
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => e.preventDefault()}
                aria-current={item.isActive ? "page" : undefined}
                className={[
                  "px-3 py-2 text-sm font-medium rounded-md",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2",
                  item.isActive
                    ? "text-[var(--color-link)] font-semibold"
                    : "text-[var(--color-text-body)] hover:text-[var(--color-link)]",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          }

          if (item.type === "mega") {
            return (
              <MegaMenu
                key={item.label}
                item={item}
                isOpen={openMenu === item.label}
                onOpen={() => onMenuOpen(item.label)}
                onClose={onMenuClose}
              />
            );
          }

          return (
            <Dropdown
              key={item.label}
              item={item}
              isOpen={openMenu === item.label}
              onOpen={() => onMenuOpen(item.label)}
              onClose={onMenuClose}
            />
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {CTA_SECONDARY.label}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="group"
        >
          {CTA_PRIMARY.label}
          <span
            aria-hidden="true"
            className="ml-1 inline-block transition-transform duration-150 group-hover:translate-x-0.5"
          >
            →
          </span>
        </Button>
      </div>
    </nav>
  );
}

/** KlearStack logo — spark icon + wordmark */
function KlearStackLogo() {
  return (
    <span className="flex items-center gap-2">
      {/* Spark/lightning icon matching the Figma design */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <rect width="28" height="28" rx="6" fill="#1B2B6B" />
        <path
          d="M16 5L9 15h6l-3 8 9-11h-6l3-7z"
          fill="#F97316"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[var(--color-primary)] font-bold text-base tracking-tight">
        KlearStack
      </span>
    </span>
  );
}
