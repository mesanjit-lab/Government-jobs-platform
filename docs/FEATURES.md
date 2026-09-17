# FEATURES.md — Master Feature Status

Last updated: September 2026

Legend:
[x] Complete — implemented and verified
[~] In Progress
[ ] Not Started
[!] Blocked
[R] Needs Review

---

## Pages & Routes

[x] Homepage — desktop layout
[x] Homepage — mobile layout (MobileHome component)
[x] Jobs listing (/jobs)
[x] Job Detail (/jobs/[id])
[x] Results listing (/results)
[x] Admit Cards listing (/admit-card)
[x] Answer Keys listing (/answer-key)
[x] Syllabus listing (/syllabus)
[x] Syllabus Detail (/syllabus/[id])
[x] Exam Calendar (/exam-calendar)
[x] About (/about)
[x] Contact (/contact)
[x] Privacy Policy (/privacy)
[x] Terms (/terms)
[x] Login UI (/login) — UI only, no auth
[x] Register UI (/register) — UI only, no auth

---

## Tools

[x] Tools Index (/tools)
[x] Age Calculator (/tools/age-calculator)
[x] Photo & Signature Resize (/tools/photo-resize)
[x] PDF Tools (/tools/pdf) — JPG to PDF, Merge, Compress, Split
[x] Eligibility Checker (/tools/eligibility-checker)
[ ] Exam Calendar Tool (separate from page)

---

## Data & Database

[ ] Supabase project setup
[ ] Jobs table
[ ] Results table
[ ] Admit Cards table
[ ] Answer Keys table
[ ] Syllabus table
[ ] Exam Calendar table
[ ] Real data in homepage
[ ] Real data in Jobs page
[ ] Real data in Results page
[ ] Real data in Admit Cards page
[ ] Admin CMS

---

## Authentication

[ ] Supabase Auth setup
[ ] Login — functional
[ ] Register — functional
[ ] Forgot Password
[ ] Email verification
[ ] User dashboard
[ ] Saved Jobs
[ ] Tracked Jobs
[ ] Job Alerts preferences

---

## Notifications

[ ] Email notifications
[ ] WhatsApp notifications
[ ] SMS notifications
[ ] Push notifications
[ ] In-app notifications
[ ] Notification architecture

---

## SEO

[~] Basic page titles
[ ] Dynamic metadata per page
[ ] Open Graph tags
[ ] Sitemap
[ ] Robots.txt
[ ] Structured data (JobPosting schema)
[ ] Canonical URLs

---

## Performance

[~] Basic Next.js optimization
[ ] Image optimization
[ ] Pagination on listings
[ ] Efficient DB queries
[ ] Caching strategy

---

## Security

[~] Basic security
[ ] Supabase Row Level Security
[ ] API route protection
[ ] Input validation
[ ] Rate limiting

---

## Deployment

[x] Vercel deployment
[x] GitHub repository
[ ] Custom domain
[ ] Environment variables configured
[ ] CI/CD pipeline