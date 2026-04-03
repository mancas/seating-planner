# Task Report — TASK-004: Refactor App.tsx — route-based view switching and navigation

## Status: COMPLETE

## Files Modified

- `src/App.tsx`

## Implementation Summary

### 1. Removed `useSearchParams` import and usage

- Removed `useSearchParams` from the `react-router` import
- Removed `const [searchParams, setSearchParams] = useSearchParams()`
- Removed `rawTab`, `activeTab`, and `onTabChange` derivations

### 2. Derived active view from pathname

- Added `const isCanvasView = location.pathname === '/seating-plan'` after the existing `useLocation()` call

### 3. Removed search state

- Removed `const [searchQuery, setSearchQuery] = useState('')`
- Removed the `filteredGuests` filter computation
- Replaced `filteredGuests` with `guests` in the `GuestTable` call
- Passed `searchQuery=""` to `GuestTable` (prop is still required in GuestTable's interface)

### 4. Updated post-action navigation (3 occurrences)

- `handleAddGuest`: `navigate('/?tab=guests', ...)` → `navigate('/', { replace: true })`
- `handleUpdateGuest`: `navigate('/?tab=guests', ...)` → `navigate('/', { state: { selectedGuestId: id } })`
- `handleDeleteGuest`: `navigate('/?tab=guests', ...)` → `navigate('/', { replace: true })`

### 5. Updated `canvasContent` block

- Removed `activeTab={activeTab}` from `LeftSidebar` JSX
- Changed `<main>` className to static `"flex-1 flex flex-col overflow-hidden pb-16 md:pb-0"`

### 6. Updated `defaultContent` block

- Removed `activeTab={activeTab}` from `LeftSidebar` JSX
- Removed the `activeTab === 'guests'` ternary branch and MODULE_OFFLINE fallback
- Restructured to: `isChildRoute` → Outlet, else `guests.length === 0` → EmptyState, else → guest list
- Updated `selectedGuest && activeTab === 'guests' && !isChildRoute` → `selectedGuest && !isChildRoute`

### 7. Updated `TopNav` call site

- Changed to `<TopNav />` (no props)

### 8. Updated `BottomTabBar` call site

- Changed to `<BottomTabBar />` (no props)

### 9. Updated canvas/default conditional

- Replaced `activeTab === 'canvas' && !isChildRoute` with `isCanvasView && !isChildRoute`

### 10. Cleaned up unused imports

- Removed `useSearchParams` from react-router import
- `useState` is still used for `guests` and `selectedGuestId`, so kept

## Acceptance Criteria Verification

| Criterion                                  | Status                                        |
| ------------------------------------------ | --------------------------------------------- |
| App compiles (`npx tsc --noEmit`)          | PASS                                          |
| `/` renders guest list                     | PASS — defaultContent always shows guest list |
| `/seating-plan` renders canvas             | PASS — `isCanvasView` derives from pathname   |
| `DragDropProvider` wraps canvas view       | PASS — unchanged                              |
| Post-action navigation goes to `/`         | PASS — all 3 occurrences updated              |
| No `searchParams` references in App.tsx    | PASS                                          |
| No `activeTab` references in App.tsx       | PASS                                          |
| No `onTabChange` references in App.tsx     | PASS                                          |
| `TopNav` rendered without props            | PASS                                          |
| `BottomTabBar` rendered without props      | PASS                                          |
| `LeftSidebar` rendered without `activeTab` | PASS                                          |

## Notes

- `GuestTable` still requires `searchQuery` as a required prop in its interface. Passed `""` as a placeholder. A follow-up task should make this prop optional or remove it from `GuestTable` entirely.
