"use client";

import { useState, useTransition } from "react";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await loginAction(formData);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form
      action={handleSubmit}
      className="bg-white border border-border rounded-2xl p-6 shadow-[0_8px_30px_rgba(15,41,64,0.06)]"
    >
      <label className="block mb-4">
        <span className="block text-[13px] font-semibold text-foreground mb-1.5">Password</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
          placeholder="••••••••"
        />
      </label>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg text-[15px] font-semibold hover:bg-primary/90 transition disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
