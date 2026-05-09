import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/projects", "/messages"];

// ─── Homepage A/B/C bucketing ────────────────────────────────────────────────
const VARIANT_COOKIE = "ds_homepage_variant";
const VARIANTS = ["A", "B", "C"] as const;
type Variant = (typeof VARIANTS)[number];

function pickVariant(): Variant {
  // Equal 33/33/34 split. Swap to weighted (e.g., [A,A,B,C]) if you want
  // to bias toward the control while early in the test.
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
}

function isVariant(v: string | undefined): v is Variant {
  return Boolean(v) && (VARIANTS as readonly string[]).includes(v as string);
}

export async function middleware(request: NextRequest) {
  // ── Homepage A/B/C bucketing (runs before anything else) ────────────────
  if (request.nextUrl.pathname === "/") {
    // 1) Manual override via ?v= — for QA / stakeholder previews.
    //    Doesn't write the cookie, so users keep their assigned bucket.
    const override = request.nextUrl.searchParams.get("v")?.toUpperCase();
    if (isVariant(override)) {
      return NextResponse.next();
    }

    // 2) Returning visitor — read cookie and rewrite to /?v=<variant>.
    //    Rewrite (not redirect) keeps the URL bar clean: still shows /.
    const cookieValue = request.cookies.get(VARIANT_COOKIE)?.value?.toUpperCase();
    if (isVariant(cookieValue)) {
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
