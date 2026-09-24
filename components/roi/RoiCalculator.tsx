"use client";

import { useState } from "react";
import { formatCurrency, formatPercent, formatCompact } from "@/lib/format";

export default function RoiCalculator() {
  const [docsPerMonth, setDocsPerMonth] = useState<number>(10000);
  const [costPerDoc, setCostPerDoc] = useState<number>(50); // in INR
  const [errorRate, setErrorRate] = useState<number>(5); // percentage

  // KlearStack assumptions
  const ksCostPerDoc = costPerDoc * 0.3; // 70% cheaper
  const ksErrorRate = 1; // 1% error rate

  const currentMonthlyCost = docsPerMonth * costPerDoc;
  const ksMonthlyCost = docsPerMonth * ksCostPerDoc;
  
  const errorCostAssumption = 500; // INR cost per error
  const currentErrors = Math.floor(docsPerMonth * (errorRate / 100));
  const ksErrors = Math.floor(docsPerMonth * (ksErrorRate / 100));
  
  const currentMonthlyErrorCost = currentErrors * errorCostAssumption;
  const ksMonthlyErrorCost = ksErrors * errorCostAssumption;

  const currentTotal = currentMonthlyCost + currentMonthlyErrorCost;
  const ksTotal = ksMonthlyCost + ksMonthlyErrorCost;

  const monthlySavings = currentTotal - ksTotal;
  const annualSavings = monthlySavings * 12;
  const roiPercentage = ((currentTotal - ksTotal) / ksTotal) * 100;

  return (
    <section id="roi" className="bg-white py-16 md:py-24" aria-labelledby="roi-title">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 id="roi-title" className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)] mb-4 tracking-tight">
            Calculate Your ROI
          </h2>
          <p className="text-lg text-[var(--color-text-body)] max-w-2xl mx-auto">
            See how much you can save by switching from manual processing to KlearStack's AI-driven automation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Controls */}
          <div className="bg-[var(--color-bg-base)] p-8 rounded-[var(--radius-card)] space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="docs" className="font-semibold text-[var(--color-text-body)]">Monthly Documents</label>
                <span className="font-bold text-[var(--color-primary)]">{formatCompact(docsPerMonth)}</span>
              </div>
              <input
                id="docs"
                type="range"
                min={1000}
                max={500000}
                step={1000}
                value={docsPerMonth}
                onChange={(e) => setDocsPerMonth(Number(e.target.value))}
                className="w-full accent-[var(--color-link)]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="cost" className="font-semibold text-[var(--color-text-body)]">Current Cost per Doc (₹)</label>
                <span className="font-bold text-[var(--color-primary)]">₹{costPerDoc}</span>
              </div>
              <input
                id="cost"
                type="range"
                min={10}
                max={500}
                step={5}
                value={costPerDoc}
                onChange={(e) => setCostPerDoc(Number(e.target.value))}
                className="w-full accent-[var(--color-link)]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="error" className="font-semibold text-[var(--color-text-body)]">Manual Error Rate (%)</label>
                <span className="font-bold text-[var(--color-primary)]">{errorRate}%</span>
              </div>
              <input
                id="error"
                type="range"
                min={1}
                max={20}
                step={1}
                value={errorRate}
                onChange={(e) => setErrorRate(Number(e.target.value))}
                className="w-full accent-[var(--color-link)]"
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="bg-[var(--color-primary)] text-white p-8 rounded-[var(--radius-card)] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              
              <h3 className="text-xl font-medium mb-2 text-[var(--color-footer-bg)]">Your Annual Savings</h3>
              <p className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
                {formatCurrency(annualSavings)}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
                <div>
                  <p className="text-sm text-[var(--color-footer-bg)] mb-1">Monthly Savings</p>
                  <p className="text-2xl font-bold">{formatCurrency(monthlySavings)}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-footer-bg)] mb-1">Estimated ROI</p>
                  <p className="text-2xl font-bold">{formatPercent(roiPercentage)}</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-[var(--color-text-muted)] text-center">
              *Assumes KlearStack reduces processing cost by 70% and lowers error rates to 1%. Cost per error estimated at ₹500.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
