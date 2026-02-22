# Domustack - Agent Guidelines

## Agent Roles & Responsibilities

### Code Agent

When working on this codebase, follow these guidelines:

- **Read before writing.** Always read existing files before modifying them. Understand the surrounding code and patterns.
- **Match existing patterns.** Follow the conventions already established in the codebase (naming, structure, styling approach).
- **Minimize changes.** Only change what is necessary. Don't refactor unrelated code or add features that weren't requested.
- **Prefer Server Components.** Default to server components. Only add `"use client"` when the component needs browser APIs, state, effects, or event handlers.
- **Use Supabase clients correctly.** Server components use `createServerSupabaseClient()` from `lib/supabase-server.ts`. Client components use `createBrowserSupabaseClient()` from `lib/supabase.ts`.
- **TypeScript types.** Use the interfaces defined in `lib/supabase.ts`. Add new interfaces there when introducing new data models.
- **Tailwind only.** Style with Tailwind utility classes. Use the custom theme variables (e.g., `bg-primary`, `text-foreground`). No inline styles or CSS modules.

### Explore Agent

When investigating the codebase:

- Start with `package.json` and the `src/app/` directory to understand the project scope.
- Check `lib/supabase.ts` for data model definitions.
- Check `supabase/migrations/` for the database schema and relationships.
- Check `globals.css` for the design system and theme variables.

### Review Agent

When reviewing code changes:

- Verify `"use client"` is only added when genuinely needed.
- Check that Supabase queries use the correct client (server vs browser).
- Ensure realtime subscriptions are cleaned up in `useEffect` return functions.
- Confirm new UI follows the warm color palette and existing component patterns.
- Validate TypeScript types are used (no `any`).
- Check for proper error handling on Supabase queries.
- Ensure images use Next.js `<Image>` component with proper `width`, `height`, and `alt` attributes.

## Task Execution Workflow

1. **Understand** — Read relevant files and understand the current state.
2. **Plan** — For non-trivial changes, outline the approach before writing code.
3. **Implement** — Make focused, minimal changes.
4. **Verify** — Run `npm run lint` and check the dev server for visual/functional correctness.
5. **Test** — Manually verify in the browser when UI changes are involved.

## File Modification Priority

When modifying the project, prefer:

1. Edit existing files over creating new ones.
2. Add to existing utility modules (`lib/utils.ts`, `lib/supabase.ts`) over creating new utility files.
3. Compose existing components over building from scratch.

## Common Tasks

### Adding a new page

1. Create `src/app/<route>/page.tsx`
2. Add the route to `Navbar.tsx` navigation links
3. Use server component by default; add `"use client"` only if needed

### Adding a new component

1. Create `src/components/<ComponentName>.tsx`
2. Follow PascalCase naming
3. Import and compose in the relevant page

### Adding a new data model

1. Add the TypeScript interface to `lib/supabase.ts`
2. Create a migration in `supabase/migrations/`
3. Add seed data in `supabase/seed.sql` if needed

### Modifying the database

1. Create a new numbered migration file in `supabase/migrations/`
2. Always enable RLS on new tables
3. Add appropriate read/write policies
4. Update TypeScript interfaces in `lib/supabase.ts`

## Debugging

- **Dev server:** `npm run dev` on `localhost:3000` (Turbopack)
- **Supabase issues:** Check `.env.local` for correct credentials
- **Realtime not working:** Verify the table has realtime enabled in Supabase dashboard and RLS policies allow reads
- **Image errors:** Verify the domain is in `next.config.ts` `images.remotePatterns`
- **Type errors:** Check interfaces in `lib/supabase.ts` match the database schema
