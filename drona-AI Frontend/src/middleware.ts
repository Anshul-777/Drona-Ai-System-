import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware: Refreshes expired Supabase auth sessions on every request.
 *
 * Without this, Server Components cannot read the user's session
 * because cookies are only updated in Route Handlers or Server Actions.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getSession() for middleware to keep Next.js routing fast.
  // It decodes the JWT cookie locally rather than making a network request.
  // For secure data mutations (Server Actions/APIs), we will use getUser() there instead.
  const { data: { session }, error } = await supabase.auth.getSession();
  const user = session?.user;

  // Define protected routes that require a valid session
  const protectedPrefixes = [
    '/platform', '/dock', '/settings', '/test', '/game', 
    '/workspace', '/career', '/resources', '/achievements', 
    '/agent', '/drona', '/kb', '/notifications', '/planner', 
    '/profile', '/progress', '/shop', '/stats'
  ];

  const isProtectedRoute = protectedPrefixes.some(prefix => 
    request.nextUrl.pathname.startsWith(prefix)
  );

  // If the route is protected and the user is NOT logged in, kick them back to landing.
  if (isProtectedRoute && (!user || error)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the route is protected and the user IS logged in, tell the browser NEVER to cache it.
  // This physically prevents the "Back" button from showing a cached dashboard after logout.
  if (isProtectedRoute) {
    supabaseResponse.headers.set('x-middleware-cache', 'no-cache');
    supabaseResponse.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
