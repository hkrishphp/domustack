import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/projects", "/messages"];

// ─── Homepage A/C bucketing ──────────────────────────────────────────────────
// Variant B was paused — only A and C rotate to real visitors. Manual override
// via ?v=B still works for QA (allowed below).
const VARIANT_COOKIE = "ds_homepage_variant";
const ACTIVE_VARIANTS = ["A", "C"] as const;
const ALL_VARIANTS    = ["A", "B", "C"] as const; // override-allowed via ?v=
type Variant = (typeof ALL_VARIANTS)[number];

function pickVariant(): Variant {
  // 50/50 between A and C while B is paused.
  return ACTIVE_VARIANTS[Math.floor(Math.random() * ACTIVE_VARIANTS.length)];
}

function isActive(v: string | undefined): v is "A" | "C" {
  return Boolean(v) && (ACTIVE_VARIANTS as readonly string[]).includes(v as string);
}

function isAnyVariant(v: string | undefined): v is Variant {
  return Boolean(v) && (ALL_VARIANTS as readonly string[]).includes(v as string);
}

export async function middleware(request: NextRequest) {
  // ── Homepage A/B/C bucketing (runs before anything else) ────────────────
  if (request.nextUrl.pathname === "/") {
    // 1) Manual override via ?v= — for QA / stakeholder previews. Allows
    //    A | B | C even though B isn't in the live rotation. Doesn't write
    //    the cookie, so users keep their assigned bucket.
    const override = request.nextUrl.searchParams.get("v")?.toUpperCase();
    if (isAnyVariant(override)) {
      return NextResponse.next();
    }

    // 2) Returning visitor — read cookie and rewrite to /?v=<variant>.
    //    If their cookie is "B" (from before B was paused), re-bucket them
    //    into A or C so they don't keep seeing the paused variant.
    const cookieValue = request.cookies.get(VARIANT_COOKIE)?.value?.toUpperCase();
    if (isActive(cookieValue)) {
      const url = request.nextUrl.clone();
      url.searchParams.set("v", cookieValue);
      return NextResponse.rewrite(url);
    }

    // 3) New visitor — assign randomly, set cookie, rewrite.
    const assigned = pickVariant();
    const url = request.nextUrl.clone();
    url.searchParams.set("v", assigned);
    const response = NextResponse.rewrite(url);
    response.cookies.set({
      name: VARIANT_COOKIE,
      value: assigned,
      maxAge: 60 * 60 * 24 * 90, // 90 days
      sameSite: "lax",
      path: "/",
    });
    return response;
  }

  // ── Existing logic below: Supabase auth + route protection ──────────────

  // If a ?code= param lands on a non-callback route, redirect to /auth/callback
  // This handles cases where Supabase falls back to Site URL instead of redirectTo
  const code = request.nextUrl.searchParams.get("code");
  if (code && !request.nextUrl.pathname.startsWith("/auth/callback")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    url.searchParams.set("code", code);
    return NextResponse.redirect(url);
  }

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Allow callback route through even if user exists (needed for OAuth flow)
  if (user && request.nextUrl.pathname.startsWith("/auth/") && !request.nextUrl.pathname.startsWith("/auth/callback")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
