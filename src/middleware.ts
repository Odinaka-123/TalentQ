import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 min
const LAST_ACTIVITY_COOKIE = "last_activity";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

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
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOnboardingRoute = request.nextUrl.pathname.startsWith("/onboarding");
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/employer");
  const isGatedRoute = isProtectedRoute || isOnboardingRoute;

  // No user at all — block both onboarding and dashboard routes
  if (!user && isGatedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user) {
    // Enforce inactivity timeout on gated routes only. A stale
    // last_activity cookie beyond the threshold forces re-auth.
    if (isGatedRoute) {
      const lastActivityRaw = request.cookies.get(LAST_ACTIVITY_COOKIE)?.value;
      const now = Date.now();

      if (lastActivityRaw) {
        const lastActivity = parseInt(lastActivityRaw, 10);
        if (!Number.isNaN(lastActivity) && now - lastActivity > SESSION_TIMEOUT_MS) {
          await supabase.auth.signOut({ scope: "global" });
          const redirectUrl = new URL("/login?sessionExpired=1", request.url);
          const redirectRes = NextResponse.redirect(redirectUrl);
          redirectRes.cookies.delete(LAST_ACTIVITY_COOKIE);
          return redirectRes;
        }
      }

      response.cookies.set(LAST_ACTIVITY_COOKIE, now.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    if (!profile?.onboarding_completed && isProtectedRoute) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (profile?.onboarding_completed && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
