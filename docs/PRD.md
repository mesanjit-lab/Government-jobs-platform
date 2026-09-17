# PRD.md — Product Requirements Document

Product: MyResult
Version: 1.0
Last Updated: September 2026

---

## Vision

MyResult is a modern Indian government job information and recruitment
tracking platform that helps students discover government jobs, results,
admit cards, answer keys, syllabus and exam calendars — all in one place.

---

## Target Users

- Indian students preparing for government exams
- Job seekers looking for sarkari naukri
- Candidates tracking multiple recruitments
- Cyber cafe users helping students

---

## Core Problems Solved

1. Students miss newly released government jobs
2. Students don't know if they are eligible
3. Students forget application deadlines
4. Students forget exam dates
5. Students have difficulty tracking a recruitment
6. Students have to search multiple websites for updates
7. Students don't know when admit cards/results are released
8. Students need mobile-friendly access
9. Students need reliable official source links

---

## Technology Stack

Frontend: Next.js 16, TypeScript, Tailwind CSS, App Router
Database: Supabase (PostgreSQL) — planned Phase 3
Auth: Supabase Auth — planned Phase 4
Deployment: Vercel
Repository: github.com/mesanjit-lab/Government-jobs-platform

---

## Key Features

### Information Pages
- Latest Jobs with filtering
- Job Detail with full recruitment information
- Results listing
- Admit Cards listing
- Answer Keys listing
- Syllabus with subject breakdown
- Exam Calendar

### Tools
- Age Calculator with eligibility check
- Eligibility Checker
- Photo & Signature Resize
- PDF Tools (JPG to PDF, Merge, Compress, Split)

### User Features (Planned)
- Registration for job alerts
- Email/WhatsApp/SMS/Push notifications
- Saved Jobs
- Tracked Jobs
- Applied Jobs tracker
- Recruitment timeline

### Admin (Planned)
- Admin CMS for data entry
- Role-based access control
- Job publish/unpublish

---

## Design Principles

- Mobile-first responsive design
- Clean and professional appearance
- Student-friendly language
- No excessive animations
- Fast loading
- Trustworthy and reliable feel

---

## Non-Goals

- We are NOT a job application portal
- We do NOT accept job applications
- We are NOT affiliated with any government organization
- We do NOT guarantee information accuracy — always verify from official sources

---

## Disclaimer

MyResult provides government job information for informational purposes only.
Candidates must always verify details from the official recruitment notification
and official website before applying.