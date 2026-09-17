# DATABASE.md — Database Schema

Last updated: September 2026

---

## Current Status

DATABASE NOT YET CONNECTED.

All data is currently hardcoded mock data in component files.
Supabase integration is planned for Phase 3.

---

## Planned Stack

Database: Supabase (PostgreSQL)
Auth: Supabase Auth
ORM: Supabase JS client (no ORM)

---

## Planned Tables

NOTE: These tables do not exist yet. Do not describe them as implemented.

### jobs

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| slug | text | URL-friendly identifier |
| title | text | Job title |
| organization | text | Hiring organization |
| department | text | Department name |
| description | text | Full description |
| advertisement_no | text | Official advt number |
| total_vacancies | integer | Total posts |
| qualification | text | Required qualification |
| age_min | integer | Minimum age |
| age_max | integer | Maximum age |
| state | text | State or 'All India' |
| category | text | central/state/railway/bank |
| application_start | date | Application start date |
| application_end | date | Last date to apply |
| exam_date | date | Exam date (nullable) |
| salary | text | Pay scale/salary |
| fee_general | integer | Fee for General/OBC |
| fee_sc_st | integer | Fee for SC/ST |
| fee_female | integer | Fee for Female |
| notification_url | text | Official notification link |
| apply_url | text | Official apply link |
| status | text | active/closed/upcoming |
| featured | boolean | Show on homepage |
| published | boolean | Visible on site |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto |

### results

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| title | text | Result title |
| organization | text | Organization |
| exam_name | text | Exam name |
| result_date | date | Date declared |
| result_url | text | Official result link |
| status | text | declared/awaited |
| published | boolean | Visible on site |
| created_at | timestamptz | Auto |

### admit_cards

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| title | text | Admit card title |
| organization | text | Organization |
| exam_date | date | Exam date |
| release_date | date | Release date |
| download_url | text | Official download link |
| status | text | available/awaited |
| published | boolean | Visible on site |
| created_at | timestamptz | Auto |

### answer_keys

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| title | text | Answer key title |
| organization | text | Organization |
| release_date | date | Release date |
| objection_start | date | Objection window start |
| objection_end | date | Objection window end |
| answer_key_url | text | Official link |
| status | text | released/awaited |
| published | boolean | Visible on site |
| created_at | timestamptz | Auto |

### syllabus

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| title | text | Syllabus title |
| organization | text | Organization |
| exam_name | text | Exam name |
| qualification | text | Required qualification |
| content | jsonb | Syllabus tiers/subjects |
| official_url | text | Official link |
| published | boolean | Visible on site |
| updated_at | timestamptz | Auto |

### users (via Supabase Auth)

Handled by Supabase Auth — do not create manually.

### user_saved_jobs

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | References auth.users |
| job_id | uuid | References jobs |
| created_at | timestamptz | Auto |

---

## Row Level Security (RLS)

All tables must have RLS enabled.

Public read policy: SELECT allowed for all on published=true rows
Authenticated write: Only admin role can INSERT/UPDATE/DELETE
User data: Users can only read/write their own rows

---

## Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   ← SERVER ONLY, never expose to client
```