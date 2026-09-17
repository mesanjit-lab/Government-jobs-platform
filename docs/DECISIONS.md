# DECISIONS.md — Architecture Decision Log

Last updated: September 2026

---

## ADR-001 — Use Next.js App Router

Date: September 2026
Decision: Use Next.js 16 App Router instead of Pages Router
Reason: Modern pattern, Server Components, better performance
Status: Implemented

---

## ADR-002 — Tailwind CSS for Styling

Date: September 2026
Decision: Use Tailwind CSS utility classes
Reason: Fast development, consistent design, no CSS files needed
Status: Implemented

---

## ADR-003 — Separate Mobile and Desktop Homepage

Date: September 2026
Decision: Create MobileHome component separate from desktop layout
Reason: Mobile requires fundamentally different composition, not just CSS shrinking
Implementation: MobileHome shown below lg, desktop shown at lg+
Status: Implemented

---

## ADR-004 — Client-side PDF Processing

Date: September 2026
Decision: Process PDFs entirely in browser using pdf-lib
Reason: Privacy — user files never uploaded to server
Tradeoff: Limited compression capability vs server-side processing
Status: Implemented

---

## ADR-005 — Mock Data First, Database Later

Date: September 2026
Decision: Build complete UI with mock data before connecting database
Reason: Faster UI iteration, database schema can be finalized based on UI needs
Status: In Progress — database connection planned for Phase 3

---

## ADR-006 — Supabase for Database and Auth

Date: September 2026
Decision: Use Supabase for PostgreSQL database and authentication
Reason: Built-in Auth, Row Level Security, real-time capabilities, free tier
Status: Planned — Phase 3

---

## ADR-007 — Registration Optional

Date: September 2026
Decision: All content accessible without registration
Reason: Lower friction for students, registration only required for notifications
Status: Implemented in UI

---

## ADR-008 — lucide-react for Icons

Date: September 2026
Decision: Use lucide-react as the primary icon library
Reason: Clean, consistent, tree-shakeable, TypeScript support
Status: Implemented