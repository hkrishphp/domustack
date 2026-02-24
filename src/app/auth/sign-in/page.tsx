import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export const metadata = {
  title: "Sign In - Domustack",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-lg text-foreground w-fit"
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#d4704b" />
            <path
              d="M12 5L4 11V19C4 19.5 4.5 20 5 20H9V15H15V20H19C19.5 20 20 19.5 20 19V11L12 5Z"
              fill="white"
            />
          </svg>
          Domustack
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <Suspense>
            <AuthForm mode="sign-in" />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
