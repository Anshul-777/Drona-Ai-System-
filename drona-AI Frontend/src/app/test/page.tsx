"use client";

import { useRouter } from "next/navigation";

export default function TestPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn w-full px-4 py-16">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_24px_80px_rgba(0,0,0,0.07)] border border-outline-variant/20 max-w-2xl w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-4xl">quiz</span>
        </div>
        <h1 className="font-display text-3xl font-black text-on-surface tracking-tight mb-4">
          Final Assessment Test
        </h1>
        <p className="font-body text-on-surface-variant text-base mb-8">
          This page will contain your customized final test based on your psychological and academic profile.
          (To be implemented)
        </p>
        <button
          onClick={() => router.push("/platform")}
          className="bg-primary text-white font-semibold py-3 px-8 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
