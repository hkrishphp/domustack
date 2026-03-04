"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

type UserInfo = { full_name: string; email: string; avatar_url: string | null };

const navItems = [
  { href: "/search", label: "Find Contractors" },
  { href: "/projects/browse", label: "Browse Projects" },
  { href: "/inspirations", label: "Inspirations" },
  { href: "/shop", label: "Shop" },
  { href: "/projects", label: "My Projects" },
  { href: "/messages", label: "Messages" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function loadUser(userId: string) {
      const { data } = await supabase
        .from("users")
        .select("full_name, email, avatar_url")
        .eq("id", userId)
        .single();
      if (data) {
        setUser(data);
        setIsLoggedIn(true);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUser(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUser(session.user.id);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  const visibleNavItems = navItems.filter(
    (item) => (item.href !== "/messages" && item.href !== "/projects") || isLoggedIn
  );

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-[1280px] px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-primary tracking-tight">
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#1e3a5f" />
            <path d="M12 5L4 11V19C4 19.5 4.5 20 5 20H9V15H15V20H19C19.5 20 20 19.5 20 19V11L12 5Z" fill="white" />
          </svg>
          <span>Domustack</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-white"
                    : "text-foreground hover:text-accent hover:bg-accent/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        {!isLoggedIn ? (
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://kontraio.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              For Contractors
            </a>
            <Link
              href="/auth/sign-in"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-accent rounded-lg hover:brightness-110 active:scale-[0.98] transition shadow-sm"
            >
              Get Started Free
            </Link>
          </div>
        ) : (
          <div ref={dropdownRef} className="hidden lg:flex items-center relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted transition"
            >
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                {user?.full_name || "User"}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-border py-1.5 z-50">
                <div className="px-4 py-2.5 border-b border-border">
                  <p className="text-sm font-semibold truncate">{user?.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted transition rounded-b-xl"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-foreground p-2"
          aria-label="Menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white px-6 pb-5">
          <nav className="flex flex-col gap-1 py-3">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-white"
                      : "text-foreground hover:text-accent hover:bg-accent/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {!isLoggedIn ? (
            <div className="flex flex-col gap-2.5 pt-3 border-t border-border">
              <Link
                href="/auth/sign-up"
                onClick={() => setMobileOpen(false)}
                className="text-center py-3 text-[15px] font-semibold text-white bg-accent rounded-lg"
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/sign-in"
                onClick={() => setMobileOpen(false)}
                className="text-center py-3 text-[15px] font-medium text-foreground border border-border rounded-lg"
              >
                Sign In
              </Link>
              <a
                href="https://kontraio.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 text-sm text-muted-foreground"
              >
                Are you a contractor?
              </a>
            </div>
          ) : (
            <div className="pt-3 border-t border-border">
              <div className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
