# AGENTS.md — MyResult Shared Agent Instructions

This file is the primary instruction set for ALL coding agents (Claude Code, Codex, etc.)
working on the MyResult repository.

---

## Project Identity

- **Product Name:** MyResult
- **Former Name:** Sarkari Job Hub (deprecated — do not use)
- **Type:** Indian Government Job Information Platform
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, App Router
- **Deployment:** Vercel
- **Repository:** github.com/mesanjit-lab/Government-jobs-platform

---

## MANDATORY START CHECKLIST

Before starting ANY coding task:

1. Read this file (AGENTS.md)
2. Read MEMORY.md
3. Read NEXT_TASK.md
4. Read relevant docs/ file
5. Run: `git status`
6. Run: `git log --oneline -5`
7. Inspect actual implementation before assuming status
8. Never assume a feature is complete without verifying the actual file

---

## MANDATORY END CHECKLIST

After completing ANY coding task:

1. Run: `npm run build` — fix all errors before finishing
2. Update docs/FEATURES.md if feature status changed
3. Update docs/PHASES.md if phase changed
4. Update MEMORY.md with handoff state
5. Update NEXT_TASK.md only when next task is explicitly approved
6. Update docs/DECISIONS.md for meaningful architecture decisions
7. Report all changed files

---

## Project Structure