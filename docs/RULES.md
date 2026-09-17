# RULES.md — Development Rules

Last updated: September 2026

---

## Safety Rules

1. Never expose secrets or API keys in frontend code
2. Never commit .env or .env.local files
3. Never put SUPABASE_SERVICE_ROLE_KEY in client code
4. Never store user passwords manually — use Supabase Auth
5. Never expose private user data publicly
6. Always use Row Level Security when DB is connected

---

## Data Accuracy Rules

1. Never invent government exam requirements
2. Mark all unverified requirements as configurable
3. Always source information from official notifications
4. Never claim MyResult is affiliated with any government body
5. All mock data must be labeled: `// MOCK DATA — replace with DB`
6. Never publish fake eligibility criteria as official

---

## Coding Rules

1. TypeScript strict mode — no `@ts-ignore`
2. Fix all TypeScript errors before finishing
3. Run `npm run build` before every commit
4. No duplicate business logic
5. Keep components reusable
6. Prefer Server Components where possible
7. Use Server Actions or API Routes for sensitive operations
8. Validate all user input
9. Never hardcode secrets

---

## Git Rules

1. Always commit with a clear, descriptive message
2. Never force push to master
3. Never reset Git history
4. Always push after completing a task
5. Keep .gitignore updated

---

## Responsive Design Rules

1. Mobile-first approach
2. No horizontal page overflow on any screen width
3. Minimum 44px touch targets on mobile
4. Test at: 320px, 375px, 390px, 430px, 768px, 1024px, desktop
5. Never break desktop when fixing mobile
6. Never break mobile when fixing desktop
7. Use Tailwind responsive prefixes consistently

---

## AI Development Rules

1. Always read AGENTS.md before starting
2. Always read MEMORY.md before starting
3. Always read NEXT_TASK.md before starting
4. Never mark a feature Complete without verifying it works
5. Always update MEMORY.md after completing a task
6. Always run build checks after completing a task
7. Never invent tasks not approved by the owner
8. Inspect actual files before assuming implementation status

---

## Design Rules

1. Primary color: Blue (#1d4ed8 / blue-700)
2. Background: Light gray (#f9fafb / gray-50)
3. Cards: White with subtle border and shadow
4. No excessive gradients
5. No excessive animations
6. Professional, trustworthy appearance
7. Student-friendly language
8. Consistent spacing and typography