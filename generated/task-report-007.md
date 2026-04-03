# Task Report — TASK-007: Refactor Routing and App Shell

## Status: COMPLETE

## Files Modified

- `src/main.tsx`
- `src/App.tsx`

## Implementation Details

### `src/main.tsx`

- Replaced simple `<BrowserRouter><App /></BrowserRouter>` with a full route-based setup using `Routes` and `Route` from `react-router`
- App is now a layout route (`<Route element={<App />}>`) with child routes:
  - `index` route renders `null` (main guest list handled by App itself)
  - `guests/new` renders `<AddGuestPage />`
  - `guests/:id/edit` renders `<EditGuestPage />`

### `src/App.tsx`

- **Removed** all imports from `./data/mock-guests` (was importing `guests` array and stat functions)
- **Added** imports from `./data/guest-store` (`getGuests`, `addGuest`, `updateGuest`, `deleteGuest`)
- **Added** type import for `Guest` from `./data/mock-guests`
- **Added** `EmptyState` component import
- **Added** React Router hooks: `useNavigate`, `useLocation`, `Outlet`
- **Added** `useCallback` and `useEffect` imports
- **State management**: `guests` is now `useState<Guest[]>(() => getGuests())` instead of imported mock array
- **Navigation**: Added `isChildRoute` detection via `location.pathname.startsWith('/guests/')`
- **Auto-select after edit**: `useEffect` reads `location.state.selectedGuestId` and applies it
- **CRUD callbacks**: `handleAddGuest`, `handleUpdateGuest`, `handleDeleteGuest` using store functions with navigation
- **Navigation callbacks**: `handleNavigateToAdd`, `handleNavigateToEdit` for routing to form pages
- **Stats computed from state**: `confirmedCount`, `pendingCount`, `totalGuests`, `confirmationRate`, `dietaryFlagCount`, `waitlistCount`
- **Search filtering**: `filteredGuests` computed from `guests` state, passed to `GuestTable`
- **JSX structure**:
  - `LeftSidebar` receives `onAddGuest={handleNavigateToAdd}`
  - When `isChildRoute`, renders `<Outlet context={...}>` instead of guest list
  - When not child route and `guests.length === 0`, renders `<EmptyState>`
  - `GuestDetailPanel` receives `onUpdate` and `onDelete` props; hidden when `isChildRoute`
  - `FAB` hidden when `isChildRoute`, wired to `handleNavigateToAdd`
  - `import './App.css'` was not present (confirmed no removal needed)

## Conventions Followed

- No semicolons, single quotes, 2-space indent
- Function declaration with default export
- `useCallback` for stable function references passed as props
- `import type` for type-only imports

## Verification

- `npx tsc --noEmit` passes with zero errors
