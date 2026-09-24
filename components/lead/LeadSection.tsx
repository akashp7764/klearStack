"use client";

import { LeadForm } from "./LeadForm";

export default function LeadSection() {
  const logos = [
    "HDFC Bank", "ICICI Bank", "Axis Bank", "SBI", "Kotak Mahindra", "Bajaj Finserv", "Muthoot Finance"
  ]; // Placeholder for actual logo SVGs

  return (
    <section
      id="contact"
      aria-labelledby="lead-section-title"
      className="bg-[var(--color-bg-base)] py-16 md:py-24"
    >
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Panel */}
          <div className="space-y-8">
            <div>
              <h2
                id="lead-section-title"
                className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)] mb-4 tracking-tight"
              >
                Automate Document Processing Today
              </h2>
              <p className="text-lg text-[var(--color-text-body)]">
                Join industry leaders who have transformed their operations with KlearStack's AI-driven platform.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--color-link)] flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[var(--color-text-body)]">99% Accuracy in data extraction</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--color-link)] flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[var(--color-text-body)]">Zero template setup required</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--color-link)] flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[var(--color-text-body)]">Enterprise-grade security</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
                Trusted by 50+ Enterprises
              </p>
              {/* Simple marquee placeholder */}
              <div className="relative overflow-hidden w-full bg-white rounded-[var(--radius-card)] p-4 border border-[var(--color-border-light)]">
                <div className="flex whitespace-nowrap gap-8 animate-[marquee_20s_linear_infinite]">
                  {logos.map((logo, i) => (
                    <span key={i} className="text-xl font-bold text-[var(--color-text-muted)] opacity-50">{logo}</span>
                  ))}
                  {/* Duplicate for infinite effect */}
                  {logos.map((logo, i) => (
                    <span key={i + "dup"} className="text-xl font-bold text-[var(--color-text-muted)] opacity-50">{logo}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="lg:pl-8">
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
