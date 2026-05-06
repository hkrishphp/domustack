"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateStatusAction, deleteInquiryAction } from "./actions";

export type Inquiry = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  project_type: string;
  description: string;
  budget_range: string;
  inspiration_images: string[];
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const STATUSES = ["new", "contacted", "converted", "closed", "spam"] as const;

const statusStyles: Record<string, string> = {
  new: "bg-accent/10 text-accent border-accent/30",
  contacted: "bg-blue-50 text-blue-700 border-blue-200",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
  spam: "bg-red-50 text-red-700 border-red-200",
};

export default function InquiriesTable({ inquiries }: { inquiries: Inquiry[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = inquiries.filter((i) => {
    if (filter !== "all" && i.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        i.full_name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.phone.toLowerCase().includes(q) ||
        i.project_type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <input
          type="search"
          placeholder="Search name, email, phone, project type…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-white border border-border rounded-lg text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-border rounded-lg text-[14px] text-foreground focus:outline-none focus:border-primary"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">
            {inquiries.length === 0
              ? "No project inquiries yet. Submissions from the homepage form will appear here."
              : "No inquiries match the current filters."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-foreground/70 text-[12px] uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">When</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Contact</th>
                <th className="text-left px-4 py-3">Project</th>
                <th className="text-left px-4 py-3">Budget</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <Row
                  key={i.id}
                  inquiry={i}
                  expanded={expanded === i.id}
                  onToggle={() => setExpanded(expanded === i.id ? null : i.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({
  inquiry,
  expanded,
  onToggle,
}: {
  inquiry: Inquiry;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function changeStatus(next: string) {
    setError(null);
    startTransition(async () => {
      const r = await updateStatusAction(inquiry.id, next);
      if (r.error) setError(r.error);
    });
  }

  function deleteRow() {
    if (!confirm(`Delete inquiry from ${inquiry.full_name}? This cannot be undone.`)) return;
    setError(null);
    startTransition(async () => {
      const r = await deleteInquiryAction(inquiry.id);
      if (r.error) setError(r.error);
    });
  }

  const created = new Date(inquiry.created_at);

  return (
    <>
      <tr className="border-t border-border hover:bg-secondary/30 transition">
        <td className="px-4 py-3 text-foreground/80 whitespace-nowrap">
          <div>{created.toLocaleDateString()}</div>
          <div className="text-[11px] text-muted-foreground">
            {created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </td>
        <td className="px-4 py-3 font-medium text-foreground">{inquiry.full_name}</td>
        <td className="px-4 py-3 text-foreground/80">
          <div>
            <a href={`mailto:${inquiry.email}`} className="hover:underline">
              {inquiry.email}
            </a>
          </div>
          <div className="text-[12px] text-muted-foreground">
            <a href={`tel:${inquiry.phone}`} className="hover:underline">
              {inquiry.phone}
            </a>
          </div>
        </td>
        <td className="px-4 py-3 text-foreground/80">{inquiry.project_type}</td>
        <td className="px-4 py-3 text-foreground/80 whitespace-nowrap">{inquiry.budget_range}</td>
        <td className="px-4 py-3">
          <select
            value={inquiry.status}
            onChange={(e) => changeStatus(e.target.value)}
            disabled={pending}
            className={`px-2.5 py-1 text-[12px] font-semibold rounded-full border outline-none transition disabled:opacity-50 ${
              statusStyles[inquiry.status] ?? "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </td>
        <td className="px-4 py-3 text-right whitespace-nowrap">
          <button
            type="button"
            onClick={onToggle}
            className="text-[13px] text-primary hover:underline mr-3"
          >
            {expanded ? "Hide" : "Details"}
          </button>
          <button
            type="button"
            onClick={deleteRow}
            disabled={pending}
            className="text-[13px] text-red-600 hover:underline disabled:opacity-50"
          >
            Delete
          </button>
        </td>
      </tr>

      {expanded && (
        <tr className="border-t border-border bg-secondary/20">
          <td colSpan={7} className="px-4 py-5">
            {error && (
              <div className="mb-4 px-3 py-2 rounded border border-red-200 bg-red-50 text-red-800 text-[13px]">
                {error}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[12px] font-semibold tracking-wider uppercase text-muted-foreground mb-2">
                  Description
                </h3>
                <p className="text-foreground/85 text-[14px] leading-relaxed whitespace-pre-wrap">
                  {inquiry.description}
                </p>
              </div>

              <div>
                <h3 className="text-[12px] font-semibold tracking-wider uppercase text-muted-foreground mb-2">
                  Inspiration images ({inquiry.inspiration_images.length})
                </h3>
                {inquiry.inspiration_images.length === 0 ? (
                  <p className="text-muted-foreground text-[13px]">None uploaded.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {inquiry.inspiration_images.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block aspect-square rounded-lg overflow-hidden border border-border hover:opacity-80 transition"
                      >
                        <Image
                          src={url}
                          alt="Inspiration"
                          fill
                          className="object-cover"
                          sizes="120px"
                          unoptimized
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
