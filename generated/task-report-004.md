# Task Report: TASK-004

## Task: Organism — TopNav

## Status: COMPLETED

## Changes Made

### File: `src/components/organisms/TopNav.tsx` (created)

Created the `TopNav` organism component that composes four atom components into a responsive navigation bar.

**Props interface:**

| Prop             | Type                      | Description                  |
| ---------------- | ------------------------- | ---------------------------- |
| `activeTab`      | `string`                  | Currently active tab ID      |
| `onTabChange`    | `(tab: string) => void`   | Callback when tab is clicked |
| `searchQuery`    | `string`                  | Current search input value   |
| `onSearchChange` | `(query: string) => void` | Callback when search changes |

**Structure:**

- **Root `<nav>`**: `w-full h-14 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0`
- **Left section** (`flex items-center gap-3`):
  - Mobile-only cobalt dot (`w-1.5 h-1.5 rounded-full bg-primary md:hidden`)
  - Brand text "PLANNER_V1.0" (`text-label font-semibold text-foreground-heading tracking-wider`)
- **Center section** (`hidden md:flex items-center gap-6` — desktop only):
  - `NavLink` "CANVAS" — active when `activeTab === 'canvas'`
  - `NavLink` "GUEST LIST" — active when `activeTab === 'guests'`
- **Right section** (`flex items-center gap-2 md:gap-3`):
  - `SearchInput` wrapped in `hidden md:block` (desktop only)
  - `IconButton` with inline SVG gear icon (6-tooth cog, 20x20), `label="Settings"`
  - `Avatar` with `firstName="John"` `lastName="Doe"` `size="sm"`

**Atom imports (relative paths, no barrel files):**

- `NavLink` from `../atoms/NavLink`
- `SearchInput` from `../atoms/SearchInput`
- `IconButton` from `../atoms/IconButton`
- `Avatar` from `../atoms/Avatar`

**Mobile responsiveness:** On mobile, only the cobalt dot, brand text, settings icon button, and avatar are visible. The center nav links and search input are hidden via `hidden md:flex` and `hidden md:block` respectively.

**Directory created:** `src/components/organisms/`

## Conventions Verified

- [x] No semicolons
- [x] Single quotes
- [x] 2-space indentation
- [x] Function declaration (not arrow function)
- [x] Default export
- [x] No barrel files
- [x] Imports from `../atoms/ComponentName`

## Acceptance Criteria Verification

- [x] `src/components/organisms/TopNav.tsx` created
- [x] Props match spec: `activeTab`, `onTabChange`, `searchQuery`, `onSearchChange`
- [x] Nav element with exact Tailwind classes from spec
- [x] Left section with mobile cobalt dot + brand text
- [x] Center section with NavLink "CANVAS" and "GUEST LIST" (desktop only)
- [x] Right section with SearchInput (desktop only), IconButton (gear SVG), Avatar
- [x] Mobile: only brand + dot, settings, avatar visible
- [x] Full project type-check passes (`tsc --noEmit` — 0 errors)
