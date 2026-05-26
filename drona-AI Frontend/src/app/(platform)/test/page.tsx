"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";

export default function TestPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLeave = () => {
    // Set flag so AssessmentEngine knows to jump straight to cinematic
    if (typeof window !== "undefined") {
      window.localStorage.setItem("forceCinematic", "true");
    }
    router.push("/onboarding");
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fadeIn min-h-[60vh] mt-20">
      <div className="w-24 h-24 rounded-[2rem] bg-surface-container-high flex items-center justify-center mb-8 border border-outline-variant/30 shadow-inner relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-tertiary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="material-symbols-outlined text-primary text-5xl relative z-10 transition-transform duration-500 group-hover:scale-110" style={{ fontVariationSettings: "'FILL' 1" }}>
          engineering
        </span>
      </div>
      
      <h1 className="font-display text-4xl md:text-5xl font-black text-on-surface mb-4 tracking-tight">
        Test In Development
      </h1>
      
      <p className="text-lg text-on-surface-variant max-w-lg mb-10 leading-relaxed font-medium">
        The adaptive diagnostic assessment engine is currently undergoing calibration for state boards and national curriculum. We apologize for the inconvenience.
      </p>

      <button onClick={handleLeave}
        className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer bg-[#0a0a0f] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative z-10 material-symbols-outlined text-xl">arrow_back</span>
        <span className="relative z-10">Return to Initialization</span>
      </button>
    </div>
  );
}
