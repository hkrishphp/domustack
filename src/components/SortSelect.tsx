"use client";

import { useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "reviews_count", label: "Most Reviews" },
  { value: "projects_count", label: "Most Projects" },
];

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "rating";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      className="px-3 py-2 text-sm bg-card border border-border rounded-[var(--radius)] text-foreground cursor-pointer outline-none"
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
