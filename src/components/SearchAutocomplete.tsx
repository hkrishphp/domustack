"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: ReactNode;
  type: "service" | "location";
};

export default function SearchAutocomplete({ value, onChange, placeholder, icon, type }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const supabaseRef = useRef(createBrowserSupabaseClient());

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = value.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const supabase = supabaseRef.current;
      const results: string[] = [];

      if (type === "service") {
        // Search contractor names
        const { data: nameMatches } = await supabase
          .from("contractors")
          .select("name")
          .ilike("name", `%${query}%`)
          .limit(5);
        if (nameMatches) results.push(...nameMatches.map((r) => r.name));

        // Search specialties
        const { data: specMatches } = await supabase
          .from("contractors")
          .select("specialty")
          .ilike("specialty", `%${query}%`)
          .limit(5);
        if (specMatches) results.push(...specMatches.map((r) => r.specialty));

        // Search service names
        const { data: svcMatches } = await supabase
          .from("contractor_services")
          .select("service_name")
          .ilike("service_name", `%${query}%`)
          .limit(5);
        if (svcMatches) results.push(...svcMatches.map((r) => r.service_name));
      } else {
        // Search locations
        const { data: locMatches } = await supabase
          .from("contractors")
          .select("location")
          .ilike("location", `%${query}%`)
          .limit(10);
        if (locMatches) results.push(...locMatches.map((r) => r.location));
      }

      // Deduplicate and limit
      const unique = [...new Set(results)].slice(0, 5);
      setSuggestions(unique);
      setOpen(unique.length > 0);
      setActiveIndex(-1);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, type]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectSuggestion(s: string) {
    onChange(s);
    setOpen(false);
    setSuggestions([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-background rounded-lg border border-border">
        {icon}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full text-sm text-foreground bg-transparent placeholder:text-muted-foreground border-none outline-none"
          autoComplete="off"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-card rounded-[var(--radius)] border border-border shadow-[0_8px_30px_rgba(0,0,0,0.1)] overflow-hidden">
          {suggestions.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={() => selectSuggestion(s)}
                className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                  i === activeIndex
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
