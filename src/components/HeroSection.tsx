"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchAutocomplete from "@/components/SearchAutocomplete";

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
    <section className="relative min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1736390800504-d3963b553aa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob21lJTIwcmVub3ZhdGlvbiUyMGtpdGNoZW58ZW58MXx8fHwxNzcwODcwNzc5fDA&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Modern kitchen renovation"
        fill
        className="object-cover"
        priority
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/50" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-20 w-full">
        <div className="max-w-[640px]">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Trusted by 50,000+ homeowners across the US
          </div>

          <h1 className="text-4xl lg:text-[56px] font-bold leading-[1.1] text-white mb-5 tracking-tight">
            Your Home Renovation,{" "}
            <span className="text-accent">Made Simple</span>
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-[520px]">
            Find verified contractors, manage your project, and track every milestone — all in one place.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-2 shadow-[0_8px_40px_rgba(0,0,0,0.15)] mb-10">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <SearchAutocomplete
                  value={service}
                  onChange={setService}
                  placeholder="What needs renovation?"
                  type="service"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  }
                />
              </div>
              <div className="flex-1">
                <SearchAutocomplete
                  value={location}
                  onChange={setLocation}
                  placeholder="City or ZIP code"
                  type="location"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  }
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-accent text-white rounded-xl text-[15px] font-semibold hover:brightness-110 active:scale-[0.98] transition whitespace-nowrap shadow-sm"
              >
                Find Pros
              </button>
            </div>
          </form>

          {/* Trust Stats */}
          <div className="flex flex-wrap gap-8 sm:gap-12">
            <div>
              <span className="block text-3xl font-bold text-white">10K+</span>
              <span className="text-sm text-white/60">Verified Pros</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-white">50K+</span>
              <span className="text-sm text-white/60">Projects Done</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-white">4.8/5</span>
              <span className="text-sm text-white/60">Avg. Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
