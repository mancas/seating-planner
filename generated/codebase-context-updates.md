# Codebase Context Updates

Updates to `generated/codebase-context.md` based on the validated Guest CRUD Flow implementation.

---

## New Guardrails Added (G-15 through G-19)

### G-15: Form Inputs with Validation Must Include `aria-invalid`

**Rule**: Any form input with validation must include `aria-invalid`. Error message elements must use `role="alert"`.
**Source**: GuestForm's firstName/lastName inputs lacked `aria-invalid`; FormError lacked `role="alert"`.

### G-16: Avoid `setState` Inside `useEffect` — Use Synchronous State Adjustment

**Rule**: Prefer the "adjusting state during render" pattern over `useEffect` with `setState` for state derived from navigation/props.
**Source**: `setSelectedGuestId` inside `useEffect` in App.tsx caused ESLint error and cascading renders.

### G-17: Single Source of Truth for Data Transformations

**Rule**: Filtering/sorting should happen in exactly one place. Don't duplicate transformations across parent and child.
**Source**: Search filtering was applied in both App.tsx and GuestTable.tsx.

### G-18: Delete Unused Component Files

**Rule**: If a component is created but never imported, delete it. Dead code increases cognitive load.
**Source**: SelectInput.tsx and TextareaInput.tsx were created but never used.

### G-19: Custom Modal Dialogs Need Keyboard and ARIA Support

**Rule**: Modals must include `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby`, and Escape key handling.
**Source**: ConfirmDialog lacked standard modal accessibility patterns.

---

## Sections to Update in `generated/codebase-context.md`

### 1. Update Key Dependencies table

Add these new entries:

| Library         | Version | Purpose                                       |
| --------------- | ------- | --------------------------------------------- |
| react-hook-form | ^7.x    | Form state management, validation, submission |
| uuid            | ^11.x   | UUID v4 generation for guest IDs              |
| @types/uuid     | ^10.x   | TypeScript types for uuid (devDependency)     |

### 2. Update "Prior Spec Decisions" — Guest CRUD Flow status

Change:

```
### Spec: Guest CRUD Flow (`spec/guest-crud-flow.md`) — Status: Draft (Confirmed, awaiting implementation)
```

To:

```
### Spec: Guest CRUD Flow (`spec/guest-crud-flow.md`) — Status: In Progress (Iteration 1 — CHANGES_REQUESTED)
```

### 3. Update "Data fetching" in Architectural Patterns

Replace:

```
- **Data fetching**: None (mock data). `src/data/mock-guests.ts` exports typed `Guest` interface, `GuestStatus` type, 6 mock guests, and stat helper functions...
```

With:

```
- **Data fetching**: localStorage-backed persistence. `src/data/guest-store.ts` provides CRUD operations (`getGuests`, `getGuestById`, `addGuest`, `updateGuest`, `deleteGuest`) and stat helpers. Reads/writes `Guest[]` to localStorage under key `"seating-plan:guests"`. In-memory fallback if localStorage unavailable. Type definitions remain in `src/data/mock-guests.ts`. App starts with empty guest list (no mock data seeding).
```

### 4. Update "Routing Architecture"

Replace:

```
- `main.tsx` wraps `<App />` in `<BrowserRouter>` from `react-router`
- `App.tsx` uses `useSearchParams` for tab switching at root `/`
- Supported tabs: `guests` (default), `canvas`, `tools`, `more`
- Invalid tab values fall back to `guests`
- No sub-route definitions currently exist — the entire app renders at `/`
```

With:

```
- `main.tsx` defines route tree: `<BrowserRouter>` wraps `<Routes>` with `<App />` as layout route
- Routes: index (`/`), `/guests/new` (AddGuestPage), `/guests/:id/edit` (EditGuestPage)
- `App.tsx` is the layout component using `<Outlet />` for child routes
- `App.tsx` uses `useSearchParams` for tab switching at root `/`
- Supported tabs: `guests` (default), `canvas`, `tools`, `more`
- Invalid tab values fall back to `guests`
- Child route data passed via Outlet context (`guests`, `onAdd`, `onUpdate`, `onDelete`, `onCancel`)
- Page components in `src/pages/` directory (new convention for route-level components)
```

