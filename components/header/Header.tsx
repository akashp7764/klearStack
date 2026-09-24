"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Menu } from "lucide-react";
import { DesktopNav } from "./DesktopNav";
import { MobileDrawer } from "./MobileDrawer";
import { NAV_ITEMS, HEADER_HEIGHT } from "./nav-data";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Sticky: transparent → solid + shadow after scrollY > 8px
  // ASSUMPTION logged in ai-log: sticky assumed yes per spec (design was unclear)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close open desktop menu on scroll
  useEffect(() => {
    const onScroll = () => setOpenMenu(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Outside click: close desktop menus
  useEffect(() => {
    if (!openMenu) return;
    const handler = (e: PointerEvent) => {
      const header = document.getElementById("site-header");
      if (!header?.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [openMenu]);

  const handleMenuOpen = useCallback((label: string) => {
    setOpenMenu(label);
  }, []);

  const handleMenuClose = useCallback(() => {
    setOpenMenu(null);
  }, []);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    // Return focus to hamburger when drawer closes
    setTimeout(() => hamburgerRef.current?.focus(), 50);
  }, []);

  return (
    <>
      {/* Height reservation div — prevents layout shift when header becomes sticky */}
      <div aria-hidden="true" style={{ height: HEADER_HEIGHT }} className="lg:block" />

      <header
        id="site-header"
        role="banner"
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-200",
          scrolled
            ? "bg-[var(--color-surface)] shadow-[var(--shadow-header)]"
            : "bg-white/95 backdrop-blur-sm",
        ].join(" ")}
        style={{ height: HEADER_HEIGHT }}
      >
        <div className="container-page h-full flex items-center justify-between">
          {/* Desktop nav (hidden on mobile) */}
          <DesktopNav
            openMenu={openMenu}
            onMenuOpen={handleMenuOpen}
            onMenuClose={handleMenuClose}
          />

          {/* Mobile: logo + hamburger (visible < lg) */}
          <div className="flex lg:hidden items-center justify-between w-full">
            {/* Logo */}
            <span className="flex items-center gap-2">
              <svg
                width="26"
                height="26"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <rect width="28" height="28" rx="6" fill="#1B2B6B" />
                <path d="M16 5L9 15h6l-3 8 9-11h-6l3-7z" fill="#F97316" />
              </svg>
              <span className="text-[var(--color-primary)] font-bold text-base">
                KlearStack
              </span>
            </span>

            {/* Hamburger */}
            <button
              ref={hamburgerRef}
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              onClick={openMobile}
              className={[
                "p-2 rounded-md text-[var(--color-text-body)]",
                "hover:bg-[var(--color-bg-section)] hover:text-[var(--color-primary)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)]",
                "min-w-[44px] min-h-[44px] flex items-center justify-center",
              ].join(" ")}
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div id="mobile-drawer">
        <MobileDrawer
          isOpen={mobileOpen}
          onClose={closeMobile}
          navItems={NAV_ITEMS}
        />
      </div>
    </>
  );
}
