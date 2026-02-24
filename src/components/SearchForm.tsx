"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchAutocomplete from "@/components/SearchAutocomplete";

export default function SearchForm({
  initialService = "",
  initialLocation = "",
}: {
  initialService?: string;
  initialLocation?: string;
}) {
  const router = useRouter();
  const [service, setService] = useState(initialService);
  const [location, setLocation] = useState(initialLocation);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (service.trim()) params.set("service", service.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <SearchAutocomplete
        value={service}
        onChange={setService}
        placeholder="What needs renovation?"
        type="service"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        }
      />
      <SearchAutocomplete
        value={location}
        onChange={setLocation}
        placeholder="City or ZIP code"
        type="location"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        }
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius)] text-[15px] font-medium hover:opacity-90 active:scale-[0.98] transition"
      >
        Search
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>
    </form>
  );
}
