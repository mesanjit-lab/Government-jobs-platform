# ARCHITECTURE.md — System Architecture

Last updated: September 2026

---

## Overview

MyResult is a Next.js application using the App Router pattern.
Currently frontend-only with mock data.
Supabase integration is planned for Phase 3.

---

## Frontend

Framework: Next.js 16.3.4
Language: TypeScript
Styling: Tailwind CSS
Icons: lucide-react
PDF: pdf-lib (client-side only)
Router: App Router (Next.js)

---

## Responsive Layout

Mobile (below lg / 1024px):
- MobileHome component at app/components/MobileHome.tsx
- Fixed bottom navigation
- Hamburger menu
- Compact cards

Desktop (lg and above):
- Full desktop layout with Header, Hero, Tools sections
- Sticky sidebar on Job Detail page
- Multi-column grid layouts

Both layouts share:
- Same data sources
- Same shared components (Header, Footer, etc.)
- Same routes

---

## Planned Backend (Phase 3)

Database: Supabase (PostgreSQL)
Auth: Supabase Auth
Storage: Supabase Storage (for images/PDFs if needed)
API: Next.js API Routes + Supabase client

---

## Security Boundaries

NEVER in frontend:
- SUPABASE_SERVICE_ROLE_KEY
- Any admin-level credentials
- Direct DB admin operations

ALLOWED in frontend:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY (with RLS enabled)

Admin operations must go through:
- Next.js API Routes (server-side only)
- Row Level Security on all tables

---

## Deployment

Platform: Vercel
Repository: github.com/mesanjit-lab/Government-jobs-platform
Branch: master
Live URL: https://government-jobs-platform-sigma.vercel.app

---

## Data Flow (Current — Mock)

Page → Hardcoded mock data → UI render

## Data Flow (Planned — Phase 3)

Page (Server Component) → Supabase client → PostgreSQL → UI render
Page (Client Component) → API Route → Supabase admin client → PostgreSQL → UI render