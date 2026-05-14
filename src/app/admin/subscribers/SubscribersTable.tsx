"use client";

import { useState, useTransition } from "react";
import { deleteSubscriberAction, updateSubscriberStatusAction } from "../actions";

export type Subscriber = {
  id: string;
  email: string;
  source: string | null;
  variant: string | null;
  city: string | null;
  zip_code: string | null;
  status: string;
  drip_step: number | null;
  created_at: string;
};

const STATUSES = ["active", "unsubscribed", "bounced"] as const;

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  unsubscribed: "bg-gray-100 text-gray-600 border-gray-200",
  bounced: "bg-red-50 text-red-700 border-red-200",
};

export default function SubscribersTable({ subscribers }: { subscribers: Subscriber[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = subscribers.filter((s) => {
    if (filter !== "all" && s.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.email.toLowerCase().includes(q) ||
        (s.city ?? "").toLowerCase().includes(q) ||
        (s.zip_code ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <input
          type="search"
          placeholder="Search email, city, ZIP…"
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
            {subscribers.length === 0
              ? "No cheatsheet subscribers yet. The exit-intent popup will fill this list."
              : "No subscribers match the current filters."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-foreground/70 text-[12px] uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">When</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-center px-3 py-3">Page</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <Row key={s.id} subscriber={s} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-[12px] text-muted-foreground text-right">
        Total: {filtered.length}{filtered.length !== subscribers.length ? ` of ${subscribers.length}` : ""}
      </p>
    </div>
  );
}

function Row({ subscriber }: { subscriber: Subscriber }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function changeStatus(next: string) {
    setError(null);
    startTransition(async () => {
      const r = await updateSubscriberStatusAction(subscriber.id, next);
      if (r.error) setError(r.error);
    });
  }

  function deleteRow() {
    if (!confirm(`Delete subscriber ${subscriber.email}? This cannot be undone.`)) return;
    setError(null);
    startTransition(async () => {
      const r = await deleteSubscriberAction(subscriber.id);
      if (r.error) setError(r.error);
    });
  }

  const created = new Date(subscriber.created_at);
  const location = [subscriber.city, subscriber.zip_code].filter(Boolean).join(" · ");

  return (
    <tr className="border-t border-border hover:bg-secondary/30 transition">
      <td className="px-4 py-3 text-foreground/80 whitespace-nowrap">
        <div>{created.toLocaleDateString()}</div>
        <div className="text-[11px] text-muted-foreground">
          {created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </td>
      <td className="px-4 py-3 font-medium text-foreground">
        <a href={`mailto:${subscriber.email}`} className="hover:underline">{subscriber.email}</a>
      </td>
      <td className="px-4 py-3 text-foreground/80 text-[13px]">{location || "—"}</td>
      <td className="px-4 py-3 text-foreground/70 text-[13px]">{subscriber.source ?? "—"}</td>
      <td className="px-3 py-3 text-center">
        {subscriber.variant ? (
          <span
            className={
              "inline-flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-bold " +
              (subscriber.variant === "A"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : subscriber.variant === "B"
                ? "bg-purple-50 text-purple-700 border border-purple-200"
                : subscriber.variant === "C"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-gray-50 text-gray-600 border border-gray-200")
            }
            title={`From Variant ${subscriber.variant}`}
          >
            {subscriber.variant}
          </span>
        ) : (
          <span className="text-muted-foreground text-[12px]">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <select
          value={subscriber.status}
          onChange={(e) => changeStatus(e.target.value)}
          disabled={pending}
          className={`px-2.5 py-1 text-[12px] font-semibold rounded-full border outline-none transition disabled:opacity-50 ${
            statusStyles[subscriber.status] ?? "bg-gray-50 text-gray-700 border-gray-200"
          }`}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        {error && (
          <div className="mt-1 text-[11px] text-red-600">{error}</div>
        )}
      </td>
      <td className="px-4 py-3 text-right whitespace-nowrap">
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
  );
}
