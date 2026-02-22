"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSection() {
  const router = useRouter();
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (service.trim()) params.set("service", service.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/search?${params.toString()}`);
  }

  return (
    <section className="py-[60px] pb-20">
      <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
        {/* Content */}
        <div>
          <h1 className="text-[32px] lg:text-[48px] font-medium leading-[1.15] text-foreground mb-4">
            Transform Your Home Into Your Dream Space
          </h1>
          <p className="text-base text-muted-foreground leading-[1.7] mb-8 max-w-[480px]">
            Connect with trusted general contractors across the US. Manage projects, payments, and communication all in one inspiring platform.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSubmit} className="bg-card rounded-[var(--radius)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] mb-8">
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-background rounded-lg border border-border">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="What needs renovation?"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full text-sm text-foreground bg-transparent placeholder:text-muted-foreground border-none outline-none"
                />
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-background rounded-lg border border-border">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  type="text"
                  placeholder="City or ZIP code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-sm text-foreground bg-transparent placeholder:text-muted-foreground border-none outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-[var(--radius)] text-[15px] font-medium hover:opacity-90 active:scale-[0.98] transition"
            >
              Find Contractors
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>

          {/* Stats */}
          <div className="flex gap-6 sm:gap-10">
            <div>
              <span className="block text-2xl font-semibold text-foreground">10K+</span>
              <span className="text-[13px] text-muted-foreground">Contractors</span>
            </div>
            <div>
              <span className="block text-2xl font-semibold text-foreground">50K+</span>
              <span className="text-[13px] text-muted-foreground">Projects Completed</span>
            </div>
            <div>
              <span className="block text-2xl font-semibold text-foreground">4.8&#9733;</span>
              <span className="text-[13px] text-muted-foreground">Average Rating</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1736390800504-d3963b553aa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob21lJTIwcmVub3ZhdGlvbiUyMGtpdGNoZW58ZW58MXx8fHwxNzcwODcwNzc5fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Modern kitchen renovation"
            width={1080}
            height={720}
            className="w-full h-[300px] lg:h-[450px] object-cover rounded-2xl"
            priority
          />
          <div className="absolute bottom-6 left-4 right-4 bg-white/95 backdrop-blur-[10px] rounded-[var(--radius)] py-3.5 px-[18px] flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4704b" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div>
              <span className="block text-sm font-semibold text-foreground">Project Completed</span>
              <span className="text-[13px] text-muted-foreground">Kitchen Remodel in 6 weeks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
