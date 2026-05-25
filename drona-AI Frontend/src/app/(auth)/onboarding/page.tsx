"use client";

import { useState } from "react";
import Link from "next/link";

type LearningStyle = "Conceptual Deep-Dives" | "Problem-Solving Drills" | "Visual Narratives";

export default function OnboardingPage() {
  const [selectedStyle, setSelectedStyle] = useState<LearningStyle>("Conceptual Deep-Dives");
  const [elaboration, setElaboration] = useState("");
  const [phase, setPhase] = useState(2); // Start at Phase 2: Cognitive Mapping
  const [progress, setProgress] = useState(60);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [assessmentFinished, setAssessmentFinished] = useState(false);

  const handleStyleSelect = (style: LearningStyle) => {
    setSelectedStyle(style);
    setIsCalibrating(true);
    // Simulate calibration effect
    setTimeout(() => {
      setIsCalibrating(false);
    }, 1200);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === 2) {
      setPhase(3);
      setProgress(85);
    } else if (phase === 3) {
      setProgress(100);
      setAssessmentFinished(true);
    }
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col antialiased relative">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-[-1]">
        <img
          alt="Cinematic AI Neural Network Background"
          className="w-full h-full object-cover opacity-80 mix-blend-multiply"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIlat7D48cwHcE9TO54SYKCLPCQVVROo1qUoyjKBvV_ylkq4P4C_MknvL5EmFFN27HU-ZU_kv2N_PDY_QCGcaX1hyVugU1bd6mndywIfMHmLsp8dxMWY_lqXdRN-TbuRBRKY7R2f0VSP6SuIBenA55DWBUKPISVMhIA2ez2BUUWOFgK54HWi519YAhnEYzIcNFQROzR7hqLDGtFKwEYIUpPxnJyllOEsFYXy3UbcVT_w7J6Fmx0yiTo4O2_o9kQ1OtSO7Y42-FUhE"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-white/90 backdrop-blur-[2px]"></div>
      </div>

      {/* Top Header */}
      <header className="w-full px-8 h-20 flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-white/50 sticky top-0 z-50">
        <Link href="/" className="font-display font-black text-2xl tracking-tighter text-primary hover:opacity-80 transition-opacity">
          DRONA.AI
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-on-surface-variant">Assessment Protocol</span>
          <span className="material-symbols-outlined text-outline cursor-pointer select-none">help</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col w-full max-w-4xl mx-auto mt-12 mb-24 px-4 sm:px-8 gap-12 relative z-10">
        {!assessmentFinished ? (
          <div className="flex-grow flex flex-col w-full">
            {/* Onboarding Notice */}
            <div className="mb-10 p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm flex items-start gap-4 animate-fadeIn">
              <span className="material-symbols-outlined text-primary shrink-0 mt-0.5">info</span>
              <div className="text-on-surface-variant leading-relaxed text-sm">
                <strong className="text-on-surface font-semibold block mb-1 text-base">Onboarding Notice</strong>
                This assessment is essential for initializing your personalized multi-agent intelligence. Your responses directly seed the agents&apos; foundational knowledge base.
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-12 px-2">
              <div className="flex justify-between items-end mb-4">
                <h2 className="font-display text-4xl font-semibold text-on-surface tracking-tight">Profiling Completion</h2>
                <span className="font-headline text-2xl text-primary italic font-medium">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/50 backdrop-blur-sm rounded-full overflow-hidden border border-white/60 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant mt-3 font-medium tracking-wide uppercase">
                {phase === 2 ? "Phase 2: Cognitive Mapping" : "Phase 3: Final Calibration"}
              </p>
            </div>

            {/* Conversational Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8 md:p-14 relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-start gap-6 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      psychology
                    </span>
                  </div>
                  <div className="pt-1">
                    <h3 className="font-body text-sm uppercase tracking-widest font-semibold text-primary/80 mb-3">Drona Assessment Agent</h3>
                    {phase === 2 ? (
                      <p className="font-display text-on-surface leading-tight text-3xl md:text-4xl font-medium">
                        &quot;To best structure your intelligence feeds, what type of learning materials do you find most engaging and effective for grasping new concepts?&quot;
                      </p>
                    ) : (
                      <p className="font-display text-on-surface leading-tight text-3xl md:text-4xl font-medium">
                        &quot;How do you prefer to handle incorrect attempts or mistakes during high-intensity practice sessions?&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Response Options */}
                {phase === 2 ? (
                  <div className="space-y-4 pl-0 md:pl-20 mt-12">
                    <button
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 group/btn relative overflow-hidden shadow-sm cursor-pointer ${
                        selectedStyle === "Conceptual Deep-Dives"
                          ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                          : "border-white bg-white/50 hover:border-primary/30 hover:bg-white/80"
                      }`}
                      onClick={() => handleStyleSelect("Conceptual Deep-Dives")}
                    >
                      <div className="relative z-10 flex items-center justify-between">
                        <span className={`font-medium text-lg transition-colors ${selectedStyle === "Conceptual Deep-Dives" ? "text-primary" : "text-on-surface"}`}>
                          Conceptual Deep-Dives
                        </span>
                        <span className={`material-symbols-outlined text-2xl ${selectedStyle === "Conceptual Deep-Dives" ? "text-primary" : "text-outline-variant/60"}`}>
                          {selectedStyle === "Conceptual Deep-Dives" ? "check_circle" : "radio_button_unchecked"}
                        </span>
                      </div>
                    </button>

                    <button
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 group/btn relative overflow-hidden shadow-sm cursor-pointer ${
                        selectedStyle === "Problem-Solving Drills"
                          ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                          : "border-white bg-white/50 hover:border-primary/30 hover:bg-white/80"
                      }`}
                      onClick={() => handleStyleSelect("Problem-Solving Drills")}
                    >
                      <div className="relative z-10 flex items-center justify-between">
                        <span className={`font-medium text-lg transition-colors ${selectedStyle === "Problem-Solving Drills" ? "text-primary" : "text-on-surface"}`}>
                          Problem-Solving Drills
                        </span>
                        <span className={`material-symbols-outlined text-2xl ${selectedStyle === "Problem-Solving Drills" ? "text-primary" : "text-outline-variant/60"}`}>
                          {selectedStyle === "Problem-Solving Drills" ? "check_circle" : "radio_button_unchecked"}
                        </span>
                      </div>
                    </button>

                    <button
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 group/btn relative overflow-hidden shadow-sm cursor-pointer ${
                        selectedStyle === "Visual Narratives"
                          ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                          : "border-white bg-white/50 hover:border-primary/30 hover:bg-white/80"
                      }`}
                      onClick={() => handleStyleSelect("Visual Narratives")}
                    >
                      <div className="relative z-10 flex items-center justify-between">
                        <span className={`font-medium text-lg transition-colors ${selectedStyle === "Visual Narratives" ? "text-primary" : "text-on-surface"}`}>
                          Visual Narratives
                        </span>
                        <span className={`material-symbols-outlined text-2xl ${selectedStyle === "Visual Narratives" ? "text-primary" : "text-outline-variant/60"}`}>
                          {selectedStyle === "Visual Narratives" ? "check_circle" : "radio_button_unchecked"}
                        </span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 pl-0 md:pl-20 mt-12">
                    <div className="p-6 rounded-2xl border-2 border-primary bg-primary/5 flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary text-3xl">history</span>
                      <div>
                        <strong className="text-on-surface block text-base font-semibold">Adaptive Doubt Re-entry</strong>
                        <p className="text-sm text-on-surface-variant">Incorrect attempts are automatically filed in your Doubt Vault to reappear during customized revision cycles.</p>
                      </div>
                    </div>
                    <div className="p-6 rounded-2xl border border-white bg-white/50 flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary text-3xl">lightbulb</span>
                      <div>
                        <strong className="text-on-surface block text-base font-semibold">Discovery-first Feedback</strong>
                        <p className="text-sm text-on-surface-variant">Get step-by-step guidance that challenges you to identify errors rather than giving the final solution right away.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Elaborate text input */}
                <div className="mt-12 pt-8 border-t border-outline-variant/20 pl-0 md:pl-20">
                  <label className="block text-sm font-medium text-on-surface-variant mb-4">Or elaborate on your approach:</label>
                  <textarea
                    value={elaboration}
                    onChange={(e) => setElaboration(e.target.value)}
                    className="w-full bg-white/40 backdrop-blur-sm border border-white/80 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl px-5 py-4 text-on-surface placeholder:text-outline/60 resize-none transition-all shadow-inner outline-none text-base"
                    placeholder="Type your answer here..."
                    rows={3}
                  />
                  {/* Calibrating indicator */}
                  {(isCalibrating || elaboration.length > 5) && (
                    <div className="mt-6 p-5 rounded-xl bg-white/50 border border-white/60 backdrop-blur-sm flex items-start gap-3 transition-all duration-500 shadow-sm animate-fadeIn">
                      <span className="material-symbols-outlined text-primary text-base mt-0.5 animate-spin">sync</span>
                      <span className="text-sm font-medium text-on-surface-variant italic">Calibrating your precision vectors...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="mt-16 flex justify-end">
              <button
                onClick={handleNext}
                className="bg-primary text-white font-semibold py-4 px-12 rounded-2xl hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,66,220,0.3)] transition-all duration-300 flex items-center gap-3 text-lg border border-primary-container/50 cursor-pointer"
              >
                {phase === 2 ? "Next Question" : "Finalize Profile"}
                <span className="material-symbols-outlined">east</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center py-20 animate-fadeIn">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center mb-8 shadow-xl shadow-primary/30">
              <span className="material-symbols-outlined text-white text-5xl">task_alt</span>
            </div>
            <h2 className="font-display text-5xl font-bold text-on-surface tracking-tight mb-4">Assessment Complete</h2>
            <p className="font-body text-on-surface-variant text-lg max-w-lg mb-10">
              Your profile has been initialized with our signature multi-agent learning loop. The orchestrator is building your custom learning dashboard.
            </p>
            <Link
              href="/"
              className="bg-primary text-white font-semibold py-4 px-12 rounded-2xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center gap-3 text-lg cursor-pointer"
            >
              Enter Workspace
              <span className="material-symbols-outlined">dashboard</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
