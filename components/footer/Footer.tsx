"use client";

import Link from "next/link";
import { NAV_ITEMS } from "@/components/header/nav-data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-8" role="contentinfo">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-12">
          
          {/* Brand & Contact */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2" aria-label="KlearStack home">
              <svg width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="28" height="28" rx="6" fill="#1B2B6B" />
                <path d="M16 5L9 15h6l-3 8 9-11h-6l3-7z" fill="#F97316" strokeLinejoin="round" />
              </svg>
              <span className="text-xl font-bold tracking-tight">KlearStack</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm">
              The Only Document AI With Fraud, Compliance & Audit Checks Built In. Transform your document processing with 99% accuracy.
            </p>
            <div className="space-y-2 text-sm text-slate-300">
              <p>Email: <a href="mailto:contact@klearstack.com" className="hover:text-white transition-colors">contact@klearstack.com</a></p>
              <p>Phone: <a href="tel:+18001234567" className="hover:text-white transition-colors">+1 (800) 123-4567</a></p>
            </div>
          </div>

          {/* Dynamic Links from Nav Data */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-100">Solutions</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {NAV_ITEMS.find(n => n.label === "Solutions")?.megaColumns?.flatMap(c => c.items).slice(0, 5).map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-[var(--color-accent)] transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-100">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {NAV_ITEMS.find(n => n.label === "Resources")?.dropdown?.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-[var(--color-accent)] transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-100">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {NAV_ITEMS.find(n => n.label === "Company")?.dropdown?.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-[var(--color-accent)] transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {currentYear} KlearStack. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/security" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
