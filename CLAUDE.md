# Domustack - Project Guide

## Overview

Domustack is a home renovation marketplace connecting homeowners with verified contractors. Built with Next.js 16 (App Router), React 19, TypeScript, Supabase, and Tailwind CSS 4.

## Tech Stack

- **Framework:** Next.js 16.1.6 with App Router
- **UI:** React 19.2.3, Tailwind CSS 4
- **Backend:** Supabase (database, auth, realtime)
- **Language:** TypeScript 5 (strict mode)
- **Linting:** ESLint 9 with next/core-web-vitals + typescript presets
- **Package Manager:** npm

## Project Structure

```
src/
├── app/                        # App Router pages
│   ├── contractor/[id]/page.tsx  # Dynamic contractor profile
│   ├── inspirations/page.tsx     # Inspiration gallery
│   ├── messages/page.tsx         # Messaging (realtime)
│   ├── projects/page.tsx         # Project management (realtime)
│   ├── shop/page.tsx             # Product catalog
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home/landing page
│   └── globals.css               # Tailwind theme & global styles
├── components/                 # Reusable components
│   ├── Navbar.tsx                # Navigation bar (client component)
│   ├── HeroSection.tsx           # Landing hero
│   ├── FeaturesSection.tsx       # Feature cards
│   ├── ContractorsSection.tsx    # Top contractors grid (server component)
│   ├── ProjectsList.tsx          # Realtime project list (client)
│   ├── ConversationsList.tsx     # Realtime conversations (client)
│   └── CTASection.tsx            # Call-to-action section
├── lib/                        # Utilities & config
│   ├── supabase.ts               # Browser client + TypeScript types
│   ├── supabase-server.ts        # Server-side Supabase client
│   └── utils.ts                  # Formatters & helpers
supabase/
├── migrations/
│   └── 001_initial_schema.sql    # Full schema (12 tables, RLS, indexes)
└── seed.sql                      # Demo data
```

## Commands

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Architecture Decisions

- **Server Components by default** — only use `"use client"` for interactivity (realtime subscriptions, event handlers, state).
- **Supabase direct access** — no custom API routes. Server components use `createServerSupabaseClient()`, client components use `createBrowserSupabaseClient()`.
- **Realtime via Supabase channels** — `ProjectsList` and `ConversationsList` subscribe to postgres_changes.
- **Path alias:** `@/*` maps to `./src/*`.

## Database

12 tables in Supabase with RLS enabled on all. Key tables: `users`, `contractors`, `contractor_services`, `reviews`, `projects`, `conversations`, `messages`, `inspirations`, `products`, `shop_categories`, `inspiration_categories`.

Demo user ID: `00000000-0000-0000-0000-000000000001`

## Styling

Tailwind CSS 4 with a warm design system defined in `globals.css`:
- Primary: `#d4704b` (terracotta)
- Background: `#fff9f5` (warm cream)
- Foreground: `#2d2420` (dark brown)
- Accent: `#e8a87c` (tan)
- Border radius: 12px

Use Tailwind utility classes. No CSS modules. Responsive with `sm:`, `md:`, `lg:` breakpoints.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL      # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase anon/public key
```

## Conventions

- Components use PascalCase filenames.
- Pages are `page.tsx` inside route directories.
- TypeScript interfaces for all Supabase data models live in `lib/supabase.ts`.
- Utility functions (date formatting, status labels/colors) live in `lib/utils.ts`.
- External images from Unsplash, optimized via Next.js `<Image>` component. Domain allowlisted in `next.config.ts`.
- No testing framework currently configured.

## Key Patterns

- **Realtime subscriptions:** Use `supabase.channel().on('postgres_changes', ...).subscribe()` in `useEffect`, with cleanup via `supabase.removeChannel()`.
- **Server data fetching:** Async server components call Supabase directly, no `getServerSideProps`.
- **Status badges:** Use `statusLabel()` and `statusColor()` from `lib/utils.ts`.

## Not Yet Implemented

- Authentication UI (Supabase auth configured, no login/signup pages)
- Payment processing
- Search functionality (UI present, not wired)
- Message sending (display works, no send logic)
