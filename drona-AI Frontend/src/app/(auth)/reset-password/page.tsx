"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [cpwErr, setCpwErr] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validatePw = (v: string) => { 
    setPassword(v); 
    if (v.length < 8) return setPwErr("Min 8 characters."); 
    if (!/[A-Z]/.test(v)||!/[a-z]/.test(v)||!/[0-9]/.test(v)||!/[!@#$%^&*(),.?":{}|<>]/.test(v)) return setPwErr("Needs A-Z, a-z, 0-9, symbol."); 
    setPwErr(""); 
    if (confirmPw && v !== confirmPw) setCpwErr("Doesn't match."); 
    else setCpwErr(""); 
  };
  
  const validateCpw = (v: string) => { 
    setConfirmPw(v); 
    setCpwErr(v !== password ? "Doesn't match." : ""); 
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    validatePw(password);
    validateCpw(confirmPw);
    if (pwErr || cpwErr || !password || !confirmPw) return;

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setPwErr(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/success");
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen w-full bg-surface-container-lowest text-on-surface font-body antialiased relative">
      {/* Close Button */}
      <Link href="/login" className="fixed top-6 right-6 lg:top-8 lg:right-8 z-50 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low p-2 rounded-full transition-colors flex items-center justify-center">
        <span className="material-symbols-outlined text-2xl">close</span>
      </Link>

      <div className="w-full flex flex-col justify-center items-center px-8 sm:px-14 py-12 max-w-lg mx-auto">
        <div className="w-full animate-[fadeSlideUp_0.5s_ease] space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block font-display font-black text-2xl tracking-tighter text-primary mb-8">DRONA.AI</Link>
            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Create new password</h1>
            <p className="text-on-surface-variant text-base">Your new password must be different from previous used passwords.</p>
          </div>

          {!success ? (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              {/* Password */}
              <div className="group">
                <label className="block text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors" htmlFor="reset-pw">New Password</label>
                <input type="password" id="reset-pw" required placeholder="••••••••" value={password} onChange={e => validatePw(e.target.value)}
                  className={`block w-full border-0 border-b bg-transparent py-3 px-0 text-on-surface placeholder:text-outline/50 focus:ring-0 text-base outline-none transition-colors ${pwErr ? "border-error" : "border-outline-variant focus:border-primary"}`} />
                {pwErr && <p className="text-xs text-error mt-1.5 flex items-center gap-1"><span className="material-symbols-outlined text-[15px]">error</span>{pwErr}</p>}
              </div>

              {/* Confirm Password */}
              <div className="group">
                <label className="block text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors" htmlFor="reset-cpw">Confirm Password</label>
                <input type="password" id="reset-cpw" required placeholder="••••••••" value={confirmPw} onChange={e => validateCpw(e.target.value)}
                  className={`block w-full border-0 border-b bg-transparent py-3 px-0 text-on-surface placeholder:text-outline/50 focus:ring-0 text-base outline-none transition-colors ${cpwErr ? "border-error" : "border-outline-variant focus:border-primary"}`} />
                {cpwErr && <p className="text-xs text-error mt-1.5 flex items-center gap-1"><span className="material-symbols-outlined text-[15px]">error</span>{cpwErr}</p>}
              </div>

              <button disabled={loading} type="submit" className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-sm shadow hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-4">
                {loading ? "Saving..." : "Save new password"}
              </button>
            </form>
          ) : (
            <div className="text-center animate-[fadeSlideUp_0.5s_ease] bg-surface-container-low p-8 rounded-3xl">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 animate-[scaleIn_0.4s_ease]">
                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Password Reset!</h2>
              <p className="text-on-surface-variant text-sm mb-0">Your password has been successfully updated. Routing you to your dashboard...</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
      `}</style>
    </div>
  );
}
