import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth Callback Route Handler
 *
 * Supabase redirects here after:
 * - Google OAuth consent
 * - Email OTP / magic link verification
 *
 * Exchanges the auth code for a session, then redirects to /begin.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/success";

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && user) {
      // Determine if it's a brand new user (created within the last 10 seconds)
      const isNewUser = new Date(user.last_sign_in_at!).getTime() - new Date(user.created_at).getTime() < 10000;
      
      // If the URL provided a specific 'next' param, use it.
      // Otherwise, auto-route new users to /begin and returning users to /success
      const defaultRoute = isNewUser ? "/begin" : "/success";
      const finalNext = searchParams.get("next") || defaultRoute;
      
      return NextResponse.redirect(`${origin}${finalNext}`);
    }
  }

  // If no code or exchange failed, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
