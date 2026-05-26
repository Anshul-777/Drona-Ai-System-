"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";

const FlappyPanel = dynamic(() => import("@/components/games/FlappyPanel"), { ssr: false });

type Step = "credentials" | "otp" | "success";
type ExamTarget = "Class 10" | "Class 11" | "Class 12" | "JEE" | "NEET" | "CET";
type BoardType = "CBSE" | "ICSE" | "State Board" | "IB";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Jammu & Kashmir", "Ladakh", "Puducherry"
];

const BOARDS: BoardType[] = ["CBSE", "ICSE", "State Board", "IB"];
const CLASS_TARGETS: ExamTarget[] = ["Class 10", "Class 11", "Class 12"];

const CONFETTI_COLORS = ["#2a5cff", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#f97316", "#ec4899"];

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<Step>("credentials");

  // Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [examTarget, setExamTarget] = useState<ExamTarget | null>(null);
  const [studentState, setStudentState] = useState("");
  const [boardType, setBoardType] = useState<BoardType | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Errors
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [cpwErr, setCpwErr] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [formErr, setFormErr] = useState("");

  // Loading
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const confetti = useRef(
    Array.from({ length: 24 }, (_, i) => ({
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      left: `${5 + (i * 3.8) % 90}%`, delay: `${(i * 0.07).toFixed(2)}s`,
      w: `${4 + (i % 4) * 2}px`, h: `${7 + (i % 3) * 4}px`,
      rot: `${(i * 37) % 360}deg`, dur: `${0.9 + (i % 4) * 0.25}s`,
    }))
  );

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (step === "otp") {
      setTimeLeft(120);
      timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current!); return 0; } return t - 1; }), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  // Validators
  const vName = (v: string) => { setFullName(v); setNameErr(v.trim().length < 3 ? "At least 3 characters." : ""); };
  const vEmail = (v: string) => { setEmail(v); if (!v) return setEmailErr("Required."); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return setEmailErr("Invalid email."); setEmailErr(""); };
  const vPhone = (v: string) => { const d = v.replace(/\D/g, ""); setPhone(d); setPhoneErr(d.length !== 10 ? "Must be 10 digits." : ""); };
  const vPw = (v: string) => { setPassword(v); if (v.length < 8) return setPwErr("Min 8 characters."); if (!/[A-Z]/.test(v)||!/[a-z]/.test(v)||!/[0-9]/.test(v)||!/[!@#$%^&*(),.?":{}|<>]/.test(v)) return setPwErr("Needs A-Z, a-z, 0-9, symbol."); setPwErr(""); if (confirmPw && v !== confirmPw) setCpwErr("Doesn't match."); else setCpwErr(""); };
  const vCpw = (v: string) => { setConfirmPw(v); setCpwErr(v !== password ? "Doesn't match." : ""); };

  const handleOtpChange = (i: number, v: string) => {
    if (v.length > 1) return;
    const n = [...otp]; n[i] = v; setOtp(n); setOtpErr("");
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  // Google OAuth
  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  // Submit credentials → Supabase signUp
  const handleSignup = async () => {
    vName(fullName); vEmail(email); vPhone(phone); vPw(password); vCpw(confirmPw);
    if (!examTarget) { setFormErr("Select your exam target."); return; }
    if (!studentState) { setFormErr("Select your state."); return; }
    if (CLASS_TARGETS.includes(examTarget) && !boardType) { setFormErr("Select your board type."); return; }
    if (!acceptTerms) { setFormErr("You must accept the Terms & Conditions."); return; }
    setFormErr("");
    if (nameErr || emailErr || phoneErr || pwErr || cpwErr || !fullName || !email || !password || !confirmPw) return;

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, exam_target: examTarget, state: studentState, board_type: boardType || "N/A" },
      },
    });
    setLoading(false);
    if (error) { setFormErr(error.message); return; }
    setStep("otp");
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) { setOtpErr("Enter the full 6-digit code."); return; }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    setLoading(false);
    if (error) { setOtpErr(error.message); return; }
    setStep("success");
    setTimeout(() => router.push("/begin"), 2500);
  };

  const handleResend = async () => {
    setOtp(["","","","","",""]); setOtpErr("");
    setLoading(true);
    await supabase.auth.resend({ type: "signup", email });
    setLoading(false);
    setTimeLeft(120);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current!); return 0; } return t - 1; }), 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "otp") handleVerifyOtp();
    else handleSignup();
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const exams: ExamTarget[] = ["Class 10", "Class 11", "Class 12", "JEE", "NEET", "CET"];

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen w-full bg-surface-container-lowest text-on-surface font-body antialiased relative">
      {/* Close Button */}
      <Link href="/" className="fixed top-6 right-6 lg:top-8 lg:right-8 z-50 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low p-2 rounded-full transition-colors flex items-center justify-center">
        <span className="material-symbols-outlined text-2xl">close</span>
      </Link>

      {/* Left: Game */}
      <div className="hidden lg:flex lg:w-[50%] h-full sticky top-0 h-screen">
        <FlappyPanel />
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-[50%] flex flex-col min-h-screen bg-surface-container-lowest overflow-y-auto py-12">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-24 max-w-2xl mx-auto w-full">

          <div className="block lg:hidden mb-4">
            <Logo />
          </div>

          {step === "credentials" && (
            <div className="animate-[fadeSlideUp_0.5s_ease] space-y-8">
              <div>
                <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-2">
                  Begin your <span className="text-primary italic">journey.</span>
                </h1>
                <p className="text-on-surface-variant text-base">Create your scholar profile to start.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors" htmlFor="su-name">Full Name</label>
                    <input type="text" id="su-name" required placeholder="Your name" value={fullName} onChange={e => vName(e.target.value)}
                      className={`block w-full border-0 border-b bg-transparent py-2.5 px-0 text-on-surface placeholder:text-outline/50 focus:ring-0 text-base outline-none transition-colors ${nameErr ? "border-error" : "border-outline-variant focus:border-primary"}`} />
                    {nameErr && <p className="text-xs text-error mt-1">{nameErr}</p>}
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors" htmlFor="su-email">Email</label>
                    <input type="email" id="su-email" required placeholder="you@example.com" value={email} onChange={e => vEmail(e.target.value)}
                      className={`block w-full border-0 border-b bg-transparent py-2.5 px-0 text-on-surface placeholder:text-outline/50 focus:ring-0 text-base outline-none transition-colors ${emailErr ? "border-error" : "border-outline-variant focus:border-primary"}`} />
                    {emailErr && <p className="text-xs text-error mt-1">{emailErr}</p>}
                  </div>
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors" htmlFor="su-phone">Mobile Number</label>
                  <input type="tel" id="su-phone" required placeholder="10-digit number" value={phone} onChange={e => vPhone(e.target.value)}
                    className={`block w-full border-0 border-b bg-transparent py-2.5 px-0 text-on-surface placeholder:text-outline/50 focus:ring-0 text-base outline-none transition-colors ${phoneErr ? "border-error" : "border-outline-variant focus:border-primary"}`} />
                  {phoneErr && <p className="text-xs text-error mt-1">{phoneErr}</p>}
                </div>

                {/* Password row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors" htmlFor="su-pw">Password</label>
                    <div className="relative">
                      <input type={showPw ? "text" : "password"} id="su-pw" required placeholder="••••••••" value={password} onChange={e => vPw(e.target.value)}
                        className={`block w-full border-0 border-b bg-transparent py-2.5 px-0 pr-7 text-on-surface placeholder:text-outline/50 focus:ring-0 text-base outline-none transition-colors ${pwErr ? "border-error" : "border-outline-variant focus:border-primary"}`} />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">{showPw ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                    {pwErr && <p className="text-xs text-error mt-1">{pwErr}</p>}
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors" htmlFor="su-cpw">Confirm Password</label>
                    <input type="password" id="su-cpw" required placeholder="••••••••" value={confirmPw} onChange={e => vCpw(e.target.value)}
                      className={`block w-full border-0 border-b bg-transparent py-2.5 px-0 text-on-surface placeholder:text-outline/50 focus:ring-0 text-base outline-none transition-colors ${cpwErr ? "border-error" : "border-outline-variant focus:border-primary"}`} />
                    {cpwErr && <p className="text-xs text-error mt-1">{cpwErr}</p>}
                  </div>
                </div>

                {/* Exam Target */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Exam Target</label>
                  <div className="grid grid-cols-3 gap-2">
                    {exams.map(ex => (
                      <button key={ex} type="button" onClick={() => { setExamTarget(ex); setFormErr(""); }}
                        className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${examTarget === ex ? "bg-primary text-on-primary border-primary shadow-md" : "bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container"}`}>
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                {/* State */}
                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors" htmlFor="su-state">State</label>
                  <select id="su-state" required value={studentState} onChange={e => { setStudentState(e.target.value); setFormErr(""); }}
                    className={`block w-full border-0 border-b bg-transparent py-2.5 px-0 text-on-surface focus:ring-0 text-base outline-none transition-colors cursor-pointer appearance-none ${!studentState ? "text-outline/50" : ""} ${formErr && !studentState ? "border-error" : "border-outline-variant focus:border-primary"}`}>
                    <option value="" disabled>Select your state</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Board Type — only for Class 10/11/12 */}
                {examTarget && CLASS_TARGETS.includes(examTarget) && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Board Type</label>
                    <div className="grid grid-cols-4 gap-2">
                      {BOARDS.map(b => (
                        <button key={b} type="button" onClick={() => { setBoardType(b); setFormErr(""); }}
                          className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${boardType === b ? "bg-primary text-on-primary border-primary shadow-md" : "bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container"}`}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {formErr && <p className="text-xs text-error mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{formErr}</p>}

                {/* Terms Checkbox */}
                <label className="flex items-start gap-3 mt-6 mb-2 cursor-pointer group">
                  <div className="pt-0.5">
                    <input type="checkbox" required checked={acceptTerms} onChange={e => { setAcceptTerms(e.target.checked); setFormErr(""); }} className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 transition-colors cursor-pointer" />
                  </div>
                  <span className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors leading-relaxed">
                    I agree to the <Link href="/terms" className="font-bold text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="font-bold text-primary hover:underline">Privacy Policy</Link>.
                  </span>
                </label>

                {/* Submit */}
                <button disabled={loading} type="submit"
                  className="w-full flex justify-center items-center gap-2 bg-primary text-on-primary py-3 mt-6 rounded-xl font-bold text-sm shadow hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50">
                  {loading ? <><span className="material-symbols-outlined text-[16px] animate-spin">sync</span>Creating Account...</> : "Create Account"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/40" /></div>
                <div className="relative flex justify-center"><span className="px-3 bg-surface-container-lowest text-xs font-bold text-outline tracking-wider uppercase">or</span></div>
              </div>

              {/* Google */}
              <button onClick={handleGoogle} type="button"
                className="flex items-center justify-center gap-3 w-full px-4 py-3 border border-outline-variant/50 rounded-xl bg-transparent text-on-surface font-bold text-sm hover:bg-surface-container-low active:scale-[0.99] transition-all cursor-pointer">
                <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09a6.97 6.97 0 010-4.18V7.07H2.18A11 11 0 001 12c0 1.78.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign up with Google
              </button>

              <p className="text-center text-base text-on-surface-variant">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-primary hover:underline underline-offset-4">Sign in</Link>
              </p>
            </div>
          )}

          {step === "otp" && (
            <div className="animate-[fadeSlideUp_0.5s_ease] space-y-6">
              <div>
                <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight mb-2">Verify your email</h1>
                <p className="text-on-surface-variant text-base">We sent a 6-digit code to <strong className="text-on-surface">{email}</strong></p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-start gap-3">
                  {otp.map((d, i) => (
                    <input key={i} ref={el => { otpRefs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKey(i, e)}
                      className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl bg-surface-container-low outline-none transition-all ${otpErr ? "border-error text-error" : "border-outline-variant focus:border-primary"}`} />
                  ))}
                </div>
                {otpErr && <p className="text-sm text-error flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">error</span>{otpErr}</p>}
                <button disabled={loading} type="submit" className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-sm shadow hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-2">
                  {loading ? "Verifying..." : "Verify & Create Account"}
                </button>
              </form>
              <div className="text-sm text-on-surface-variant pt-2">
                {timeLeft > 0 ? <span>Resend in <strong className="text-on-surface tabular-nums">{fmtTime(timeLeft)}</strong></span> : <button onClick={handleResend} className="text-primary font-bold hover:underline cursor-pointer">Resend Code</button>}
              </div>
              <button onClick={() => { setStep("credentials"); setOtp(["","","","","",""]); setOtpErr(""); }} className="text-sm font-bold text-on-surface-variant hover:text-on-surface flex items-center gap-2 cursor-pointer mt-2 w-fit">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>Back
              </button>
            </div>
          )}

          {step === "success" && (
            <div className="text-center animate-[fadeSlideUp_0.5s_ease] relative overflow-hidden py-8">
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {confetti.current.map((c, i) => (
                  <div key={i} className="absolute top-0 animate-[confettiFall_forwards]" style={{ left: c.left, animationDelay: c.delay, animationDuration: c.dur }}>
                    <div style={{ width: c.w, height: c.h, backgroundColor: c.color, transform: `rotate(${c.rot})`, borderRadius: "2px" }} />
                  </div>
                ))}
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 animate-[scaleIn_0.4s_ease]">
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">Account created!</h2>
                <p className="text-on-surface-variant text-sm mb-6">Setting up your workspace...</p>
                <div className="flex justify-center gap-1">
                  {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes confettiFall { 0% { transform: translateY(-20px); opacity: 1; } 100% { transform: translateY(400px) rotate(720deg); opacity: 0; } }
      `}</style>
    </div>
  );
}
