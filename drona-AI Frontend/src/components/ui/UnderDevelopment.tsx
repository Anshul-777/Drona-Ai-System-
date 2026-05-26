import React from "react";
import Link from "next/link";

interface UnderDevelopmentProps {
  title: string;
  description?: string;
  icon?: string;
  showBack?: boolean;
}

export default function UnderDevelopment({
  title,
  description,
  icon = "engineering",
  showBack = false
}: UnderDevelopmentProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fadeIn min-h-[60vh] mt-20">
      <div className="w-24 h-24 rounded-[2rem] bg-surface-container-high flex items-center justify-center mb-8 border border-outline-variant/30 shadow-inner relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-tertiary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="material-symbols-outlined text-on-surface-variant text-5xl relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>

      <h1 className="font-display text-4xl md:text-5xl font-black text-on-surface mb-4 tracking-tight">
        {title} <br className="md:hidden" />
        <span className="text-primary/80 text-3xl md:text-4xl inline-block mt-2 md:mt-0 md:ml-3">(In Development)</span>
      </h1>

      <p className="text-lg text-on-surface-variant max-w-lg mb-10 leading-relaxed font-medium">
        {description || `The ${title} module is currently undergoing calibration and structural generation. We apologize for the inconvenience.`}
      </p>

      {showBack && (
        <Link href="/platform"
          className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer bg-[#0a0a0f] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 material-symbols-outlined text-xl">arrow_back</span>
          <span className="relative z-10">Return to Dashboard</span>
        </Link>
      )}
    </div>
  );
}
