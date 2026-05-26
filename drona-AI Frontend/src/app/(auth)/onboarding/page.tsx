"use client";

import { useState } from "react";
import Logo from "@/components/ui/Logo";
import AssessmentEngine from "@/components/onboarding/AssessmentEngine";

export default function OnboardingPage() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-background text-on-background font-body h-screen flex flex-col antialiased relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-[-1]">
        <img
          alt=""
          className="w-full h-full object-cover opacity-80 mix-blend-multiply"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIlat7D48cwHcE9TO54SYKCLPCQVVROo1qUoyjKBvV_ylkq4P4C_MknvL5EmFFN27HU-ZU_kv2N_PDY_QCGcaX1hyVugU1bd6mndywIfMHmLsp8dxMWY_lqXdRN-TbuRBRKY7R2f0VSP6SuIBenA55DWBUKPISVMhIA2ez2BUUWOFgK54HWi519YAhnEYzIcNFQROzR7hqLDGtFKwEYIUpPxnJyllOEsFYXy3UbcVT_w7J6Fmx0yiTo4O2_o9kQ1OtSO7Y42-FUhE"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-white/90 backdrop-blur-[2px]"></div>
      </div>

      {/* Header — clean: logo + assessment protocol with tooltip */}
      <header className="w-full px-8 h-16 flex justify-between items-center bg-white/50 backdrop-blur-xl border-b border-white/60 shrink-0 z-50">
        <Logo isSpan={true} />
        <div className="relative">
          <button
            className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span>Assessment Protocol</span>
            <span className="material-symbols-outlined text-lg text-outline">help_outline</span>
          </button>

          {/* Tooltip on hover */}
          {showTooltip && (
            <div className="absolute top-full right-0 mt-2 w-80 p-5 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-outline-variant/20 z-[100] animate-fadeIn">
              <h4 className="font-display text-sm font-bold text-on-surface mb-2">What is this assessment?</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                This is a scientifically-designed profiling session that helps Drona AI understand your learning style, cognitive patterns, strengths, and areas of growth. Your responses are used to initialize your personalized multi-agent teaching system.
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                The assessment adapts in real-time to your answers — asking follow-up questions that probe deeper into your academic mindset, study habits, and psychological tendencies.
              </p>
              <p className="text-[11px] text-primary font-semibold uppercase tracking-wider">
                All responses are private and encrypted.
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Full-height Assessment */}
      <main className="flex-1 flex flex-col w-full mx-auto relative z-10 min-h-0">
        <AssessmentEngine />
      </main>
    </div>
  );
}
