import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OTP Route — uses Supabase Auth's built-in email OTP.
 *
 * POST actions:
 * - { action: "send", email } → Sends OTP via Supabase (signInWithOtp)
 * - { action: "verify", email, otp } → Verifies OTP via Supabase (verifyOtp)
 * - { action: "signup", email, password, fullName, phone, examTarget }
 *     → Creates account with Supabase (signUp with password + metadata)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, otp, password, fullName, phone, examTarget } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const supabase = await createClient();

    // ── SIGNUP (with password) ────────────────────────────────────────────────
    if (action === "signup") {
      if (!password || password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || "",
            phone: phone || "",
            exam_target: examTarget || "",
          },
          emailRedirectTo: `${getBaseUrl(req)}/auth/callback`,
        },
      });

      if (error) {
        console.error("[DRONA Auth] Signup error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Supabase sends confirmation email automatically when email confirmation is enabled
      return NextResponse.json({
        success: true,
        message: `Verification email sent to ${email}. Check your inbox.`,
        needsConfirmation: !data.session, // true if email confirmation is required
      });
    }

    // ── SEND OTP (passwordless sign-in) ──────────────────────────────────────
    if (action === "send") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Don't create account — login only
          emailRedirectTo: `${getBaseUrl(req)}/auth/callback`,
        },
      });

      if (error) {
        console.error("[DRONA Auth] OTP send error:", error.message);
        // Supabase returns "Signups not allowed for otp" if user doesn't exist
        if (error.message.includes("not allowed") || error.message.includes("not found")) {
          return NextResponse.json(
            { error: "No account found with this email. Please sign up first." },
            { status: 400 }
          );
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${email}. Check your inbox (and spam folder).`,
      });
    }

    // ── VERIFY OTP ───────────────────────────────────────────────────────────
    if (action === "verify") {
      if (!otp) {
        return NextResponse.json({ error: "Verification code is required." }, { status: 400 });
      }

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: String(otp).trim(),
        type: "email",
      });

      if (error) {
        console.error("[DRONA Auth] OTP verify error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: "Identity verified successfully.",
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.full_name,
            }
          : null,
      });
    }

    // ── LOGIN (with password) ────────────────────────────────────────────────
    if (action === "login") {
      if (!password) {
        return NextResponse.json({ error: "Password is required." }, { status: 400 });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("[DRONA Auth] Login error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: "Signed in successfully.",
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.full_name,
            }
          : null,
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err) {
    console.error("[DRONA Auth] Server error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}

/** Extract base URL from the incoming request */
function getBaseUrl(req: Request): string {
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}
