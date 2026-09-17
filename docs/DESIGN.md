# DESIGN.md — Design System

Last updated: September 2026

---

## Brand

Name: MyResult
Positioning: Fast, reliable, student-focused government job platform
Tone: Professional, trustworthy, accessible

---

## Colors

Primary Blue: blue-700 (#1d4ed8)
Dark Blue: blue-900 (#1e3a5f)
Light Blue: blue-50 (#eff6ff)
Background: gray-50 (#f9fafb)
Cards: white
Border: gray-100
Text Primary: gray-900
Text Secondary: gray-600
Text Muted: gray-400

Status Colors:
- New/Active: green-100 text-green-700
- Hot/Urgent: orange-100 text-orange-700
- Updated: blue-100 text-blue-700
- Closing/Deadline: red-100 text-red-600
- Awaited/Pending: yellow-100 text-yellow-700

---

## Typography

Font: System UI / Inter (via Next.js default)
Headings: font-bold or font-black
Body: text-sm (14px)
Small: text-xs (12px)
Section headings: text-sm font-bold
Page headings: text-xl font-bold

---

## Cards

Border radius: rounded-xl (12px) or rounded-2xl (16px)
Border: border border-gray-100
Shadow: shadow-sm
Padding desktop: p-4 or p-5
Padding mobile: p-3 or p-4

---

## Buttons

Primary: bg-blue-700 text-white rounded-xl font-bold
Secondary: border-2 border-blue-700 text-blue-700 rounded-xl
Danger: bg-red-600 text-white
Success: bg-green-600 text-white
Min height: 44px (touch target)

---

## Desktop Layout

Max width: max-w-7xl (1280px) centered
Grid: 3 columns for main content sections
Sidebar: w-64 sticky for Job Detail
Header: White background, sticky, shadow
Footer: bg-blue-900 text-white

---

## Mobile Layout

Max width: full width
Bottom navigation: fixed, 5 items, 64px height
Header: sticky, 56px height, hamburger + logo + icons
Cards: full width, rounded-2xl
Grid: 2 columns max for side-by-side cards
Touch targets: minimum 44px
Font: minimum 12px

Mobile breakpoint: below lg (1024px)
Desktop breakpoint: lg and above

---

## Avoid

- Excessive gradients
- Excessive animations
- Clutter
- Tiny text (below 12px)
- Too many colors
- Old-fashioned portal appearance
- Horizontal overflow on mobile