# OptiFlow

A rebuild of the Base44 "SeoPulse" app — social posting + SEO content + keyword tracking + analytics integrations — as a real Next.js codebase you own.

## Phase 1 (this drop): Auth + App Shell + Database

- Email/password auth (register, login, forgot password, reset password) via NextAuth
- Protected dashboard shell with sidebar nav for all modules
- Full Prisma schema covering Users, Social Posts, SEO Content, Keywords (+ rank history), and Integrations (GA4 / Search Console / Ahrefs / Screaming Frog)
- Module pages are placeholders for now — Phase 2 fills in Social Posts + SEO Content, Phase 3 is Keywords, Phase 4 is the analytics integrations

## Deploying to Vercel

1. Push this repo to GitHub.
2. Set up a database (Vercel Postgres, Supabase, or Neon) and copy the connection string.
3. Import the repo into Vercel.
4. Add environment variables in Vercel project settings (see `.env.example`):
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET` — any random 32+ character string
   - `NEXTAUTH_URL` — your deployed URL
   - `RESEND_API_KEY` and `EMAIL_FROM` — optional, needed for password reset emails
5. Deploy. Vercel runs `npm install` and `prisma generate` automatically.
6. Push the database schema with `npx prisma db push` (ask Claude for a no-terminal way to do this if needed).

## What's next

Once Phase 1 is live and you can register + log in, Phase 2 builds the Social Posts composer and SEO Content editor with AI-assisted drafting and scoring.
