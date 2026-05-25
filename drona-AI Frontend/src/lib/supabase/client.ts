import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for browser (client component) usage.
 *
 * Uses the anon key — never use service_role in browser code.
 * This client handles session persistence automatically via cookies
 * when used with @supabase/ssr.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
