# NEXT_TASK.md — Currently Approved Task

Last updated: September 2026

---

## Current Approved Task

**Task: Supabase Database Setup**

### Description

Connect MyResult to Supabase for real data storage.

### Scope

1. Create Supabase project
2. Design and create tables:
   - jobs
   - results
   - admit_cards
   - answer_keys
   - syllabus
3. Set up Supabase client in Next.js
4. Replace mock data on homepage with real Supabase data
5. Set up Row Level Security (RLS)
6. Never expose service role key in frontend

### Prerequisites

- Supabase account created
- Environment variables configured in .env.local
- .env.local added to .gitignore (verify)

### Rules

- Never commit .env.local
- Never expose SUPABASE_SERVICE_ROLE_KEY in frontend
- Use NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY only in frontend
- All DB operations that require elevated access must go through API routes

### Definition of Done

- Tables created in Supabase
- At least 5 real job records added
- Homepage jobs section loads from Supabase
- Build passes: `npm run build`
- No TypeScript errors
- No exposed secrets

---

## Status

PENDING — awaiting owner approval to begin