### 5. Update "State management" in Architectural Patterns

Replace:

```
- **State management**: Local component state via `useState` in `App.tsx`. No global state library. `App` owns `selectedGuestId`, `searchQuery`, and `activeTab` (via `useSearchParams`). Data and callbacks passed down as props.
```

With:

```
- **State management**: Local component state via `useState` in `App.tsx`. No global state library. `App` owns `guests` (synced with localStorage via guest-store), `selectedGuestId`, `searchQuery`, and `activeTab` (via `useSearchParams`). CRUD operations update both localStorage and React state. Data and callbacks passed down as props (direct children) and Outlet context (route children).
```

### 6. Update "Current File Structure"

Add new files to the structure:

```
src/
├── App.css                    (empty)
├── App.tsx                    (layout route, tab routing, state management, CRUD callbacks)
├── index.css                  (design system: tokens, theme, base styles, utilities, components)
├── main.tsx                   (entry point: StrictMode + BrowserRouter + Routes + layout route)
├── data/
│   ├── mock-guests.ts         (Guest/GuestStatus types, mock data array, stat helpers — types only used)
│   └── guest-store.ts         (NEW: localStorage CRUD, stat helpers, in-memory fallback)
├── pages/
│   ├── AddGuestPage.tsx       (NEW: thin wrapper for add guest route)
│   └── EditGuestPage.tsx      (NEW: thin wrapper for edit guest route with redirect)
└── components/
    ├── atoms/
    │   ├── Avatar.tsx
    │   ├── FAB.tsx
    │   ├── FormError.tsx       (NEW: inline validation error message)
    │   ├── IconButton.tsx
    │   ├── NavLink.tsx
    │   ├── SearchInput.tsx
    │   ├── StatCard.tsx
    │   ├── StatusBadge.tsx
    │   ├── StatusIcon.tsx
    │   ├── TabBarItem.tsx
    │   └── Toggle.tsx          (NEW: on/off toggle switch)
    ├── molecules/
    │   ├── ConfirmDialog.tsx   (NEW: modal confirmation dialog)
    │   ├── FormField.tsx       (NEW: label + input + error stack)
    │   ├── FormSection.tsx     (NEW: section heading + grouped fields)
    │   ├── GuestDetailSection.tsx
    │   ├── GuestRow.tsx
    │   ├── SidebarNavItem.tsx
    │   └── TableGroupHeader.tsx
    └── organisms/
        ├── BottomTabBar.tsx
        ├── EmptyState.tsx      (NEW: empty guest list placeholder)
        ├── GuestDetailPanel.tsx (MODIFIED: onUpdate/onDelete props, DELETE button)
        ├── GuestForm.tsx       (NEW: add/edit form with react-hook-form)
        ├── GuestListFooterStats.tsx
        ├── GuestListHeader.tsx
        ├── GuestTable.tsx
        ├── LeftSidebar.tsx     (MODIFIED: onAddGuest callback prop)
        └── TopNav.tsx
```

### 7. Update "Guardrails and Lessons Learned"

Replace:

```
See `generated/guardrails.md` for 14 guardrails established from the Nought Cobalt design system and Guest List Screen implementations...
```

With:

```
See `generated/guardrails.md` for 19 guardrails established from the Nought Cobalt design system, Guest List Screen, and Guest CRUD Flow implementations, covering Tailwind v4 configuration, CSS variable namespacing, dark mode policy, migration safety, accessibility requirements, component development patterns, form validation accessibility, state management patterns, data transformation ownership, dead code prevention, and modal dialog accessibility.
```
