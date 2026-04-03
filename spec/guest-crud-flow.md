# Spec: Guest CRUD Flow

## Metadata

- **Slug**: `guest-crud-flow`
- **Date**: 2026-04-03
- **Status**: Completed
- **Author**: User
- **Related specs**: [spec/guest-list-screen.md](./guest-list-screen.md), [spec/nought-cobalt-design-system.md](./nought-cobalt-design-system.md)

## Description

Implement the full create, read, update, and delete flow for guests. This replaces the hardcoded mock data module with a localStorage-backed data layer and wires up the currently non-functional "ADD GUEST" button (sidebar + FAB), "UPDATE" button (detail panel), and adds a "DELETE" action.

The add and edit guest forms are presented as dedicated routes (`/guests/new`, `/guests/:id/edit`) using React Router, separate from the existing query-param-based tab switching. Forms are managed with `react-hook-form`. All guest data is persisted in localStorage — the app starts with an empty guest list (no mock data seeding).

### Key Behaviors

- **Add Guest**: Navigating to `/guests/new` renders a full-page form within the app shell. On successful submission, a new guest is persisted to localStorage and the user is redirected to the guest list (`/?tab=guests`).
- **Edit Guest**: Navigating to `/guests/:id/edit` (e.g., `/guests/a1b2c3d4-e5f6-7890-abcd-ef1234567890/edit`) renders the same form pre-populated with the guest's current data. On successful submission, the guest record is updated in localStorage and the user is redirected to the guest list with the updated guest selected.
- **Delete Guest**: A delete button in the edit form (and optionally the detail panel) triggers a confirmation dialog. On confirmation, the guest is removed from localStorage and the user is redirected to the guest list.
- **Data Layer**: A new `src/data/guest-store.ts` module replaces direct consumption of `mock-guests.ts`. It exposes CRUD functions that read/write a `Guest[]` array in localStorage under a stable key. The existing `Guest` and `GuestStatus` type definitions remain in `mock-guests.ts` (renamed to `guest-types.ts` or kept in place) and are re-exported.
- **Routing**: React Router is extended with new route definitions for `/guests/new` and `/guests/:id/edit`. These are full routes (not query-param tabs) and render within the shared app shell layout (top nav, sidebar). The existing tab-switching mechanism (`/?tab=guests`, `/?tab=canvas`) remains unchanged.

## User Stories

1. As a **wedding planner**, I want to add a new guest via a form so that I can build my guest list from scratch.
2. As a **wedding planner**, I want to edit an existing guest's details so that I can correct information or update their RSVP status.
3. As a **wedding planner**, I want to delete a guest so that I can remove people who are no longer invited.
4. As a **wedding planner**, I want my guest data to persist across page reloads so that I don't lose my work.
5. As a **wedding planner**, I want the "ADD GUEST" sidebar button and mobile FAB to take me directly to the add guest form so that I have a clear, intuitive entry point.
6. As a **wedding planner**, I want the "UPDATE" button in the guest detail panel to take me to the edit form pre-populated with that guest's data so that I can make changes without re-entering everything.

## Acceptance Criteria

### Data Persistence

1. GIVEN a fresh browser with no localStorage data WHEN the app loads THEN the guest list is empty (no guests displayed, no mock data).

2. GIVEN a guest has been added via the form WHEN the page is reloaded THEN the guest still appears in the guest list (data persisted in localStorage).

3. GIVEN multiple guests exist in localStorage WHEN the app loads THEN all guests are displayed in the guest list table, and all computed stats (confirmed count, pending count, confirmation rate, dietary flags) reflect the localStorage data.

### Navigation — Add Guest

4. GIVEN the guest list screen is displayed WHEN the user clicks the "ADD GUEST" button in the left sidebar THEN the browser navigates to `/guests/new` and the add guest form is displayed in the main content area.

5. GIVEN the mobile layout WHEN the user taps the FAB (floating action button) THEN the browser navigates to `/guests/new` and the add guest form is displayed.

6. GIVEN the add guest form is displayed WHEN the user views the layout THEN the left sidebar is still visible (desktop), the top nav is present, but the detail panel is hidden. The form replaces the guest list in the main content area.

### Navigation — Edit Guest

7. GIVEN a guest is selected and the detail panel is open WHEN the user clicks the "UPDATE" button THEN the browser navigates to `/guests/{guestId}/edit` and the edit form is displayed pre-populated with the guest's current data.

8. GIVEN the edit guest form is displayed WHEN the user views the form THEN all fields are pre-populated with the guest's existing data from localStorage.

### Navigation — Back/Cancel

9. GIVEN the add or edit guest form is displayed WHEN the user clicks the "CANCEL" button THEN the user is navigated back to the guest list (`/?tab=guests` or the previous page) and no data is changed.

10. GIVEN the edit guest form is displayed WHEN the user clicks the browser back button THEN the user returns to the previous view (standard browser history behavior).

### Form — Fields & Validation

11. GIVEN the add guest form is displayed WHEN the user views the form THEN the following fields are present:
    - **First Name** (text input, required)
    - **Last Name** (text input, required)
    - **Role** (text input, optional)
    - **Status** (select/dropdown: CONFIRMED, PENDING, DECLINED — required, default PENDING)
    - **Access Level** (text input, optional)
    - **Table Assignment** (text input, optional)
    - **Seat Number** (number input, optional)
    - **Dietary Type** (text input, optional)
    - **Dietary Notes** (textarea, optional)
    - **Gift Value** (number input, optional — monetary value of the gift)
    - **Shuttle Required** (toggle/checkbox, default false)
    - **Shuttle From** (text input, optional — visible only when Shuttle Required is true)
    - **Lodging Booked** (toggle/checkbox, default false)
    - **Lodging Venue** (text input, optional — visible only when Lodging Booked is true)

12. GIVEN the add guest form is displayed WHEN the user submits the form with an empty First Name or Last Name THEN validation errors are shown inline below the respective fields and the form is not submitted.

13. GIVEN the add guest form is displayed WHEN the user submits the form with all required fields filled THEN a new guest is created with an auto-generated UUID v4 as the ID, persisted to localStorage, and the user is redirected to the guest list (`/?tab=guests`).

14. GIVEN the edit guest form is displayed WHEN the user modifies fields and submits THEN the existing guest record is updated in localStorage (ID remains the same) and the user is redirected to the guest list (`/?tab=guests`) with the updated guest selected in the detail panel.

### Form — Conditional Fields

15. GIVEN the "Shuttle Required" toggle is OFF WHEN the user views the form THEN the "Shuttle From" field is hidden.

16. GIVEN the "Shuttle Required" toggle is ON WHEN the user views the form THEN the "Shuttle From" field is visible.

17. GIVEN the "Lodging Booked" toggle is OFF WHEN the user views the form THEN the "Lodging Venue" field is hidden.

18. GIVEN the "Lodging Booked" toggle is ON WHEN the user views the form THEN the "Lodging Venue" field is visible.

### Delete

19. GIVEN the edit guest form is displayed WHEN the user clicks the "DELETE" button THEN a confirmation dialog appears with the message "CONFIRM_DELETION // {GUEST_NAME}?" and two options: "CANCEL" and "CONFIRM".

20. GIVEN the delete confirmation dialog is displayed WHEN the user clicks "CONFIRM" THEN the guest is removed from localStorage and the user is redirected to the guest list (`/?tab=guests`).

21. GIVEN the delete confirmation dialog is displayed WHEN the user clicks "CANCEL" THEN the dialog closes and the user remains on the edit form.

22. GIVEN the guest detail panel is open WHEN the user clicks the "DELETE" button in the detail panel THEN the same confirmation dialog appears and deletion follows the same flow.

### Form — react-hook-form Integration

23. GIVEN the add or edit form is rendered WHEN inspecting the form state management THEN `react-hook-form` is used via `useForm` hook for all field registration, validation, and submission handling.

24. GIVEN the user is filling out the form WHEN a required field is left empty and the user attempts to submit THEN the error message appears immediately below the field without a full page re-render (client-side validation via react-hook-form).

### UI/Aesthetics

25. GIVEN the add guest form is displayed WHEN viewing the form THEN all labels use the cyberpunk/sci-fi uppercase naming convention (e.g., "FIRST_NAME", "STATUS_CLASSIFICATION", "DIETARY_PROTOCOL"), the form heading uses the design system's heading typography, and all inputs use the `.input` component style.

26. GIVEN the form is displayed on mobile (<768px) WHEN viewing the form THEN the form is single-column, full-width, with appropriate padding and the bottom tab bar is still visible.

### Empty State

27. GIVEN no guests exist in localStorage WHEN the guest list tab is active THEN the data table shows an empty state message (e.g., "NO_RECORDS // INITIALIZE_DATABASE") with a call-to-action button or link to add the first guest.

## Scope

### In Scope

- `react-hook-form` integration for form state management and validation
- `uuid` (v4) for generating unique guest IDs
- localStorage persistence layer for guest data (CRUD operations)
- Add Guest form as a dedicated route (`/guests/new`)
- Edit Guest form as a dedicated route (`/guests/:id/edit`)
- React Router route definitions for the new form routes (within the shared app shell layout)
- Delete Guest with confirmation dialog
- Auto-generated guest IDs using UUID v4
- Wiring up the existing "ADD GUEST" sidebar button to navigate to the add form
- Wiring up the existing FAB to navigate to the add form
- Wiring up the existing "UPDATE" button in the detail panel to navigate to the edit form
- Adding a "DELETE" button to the detail panel and edit form
- Conditional form fields (shuttle from, lodging venue)
- Inline validation error display
- Empty state for the guest list when no guests exist
- Replacing mock data consumption with localStorage reads
- Mobile-responsive form layout
- Cyberpunk/sci-fi naming aesthetic for all form labels
- Stat computations (confirmed count, pending count, etc.) now computed from localStorage data

### Out of Scope

- Server-side persistence / API calls / backend
- Guest import/export (CSV, JSON, etc.)
- Bulk operations (add/edit/delete multiple guests at once)
- Form autosave / draft persistence
- Undo/redo for deletions
- Image/photo upload for guest avatars
- Contact guest functionality (CONTACT button remains non-functional)
- Validation beyond required fields (no email format, no phone format, etc.)
- Drag-and-drop table/seat assignment
- Guest duplication detection
- Migration of existing mock data to localStorage (starts empty per user decision)

## Edge Cases

1. **Edit a non-existent guest**: If the user navigates to `/guests/INVALID-UUID/edit` where the ID doesn't exist in localStorage, redirect to `/?tab=guests` and show no error (silent redirect).

2. **localStorage unavailable**: If localStorage is not available (e.g., private browsing in some browsers, storage quota exceeded), the app should still function with an in-memory fallback. Data will not persist across reloads in this case. No error is shown — the app degrades gracefully.

3. **Concurrent tabs**: If the user has two browser tabs open and adds a guest in one, the other tab will not auto-update. This is acceptable — the data syncs on the next page load/navigation in the stale tab.

4. **Empty optional fields**: Optional fields left empty should be stored as `null` (not empty string) in the Guest object, consistent with the existing data model where `null` represents absence.

5. **ID uniqueness**: UUIDs v4 are generated via the `uuid` library, which provides cryptographically strong random values. Collisions are statistically impossible (2^122 combinations) and do not require a collision check against existing IDs.

6. **Browser back from add form after submission**: After successful submission, the add form URL is replaced in history (not pushed), so pressing back after submission goes to the pre-form page, not back to the empty add form.

7. **Delete the currently selected guest**: If the guest being viewed in the detail panel is deleted, the detail panel closes and the guest list refreshes.

8. **Very long text inputs**: Text inputs for firstName, lastName, role, etc. should not have explicit character limits, but the display in the guest list and detail panel should truncate with ellipsis if text overflows its container.

9. **Form submission with only required fields**: When submitting with only firstName, lastName, and status, all optional fields should default to: role = `null`, accessLevel = `null`, tableAssignment = `null`, seatNumber = `null`, gift = `null`, dietary.type = `null`, dietary.notes = `null`, logistics.shuttleRequired = `false`, logistics.shuttleFrom = `null`, logistics.lodgingBooked = `false`, logistics.lodgingVenue = `null`.

10. **Name casing**: Guest names entered in any casing should be stored as-is but displayed in uppercase in the UI (consistent with existing cyberpunk aesthetic). The form inputs should show the raw input; the transformation to uppercase happens at the display layer.

## Design Decisions

### DD-1: Form as Dedicated Route

**Decision**: The add and edit guest forms are presented as dedicated routes (`/guests/new` and `/guests/:id/edit`) using React Router's route definitions. The form pages render within the shared app shell layout (top nav, sidebar) but are separate from the existing query-param tab system. React Router's `useNavigate` and `useParams` hooks handle navigation and parameter extraction.
**Reasoning**: Full routes provide a cleaner URL structure, better browser history behavior, and stronger semantic separation between the guest list view and the form views. The existing tab system (`/?tab=guests`, `/?tab=canvas`) is a flat navigation model not well-suited for entity-level CRUD pages where parameters (guest ID) are needed. Dedicated routes also enable direct linking and bookmarking of the edit page for a specific guest. A layout route wraps both the tab-based home page and the new form routes to share the app shell (TopNav, LeftSidebar).

### DD-2: react-hook-form for Form Management

**Decision**: Use `react-hook-form` (via `useForm` hook) for all form state management, validation, and submission. Do not combine with a schema validation library (zod, yup) — use react-hook-form's built-in `register` with `{ required: true }` for the simple validation needs of this feature.
**Reasoning**: User requirement. react-hook-form provides uncontrolled form performance benefits, declarative validation, and minimal re-renders. The validation rules are simple enough (3 required fields) that a separate schema library adds unnecessary complexity. If validation needs grow in the future, zod integration can be added later via `@hookform/resolvers`.

### DD-3: localStorage Data Layer

**Decision**: Create a `src/data/guest-store.ts` module that encapsulates all localStorage read/write operations. It exports functions: `getGuests()`, `addGuest(guest)`, `updateGuest(id, guest)`, `deleteGuest(id)`, and stat helpers. The existing `src/data/mock-guests.ts` is preserved for its type definitions (`Guest`, `GuestStatus`) and re-exported from `guest-store.ts`. The mock data array and stat functions in `mock-guests.ts` are no longer directly consumed by components — `guest-store.ts` is the single source of truth.
**Reasoning**: Encapsulating localStorage behind a module provides a clean API, makes testing easier, and creates a natural seam for future migration to a real backend. Keeping type definitions in their original file avoids unnecessary import path changes across existing components.

### DD-4: localStorage Key and Schema

**Decision**: Use the localStorage key `"seating-plan:guests"` to store a JSON-serialized `Guest[]` array. No versioning schema is needed for this iteration.
**Reasoning**: A namespaced key prevents collision with other apps on the same origin. A flat array is sufficient — no indexing or relational structure is needed. Schema versioning can be added if/when the Guest data model changes.

### DD-5: UUID v4 Guest IDs

**Decision**: Generate guest IDs using the `uuid` npm package (v4 — random). IDs are standard UUIDs (e.g., `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"`). No collision checking is required.
**Reasoning**: UUIDs are the industry standard for client-side ID generation. The `uuid` library provides cryptographically strong randomness, making collisions statistically impossible. This is more robust than a custom pattern and eliminates the need for collision-checking logic. The existing mock data used a `XXXX-XX` format, but since we are starting with an empty localStorage (no migration), there is no backward-compatibility concern. The `Guest.id` field type remains `string`, which is compatible with UUIDs.

### DD-6: State Management — React State + localStorage Sync

**Decision**: The `App` component reads the guest list from `guest-store.ts` into React state on mount. CRUD operations call the store functions (which update localStorage) and then update React state to trigger re-renders. No global state library (Redux, Zustand) is introduced.
**Reasoning**: The app has a single top-level component (`App`) that owns the guest data and passes it down. This is simple enough that local `useState` + a sync pattern is sufficient. Adding a state management library for a single data entity would be over-engineering. The store module is the source of truth; React state is a mirror that drives rendering.

### DD-7: Delete Confirmation Dialog

**Decision**: Implement the delete confirmation as a custom modal component (not `window.confirm()`). The modal uses the design system styles (`.card` background, cobalt accent, dark overlay). It is a simple atom or molecule component — not a third-party modal library.
**Reasoning**: `window.confirm()` breaks the cyberpunk aesthetic and provides no styling control. A custom modal is lightweight (one small component) and consistent with the design system. No portal is needed — the modal can be rendered inline with a fixed-position overlay.

### DD-8: Form Field Organization — Sections

**Decision**: The form is divided into visual sections mirroring the detail panel's structure:

1. **IDENTITY_MATRIX** — First Name, Last Name, Role
2. **STATUS_CLASSIFICATION** — Status, Access Level
3. **SEATING_ALLOCATION** — Table Assignment, Seat Number
4. **DIETARY_PROTOCOL** — Dietary Type, Dietary Notes
5. **GIFT_REGISTRY** — Gift Value (monetary amount)
6. **LOGISTICS_CONFIG** — Shuttle Required, Shuttle From, Lodging Booked, Lodging Venue

Each section has a labeled heading in the cyberpunk style.
**Reasoning**: Grouping fields into sections reduces cognitive load (13 fields on one flat form is overwhelming). The section names mirror the detail panel sections (Core Metadata, Preferences, Logistics) but with the cyberpunk naming aesthetic, creating familiarity between the view and edit experiences.

### DD-9: Navigation After Form Submission

**Decision**: After successful add/edit, use React Router's `navigate()` function (from the `useNavigate` hook) to redirect to `/?tab=guests`. For the add form, use `navigate('/?tab=guests', { replace: true })` to replace the form URL in history. For the edit form, use `navigate('/?tab=guests')` (push). After a successful edit, pass the edited guest's ID via navigation state (`navigate('/?tab=guests', { state: { selectedGuestId: id } })`) so the guest list can auto-select the guest and open the detail panel.
**Reasoning**: `navigate()` is the standard React Router 7 imperative navigation API, appropriate for post-submission redirects. Replacing history for add prevents the user from pressing back into the empty add form after submission. Using navigation state to pass the selected guest ID avoids query-param pollution and keeps the concern scoped to the transition.

### DD-10: Empty Guest List State

**Decision**: When the guest list is empty (no guests in localStorage), the main content area shows a centered empty state with: a cyberpunk-style message ("NO_RECORDS // INITIALIZE_DATABASE"), a brief description ("Begin population sequence to activate guest matrix"), and a primary action button ("[ + ] NEW_ENTRY") that navigates to `/guests/new`.
**Reasoning**: An empty state with a clear call-to-action guides new users to add their first guest. The cyberpunk messaging is consistent with the existing aesthetic (similar to the "NO_RESULTS // QUERY_MISMATCH" search empty state).

### DD-11: LeftSidebar and FAB Now Accept Callbacks

**Decision**: The `LeftSidebar` component and `FAB` component gain an `onAddGuest` prop (callback) that the parent wires to navigate to `/guests/new`. The `GuestDetailPanel` gains `onUpdate` and `onDelete` props. Navigation is performed via React Router's `useNavigate` hook in the parent component.
**Reasoning**: These components were previously self-contained with no-op click handlers. Adding callback props follows the existing pattern (e.g., `TopNav` receives `onTabChange`). The parent controls navigation to keep routing logic centralized in `App`.

### DD-12: Form Component Architecture

**Decision**: Create a single `GuestForm` organism component that handles both add and edit modes. It accepts an optional `guest` prop — if provided, the form is in edit mode (pre-populated, shows delete button); if absent, it's in add mode. The form is placed in `src/components/organisms/GuestForm.tsx`.
**Reasoning**: The add and edit forms share 95% of their UI and logic. A single component with a mode prop avoids duplication. The delete button visibility is the primary difference. This follows the DRY principle and is a common pattern for CRUD forms.

## UI/UX Details

### Form Layout — Desktop (>=768px)

```
┌──────────────────────────────────────────────────────────┐
│  TOP NAV: PLANNER_V1.0 | CANVAS  GUEST LIST | 🔍 ⚙ 👤  │
├──────────┬───────────────────────────────────────────────┤
│          │  NEW_GUEST_ENTRY // REGISTRATION              │
│ SIDEBAR  │  ─────────────────────────────────────────    │
│          │                                               │
│ SEATING  │  ┌──────────────────────────────────────┐     │
│ _01      │  │ IDENTITY_MATRIX                      │     │
│          │  │ FIRST_NAME*     [___________________] │     │
│ Props    │  │ LAST_NAME*      [___________________] │     │
│ Layout   │  │ ROLE_DESIGNATION [__________________] │     │
│ Objects* │  └──────────────────────────────────────┘     │
│ Export   │                                               │
│          │  ┌──────────────────────────────────────┐     │
│ [ADD     │  │ STATUS_CLASSIFICATION                │     │
│  GUEST]  │  │ STATUS*        [▼ PENDING          ] │     │
│          │  │ ACCESS_LEVEL   [___________________] │     │
│ HISTORY  │  └──────────────────────────────────────┘     │
│          │                                               │
│          │  ┌──────────────────────────────────────┐     │
│          │  │ SEATING_ALLOCATION                   │     │
│          │  │ TABLE_ID       [___________________] │     │
│          │  │ SEAT_NUMBER    [___________________] │     │
│          │  └──────────────────────────────────────┘     │
│          │                                               │
│          │  ┌──────────────────────────────────────┐     │
│          │  │ DIETARY_PROTOCOL                     │     │
│          │  │ DIETARY_TYPE   [___________________] │     │
│          │  │ DIETARY_NOTES  [___________________] │     │
│          │  │                [___________________] │     │
│          │  └──────────────────────────────────────┘     │
│          │                                               │
│          │  ┌──────────────────────────────────────┐     │
│          │  │ LOGISTICS_CONFIG                     │     │
│          │  │ SHUTTLE_REQ    [○ OFF]               │     │
│          │  │ LODGING_BOOKED [○ OFF]               │     │
│          │  └──────────────────────────────────────┘     │
│          │                                               │
│          │  [CANCEL]              [DELETE]  [SAVE_ENTRY] │
│          │                                               │
└──────────┴───────────────────────────────────────────────┘
```

### Form Layout — Mobile (<768px)

```
┌──────────────────────────┐
│ ■ PLANNER_V1.0      ⚙ 👤│
├──────────────────────────┤
│ NEW_GUEST_ENTRY          │
│ REGISTRATION_PROTOCOL    │
│                          │
│ IDENTITY_MATRIX          │
│ ─────────────────────    │
│ FIRST_NAME*              │
│ [______________________] │
│ LAST_NAME*               │
│ [______________________] │
│ ROLE_DESIGNATION         │
│ [______________________] │
│                          │
│ STATUS_CLASSIFICATION    │
│ ─────────────────────    │
│ STATUS*                  │
│ [▼ PENDING             ] │
│ ACCESS_LEVEL             │
│ [______________________] │
│                          │
│ ... (remaining sections) │
│                          │
│ [CANCEL]   [SAVE_ENTRY]  │
│                          │
├──────────────────────────┤
│ CANVAS GUESTS TOOLS MORE │
└──────────────────────────┘
```

### Form Field Details

| Field            | Input Type | Placeholder / Default  | Cyberpunk Label  |
| ---------------- | ---------- | ---------------------- | ---------------- |
| First Name       | text       | `ENTER_DESIGNATION...` | FIRST_NAME       |
| Last Name        | text       | `ENTER_DESIGNATION...` | LAST_NAME        |
| Role             | text       | `E.G. PRIORITY VIP...` | ROLE_DESIGNATION |
| Status           | select     | Default: PENDING       | STATUS           |
| Access Level     | text       | `E.G. TIER_01...`      | ACCESS_LEVEL     |
| Table Assignment | text       | `E.G. TABLE_04...`     | TABLE_ID         |
| Seat Number      | number     | `E.G. 01...`           | SEAT_POSITION    |
| Dietary Type     | text       | `E.G. VEGAN...`        | DIETARY_TYPE     |
| Dietary Notes    | textarea   | `ADDITIONAL_NOTES...`  | DIETARY_NOTES    |
| Gift Value       | number     | `E.G. 250...`          | GIFT_VALUE       |
| Shuttle Required | toggle     | Off (false)            | SHUTTLE_REQUIRED |
| Shuttle From     | text       | `ORIGIN_POINT...`      | SHUTTLE_ORIGIN   |
| Lodging Booked   | toggle     | Off (false)            | LODGING_STATUS   |
| Lodging Venue    | text       | `VENUE_NAME...`        | LODGING_VENUE    |

### Validation Error Style

Inline error messages appear below the field in `text-caption` size with `text-red-400` color. Example: "REQUIRED_FIELD // FIRST_NAME CANNOT BE EMPTY". The input field border changes to `border-red-500/50` when invalid.

### Delete Confirmation Dialog

```
┌─────────────────────────────────────┐
│                                     │
│  ⚠ CONFIRM_DELETION                │
│                                     │
│  TARGET: ELARA RIVERA               │
│                                     │
│  This action is irreversible.       │
│  Guest record will be permanently   │
│  removed from the database.         │
│                                     │
│  [CANCEL]            [CONFIRM_DEL]  │
│                                     │
└─────────────────────────────────────┘
```

Modal overlay: `bg-black/60 backdrop-blur-sm fixed inset-0 z-50`. Dialog card: `bg-surface border border-border rounded max-w-md mx-auto`. Confirm button: `bg-red-600 hover:bg-red-700 text-white` (red for destructive action, exception to cobalt-only accent).

### Empty State

```
┌───────────────────────────────────┐
│                                   │
│         [ ◇ ]                     │
│                                   │
│   NO_RECORDS // INITIALIZE_DB     │
│                                   │
│   Begin population sequence to    │
│   activate guest matrix           │
│                                   │
│      [ + NEW_ENTRY ]              │
│                                   │
└───────────────────────────────────┘
```

Centered in the main content area. Icon is a diamond or hexagon outline in `text-foreground-muted`. Message in `text-heading-4`. Description in `text-body-sm text-foreground-muted`. Button is `.btn-primary`.

### Component Breakdown (Atomic Design)

**New Atoms:**

- `Toggle` — on/off toggle switch for boolean fields (shuttle, lodging). Cobalt when on, muted when off.
- `SelectInput` — styled `<select>` dropdown matching `.input` style, with custom arrow indicator.
- `TextareaInput` — styled `<textarea>` matching `.input` style.
- `FormError` — inline validation error message (red text below field).

**New Molecules:**

- `FormField` — combines a label (`text-label` style), an input (text/select/textarea/toggle), and optional FormError. Handles the label-input-error vertical stack.
- `FormSection` — groups FormFields under a section heading with a top border separator (similar to GuestDetailSection but for forms).
- `ConfirmDialog` — modal overlay with title, message, cancel and confirm buttons.

**New Organisms:**

- `GuestForm` — the full add/edit guest form. Accepts optional `guest: Guest` prop for edit mode. Uses `react-hook-form`. Contains all FormSections and action buttons.
- `EmptyState` — the empty guest list placeholder with call-to-action.

**Modified Organisms:**

- `LeftSidebar` — ADD GUEST button now calls `onAddGuest` prop instead of no-op.
- `GuestDetailPanel` — UPDATE button now calls `onUpdate` prop. New DELETE button added, calls `onDelete` prop.

**Modified Atoms:**

- `FAB` — `onClick` prop now wired to navigate to add guest form.

## Data Requirements

### Guest Interface (updated — gift field added)

```typescript
type GuestStatus = 'CONFIRMED' | 'PENDING' | 'DECLINED'

interface Guest {
  id: string
  firstName: string
  lastName: string
  role: string
  status: GuestStatus
  accessLevel: string
  tableAssignment: string | null
  seatNumber: number | null
  gift: number | null
  dietary: {
    type: string | null
    notes: string | null
  }
  logistics: {
    shuttleRequired: boolean
    shuttleFrom: string | null
    lodgingBooked: boolean
    lodgingVenue: string | null
  }
}
```

Note: The `role` and `accessLevel` fields are typed as `string` in the existing interface. For guests created with these fields left empty, they should be stored as empty string `''` (since the type is `string`, not `string | null`). The display layer treats empty string the same as showing a fallback (e.g., "UNASSIGNED" for role).

### Guest Store API (`src/data/guest-store.ts`)

```typescript
// Constants
const STORAGE_KEY = 'seating-plan:guests'

// CRUD Operations
function getGuests(): Guest[]
function getGuestById(id: string): Guest | undefined
function addGuest(guest: Omit<Guest, 'id'>): Guest // auto-generates UUID v4, returns full Guest
function updateGuest(
  id: string,
  data: Partial<Omit<Guest, 'id'>>,
): Guest | undefined
function deleteGuest(id: string): boolean

// Stat Helpers (computed from localStorage data)
function getConfirmedCount(): number
function getPendingCount(): number
function getConfirmationRate(): number
function getDietaryFlagCount(): number
function getTotalGuests(): number
function getWaitlistCount(): number
function getGuestsByTable(): Map<string, Guest[]>
```

### react-hook-form Type

```typescript
interface GuestFormValues {
  firstName: string
  lastName: string
  role: string
  status: GuestStatus
  accessLevel: string
  tableAssignment: string
  seatNumber: string // string from input, parsed to number | null
  dietaryType: string
  dietaryNotes: string
  gift: string // string from input, parsed to number | null
  shuttleRequired: boolean
  shuttleFrom: string
  lodgingBooked: boolean
  lodgingVenue: string
}
```

Form values use flat strings (no nested objects) for simpler react-hook-form `register` calls. The submission handler transforms `GuestFormValues` into the nested `Guest` shape before persisting.

## Technical Plan

### Impact Analysis

#### Affected Areas

| Area                | Files                                           | Type                                                                                                   |
| ------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Dependencies        | `package.json`                                  | Modified — add `react-hook-form`, `uuid`, `@types/uuid`                                                |
| Data layer          | `src/data/guest-store.ts`                       | **New** — localStorage CRUD + stat helpers                                                             |
| Routing & app shell | `src/main.tsx`                                  | Modified — replace `BrowserRouter` + `<App />` with `Routes` config                                    |
| App component       | `src/App.tsx`                                   | Modified — refactor to layout route, add state management for guests from localStorage, wire callbacks |
| Form atoms          | `src/components/atoms/Toggle.tsx`               | **New** — on/off toggle switch                                                                         |
| Form atoms          | `src/components/atoms/SelectInput.tsx`          | **New** — styled `<select>` dropdown                                                                   |
| Form atoms          | `src/components/atoms/TextareaInput.tsx`        | **New** — styled `<textarea>`                                                                          |
| Form atoms          | `src/components/atoms/FormError.tsx`            | **New** — inline validation error                                                                      |
| Form molecules      | `src/components/molecules/FormField.tsx`        | **New** — label + input + error stack                                                                  |
| Form molecules      | `src/components/molecules/FormSection.tsx`      | **New** — section heading + grouped fields                                                             |
| Dialog molecule     | `src/components/molecules/ConfirmDialog.tsx`    | **New** — modal overlay with confirm/cancel                                                            |
| Guest form          | `src/components/organisms/GuestForm.tsx`        | **New** — full add/edit form with react-hook-form                                                      |
| Empty state         | `src/components/organisms/EmptyState.tsx`       | **New** — empty guest list placeholder                                                                 |
| Sidebar             | `src/components/organisms/LeftSidebar.tsx`      | Modified — accept `onAddGuest` callback prop                                                           |
| Detail panel        | `src/components/organisms/GuestDetailPanel.tsx` | Modified — accept `onUpdate`/`onDelete` callback props, add DELETE button                              |
| FAB                 | `src/components/atoms/FAB.tsx`                  | Modified — no structural change needed (already has `onClick` prop)                                    |
| Guest table         | `src/components/organisms/GuestTable.tsx`       | Modified — accept `isEmpty` flag for empty state vs search-no-results                                  |

#### Integration Points

1. **`guest-store.ts` ↔ `App.tsx`**: App reads guests on mount via `getGuests()`, calls `addGuest`/`updateGuest`/`deleteGuest` on form submission, updates React state to re-render
2. **React Router ↔ `main.tsx` / `App.tsx`**: `main.tsx` defines route tree with layout route; `App.tsx` becomes the layout component using `<Outlet />`; new routes for `/guests/new` and `/guests/:id/edit`
3. **`GuestForm.tsx` ↔ `App.tsx`**: Form pages receive guest data and CRUD callbacks via React Router `<Outlet context>` or direct props
4. **`LeftSidebar` / `FAB` ↔ navigation**: Buttons call `navigate('/guests/new')` via callback props from parent
5. **`GuestDetailPanel` ↔ navigation**: UPDATE button calls `navigate('/guests/{id}/edit')`, DELETE button triggers `ConfirmDialog`

#### Risk Areas

- **`App.tsx` refactor**: This is the most complex change — converting from a single-component app to a layout route pattern. All existing state management and prop passing must be preserved.
- **`main.tsx` routing**: Changing from `<BrowserRouter><App /></BrowserRouter>` to a route-based setup. Must ensure existing `useSearchParams` tab switching still works at `/`.
- **Scope isolation with `GuestTable.tsx`**: The table needs to distinguish between "no guests exist" (show empty state) vs "search returned no results" (show existing NO_RESULTS message). This requires careful prop passing from `App.tsx`.

---

### Task Breakdown

#### TASK-001: Install Dependencies

**Description**: Install `react-hook-form`, `uuid`, and `@types/uuid` npm packages.

**Affected files**:

- `package.json` (modified by npm)

**Implementation instructions**:

1. Run `npm install react-hook-form uuid`
2. Run `npm install -D @types/uuid`
3. Verify `package.json` has the new entries in `dependencies` and `devDependencies`

**Project context**:

- ESM project (`"type": "module"`)
- TypeScript strict mode with `verbatimModuleSyntax` — imports from `uuid` must use `import { v4 as uuidv4 } from 'uuid'` (not `import type`)
- React ^19.2.4, React Router ^7.14.0 already installed

**Dependencies**: None (independent)

**Acceptance criteria**:

- `react-hook-form` appears in `dependencies` in `package.json`
- `uuid` appears in `dependencies` in `package.json`
- `@types/uuid` appears in `devDependencies` in `package.json`
- `npm install` exits without errors

---

#### TASK-002: Create Guest Store (`src/data/guest-store.ts`)

**Description**: Create the localStorage-backed data layer that replaces direct consumption of `mock-guests.ts`. Exports CRUD functions and stat helpers.

**Affected files**:

- `src/data/guest-store.ts` (**new**)

**Implementation instructions**:

1. Create `src/data/guest-store.ts`
2. Import types from `mock-guests.ts`:
   ```typescript
   import type { Guest, GuestStatus } from './mock-guests'
   ```
   Note: must use `import type` due to `verbatimModuleSyntax`.
3. Re-export types for consumer convenience:
   ```typescript
   export type { Guest, GuestStatus }
   ```
4. Define the storage key constant:
   ```typescript
   const STORAGE_KEY = 'seating-plan:guests'
   ```
5. Implement internal helper for localStorage read with in-memory fallback:

   ```typescript
   let memoryFallback: Guest[] | null = null

   function readFromStorage(): Guest[] {
     try {
       const raw = localStorage.getItem(STORAGE_KEY)
       if (raw) return JSON.parse(raw) as Guest[]
       return []
     } catch {
       if (memoryFallback !== null) return memoryFallback
       return []
     }
   }

   function writeToStorage(guests: Guest[]): void {
     try {
       localStorage.setItem(STORAGE_KEY, JSON.stringify(guests))
     } catch {
       memoryFallback = guests
     }
   }
   ```

6. Implement CRUD operations:
   - `getGuests(): Guest[]` — returns `readFromStorage()`
   - `getGuestById(id: string): Guest | undefined` — finds by id
   - `addGuest(data: Omit<Guest, 'id'>): Guest` — generates UUID v4 via `import { v4 as uuidv4 } from 'uuid'`, creates full Guest, writes to storage, returns it
   - `updateGuest(id: string, data: Partial<Omit<Guest, 'id'>>): Guest | undefined` — finds guest, merges with spread (handling nested `dietary` and `logistics` objects), writes, returns updated guest or `undefined` if not found
   - `deleteGuest(id: string): boolean` — filters out guest, writes, returns `true` if removed
7. Implement stat helpers (computed from `readFromStorage()`):
   - `getConfirmedCount(): number`
   - `getPendingCount(): number`
   - `getConfirmationRate(): number` — handle division by zero (return 0 if no guests)
   - `getDietaryFlagCount(): number`
   - `getTotalGuests(): number`
   - `getWaitlistCount(): number` (same as pending)
   - `getGuestsByTable(): Map<string, Guest[]>`
8. All functions are named exports (no default export)

**Project context**:

- Code conventions: no semicolons, single quotes, trailing commas, 2-space indent
- TypeScript strict mode — all types must be explicit
- `import type` required for type-only imports (`verbatimModuleSyntax`)
- The `uuid` package exports `v4` for UUID v4 generation: `import { v4 as uuidv4 } from 'uuid'`
- Existing stat helpers in `mock-guests.ts` (lines 148-184) serve as reference for the stat function signatures
- Nested `dietary` and `logistics` objects in `Guest` interface require deep merge in `updateGuest`

**Dependencies**: TASK-001 (needs `uuid` package installed)

**Acceptance criteria**:

- File exports `getGuests`, `getGuestById`, `addGuest`, `updateGuest`, `deleteGuest`
- File exports stat helpers matching the existing signatures from `mock-guests.ts`
- File re-exports `Guest` and `GuestStatus` types
- `addGuest` generates UUID v4 IDs
- `readFromStorage` returns `[]` for empty/missing localStorage
- `writeToStorage` falls back to in-memory array if localStorage throws
- `getConfirmationRate()` returns 0 when there are no guests (no NaN)
- `updateGuest` correctly deep-merges nested `dietary` and `logistics` objects
- TypeScript compiles without errors

---

#### TASK-003: Create Form Atom Components

**Description**: Create four new atom components needed by the guest form: `Toggle`, `SelectInput`, `TextareaInput`, and `FormError`.

**Affected files**:

- `src/components/atoms/Toggle.tsx` (**new**)
- `src/components/atoms/SelectInput.tsx` (**new**)
- `src/components/atoms/TextareaInput.tsx` (**new**)
- `src/components/atoms/FormError.tsx` (**new**)

**Implementation instructions**:

**Toggle.tsx**:

1. Create `src/components/atoms/Toggle.tsx`
2. Props interface:
   ```typescript
   interface Props {
     checked: boolean
     onChange: (checked: boolean) => void
     id?: string
   }
   ```
3. Render a `<button>` with `role="switch"`, `aria-checked={checked}`, `type="button"`
4. Styling: 44px wide, 24px tall track. When off: `bg-gray-700`. When on: `bg-primary`. Circle indicator (18px) slides left/right with `translate-x`. Transition on background and transform.
5. Use `cursor-pointer`, `focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2`
6. `onClick` calls `onChange(!checked)`

**SelectInput.tsx**:

1. Create `src/components/atoms/SelectInput.tsx`
2. Props interface:
   ```typescript
   interface Props {
     value: string
     onChange: (value: string) => void
     options: { value: string; label: string }[]
     id?: string
     hasError?: boolean
   }
   ```
3. Render a native `<select>` element using the `.input` CSS class
4. Add `appearance-none` and a custom SVG chevron-down via a wrapper `<div className="relative">`
5. The SVG arrow is absolutely positioned right-3, pointer-events-none
6. When `hasError` is true, add `border-red-500/50` to the select
7. Map `options` to `<option>` elements
8. `onChange` calls `props.onChange(e.target.value)`

**TextareaInput.tsx**:

1. Create `src/components/atoms/TextareaInput.tsx`
2. Props interface:
   ```typescript
   interface Props {
     value: string
     onChange: (value: string) => void
     placeholder?: string
     id?: string
     rows?: number
     hasError?: boolean
   }
   ```
3. Render a `<textarea>` using the `.input` CSS class with `w-full resize-none`
4. Default `rows` to 3
5. When `hasError` is true, add `border-red-500/50`

**FormError.tsx**:

1. Create `src/components/atoms/FormError.tsx`
2. Props interface:
   ```typescript
   interface Props {
     message?: string
   }
   ```
3. If `message` is falsy, return `null`
4. Render: `<p className="text-caption text-red-400 mt-1">{message}</p>`

**Project context**:

- Atom convention: function declaration, default export, `Props` interface above component (see `FAB.tsx`, `StatCard.tsx`, `SearchInput.tsx`)
- `.input` CSS class defined in `src/index.css` lines 364-384: `bg-surface`, `border border-border`, `rounded`, `px-3 py-2`, focus ring
- Design system: cobalt blue for on-state (`bg-primary`), `gray-700` for off-state
- Tailwind v4 CSS-first config — use Tailwind utility classes in JSX
- `focus-visible` for buttons (G-8), `focus` for inputs (G-8)
- No semicolons, single quotes, trailing commas

**Dependencies**: None (independent — only uses CSS classes already defined in `index.css`)

**Acceptance criteria**:

- All four files compile without TypeScript errors
- `Toggle` renders a switch with keyboard accessibility (`role="switch"`, `aria-checked`)
- `SelectInput` uses `.input` styling and renders native `<select>` with options
- `TextareaInput` uses `.input` styling, supports `rows` and `placeholder`
- `FormError` renders red text below field, returns null when no message
- All components follow project naming conventions (PascalCase files, `Props` interface, function declarations, default exports)

---

#### TASK-004: Create Form Molecule Components

**Description**: Create `FormField`, `FormSection`, and `ConfirmDialog` molecule components.

**Affected files**:

- `src/components/molecules/FormField.tsx` (**new**)
- `src/components/molecules/FormSection.tsx` (**new**)
- `src/components/molecules/ConfirmDialog.tsx` (**new**)

**Implementation instructions**:

**FormField.tsx**:

1. Create `src/components/molecules/FormField.tsx`
2. Props interface:
   ```typescript
   interface Props {
     label: string
     htmlFor?: string
     required?: boolean
     error?: string
     children: ReactNode
   }
   ```
3. Render a vertical stack: `<div className="flex flex-col gap-1">` containing:
   - `<label>` with `className="text-label text-foreground-muted uppercase tracking-wider"` and `htmlFor` prop
   - If `required`, append ` *` to the label text (or render a `<span className="text-red-400">*</span>`)
   - `{children}` — the actual input component
   - `<FormError message={error} />`

**FormSection.tsx**:

1. Create `src/components/molecules/FormSection.tsx`
2. Props interface:
   ```typescript
   interface Props {
     title: string
     children: ReactNode
   }
   ```
3. Render: follows the pattern of `GuestDetailSection.tsx` (lines 8-16) but adapted for forms:
   ```tsx
   <div className="border-t border-border pt-4 mt-6">
     <h3 className="text-label text-foreground-muted uppercase tracking-wider">
       {title}
     </h3>
     <div className="mt-4 flex flex-col gap-4">{children}</div>
   </div>
   ```

**ConfirmDialog.tsx**:

1. Create `src/components/molecules/ConfirmDialog.tsx`
2. Props interface:
   ```typescript
   interface Props {
     title: string
     targetName: string
     message: string
     confirmLabel?: string
     cancelLabel?: string
     onConfirm: () => void
     onCancel: () => void
   }
   ```
3. Render a fixed overlay: `<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">`
4. Inside, a dialog card: `<div className="bg-surface border border-border rounded max-w-md w-full mx-4 p-6">`
5. Content:
   - Warning icon (inline SVG triangle with `!`) + title in `text-heading-5 text-foreground-heading`
   - Target line: `<p className="text-body-sm text-foreground mt-2">TARGET: {targetName}</p>`
   - Message: `<p className="text-body-sm text-foreground-muted mt-3">{message}</p>`
   - Button row: `<div className="flex justify-end gap-3 mt-6">`
     - Cancel: `<button className="btn-secondary">{cancelLabel ?? 'CANCEL'}</button>`
     - Confirm: `<button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded font-semibold text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">{confirmLabel ?? 'CONFIRM_DEL'}</button>`
6. Clicking the overlay background (outside the card) calls `onCancel`
7. Add `onClick={(e) => e.stopPropagation()}` on the card to prevent bubble

**Project context**:

- Molecule convention: function declaration, default export, `Props` interface (see `GuestDetailSection.tsx`, `SidebarNavItem.tsx`)
- Import `FormError` from `'../atoms/FormError'`
- Import `type { ReactNode } from 'react'` — must use `import type` due to `verbatimModuleSyntax`
- Existing `GuestDetailSection.tsx` pattern: `border-t border-border pt-4 mt-4`, `text-label text-foreground-muted uppercase tracking-wider`
- Delete confirm button uses red (`bg-red-600`) as exception to cobalt-only accent (DD-7, spec note)
- No semicolons, single quotes, trailing commas

**Dependencies**: TASK-003 (needs `FormError` atom)

**Acceptance criteria**:

- All three files compile without TypeScript errors
- `FormField` renders label + children + error in a vertical stack
- `FormSection` groups fields under a heading with top border separator
- `ConfirmDialog` renders a modal overlay with dark backdrop, card, and two buttons
- Confirm button is red (destructive action)
- Clicking overlay background closes the dialog
- All components follow project conventions

---

#### TASK-005: Create EmptyState Organism

**Description**: Create the empty guest list placeholder component with a call-to-action to add the first guest.

**Affected files**:

- `src/components/organisms/EmptyState.tsx` (**new**)

**Implementation instructions**:

1. Create `src/components/organisms/EmptyState.tsx`
2. Props interface:
   ```typescript
   interface Props {
     onAddGuest: () => void
   }
   ```
3. Render a centered container: `<div className="flex-1 flex flex-col items-center justify-center py-16 px-4">`
4. Content:
   - Diamond/hexagon icon: an inline SVG (diamond shape outline), `className="text-foreground-muted mb-4"`, size ~40x40
   - Heading: `<h3 className="text-heading-4 text-foreground-heading">NO_RECORDS // INITIALIZE_DB</h3>`
   - Description: `<p className="text-body-sm text-foreground-muted mt-2 text-center">Begin population sequence to activate guest matrix</p>`
   - CTA button: `<button className="btn-primary mt-6 flex items-center gap-2" onClick={onAddGuest}>` with a small `+` SVG icon and text `NEW_ENTRY`
5. The button has `cursor-pointer` (already in `.btn-primary`)

**Project context**:

- Organism convention: function declaration, default export, `Props` interface (see `GuestListHeader.tsx`, `GuestTable.tsx`)
- `.btn-primary` class from `index.css` lines 279-304
- Cyberpunk aesthetic: uppercase, underscores, technical-sounding codes (G-14, project practice)
- `text-heading-4`: 20px, font-weight 600 (from `index.css` line 221)
- `text-body-sm`: 14px, font-weight 400 (from `index.css` line 249)

**Dependencies**: None (independent)

**Acceptance criteria**:

- File compiles without TypeScript errors
- Renders centered empty state with icon, heading, description, and CTA button
- CTA button calls `onAddGuest` when clicked
- Uses cyberpunk naming convention
- Uses design system typography classes

---

#### TASK-006: Create GuestForm Organism

**Description**: Create the full add/edit guest form organism with react-hook-form integration, all form sections, conditional fields, and action buttons.

**Affected files**:

- `src/components/organisms/GuestForm.tsx` (**new**)

**Implementation instructions**:

1. Create `src/components/organisms/GuestForm.tsx`
2. Imports:
   ```typescript
   import { useForm } from 'react-hook-form'
   import type { Guest, GuestStatus } from '../../data/mock-guests'
   import FormField from '../molecules/FormField'
   import FormSection from '../molecules/FormSection'
   import ConfirmDialog from '../molecules/ConfirmDialog'
   import Toggle from '../atoms/Toggle'
   import SelectInput from '../atoms/SelectInput'
   import TextareaInput from '../atoms/TextareaInput'
   import { useState } from 'react'
   ```
3. Define `GuestFormValues` interface (flat form values):
   ```typescript
   interface GuestFormValues {
     firstName: string
     lastName: string
     role: string
     status: GuestStatus
     accessLevel: string
     tableAssignment: string
     seatNumber: string
     dietaryType: string
     dietaryNotes: string
     shuttleRequired: boolean
     shuttleFrom: string
     lodgingBooked: boolean
     lodgingVenue: string
   }
   ```
4. Props interface:
   ```typescript
   interface Props {
     guest?: Guest
     onSubmit: (data: Omit<Guest, 'id'>) => void
     onDelete?: (id: string) => void
     onCancel: () => void
   }
   ```
5. Component setup:
   - Determine mode: `const isEdit = !!guest`
   - Initialize `useForm<GuestFormValues>` with `defaultValues` derived from `guest` prop (if edit) or default empty values
   - Default values for add mode: `firstName: ''`, `lastName: ''`, `role: ''`, `status: 'PENDING' as GuestStatus`, `accessLevel: ''`, `tableAssignment: ''`, `seatNumber: ''`, `dietaryType: ''`, `dietaryNotes: ''`, `shuttleRequired: false`, `shuttleFrom: ''`, `lodgingBooked: false`, `lodgingVenue: ''`
   - Default values for edit mode: flatten `guest` data — `seatNumber: guest.seatNumber?.toString() ?? ''`, `dietaryType: guest.dietary.type ?? ''`, `dietaryNotes: guest.dietary.notes ?? ''`, `shuttleRequired: guest.logistics.shuttleRequired`, `shuttleFrom: guest.logistics.shuttleFrom ?? ''`, `lodgingBooked: guest.logistics.lodgingBooked`, `lodgingVenue: guest.logistics.lodgingVenue ?? ''`
6. Watch `shuttleRequired` and `lodgingBooked` for conditional field visibility:
   ```typescript
   const shuttleRequired = watch('shuttleRequired')
   const lodgingBooked = watch('lodgingBooked')
   ```
7. State for delete confirmation dialog:
   ```typescript
   const [showDeleteDialog, setShowDeleteDialog] = useState(false)
   ```
8. Submit handler — transforms `GuestFormValues` to `Omit<Guest, 'id'>`:
   ```typescript
   const handleFormSubmit = (values: GuestFormValues) => {
     const guestData: Omit<Guest, 'id'> = {
       firstName: values.firstName,
       lastName: values.lastName,
       role: values.role,
       status: values.status,
       accessLevel: values.accessLevel,
       tableAssignment: values.tableAssignment || null,
       seatNumber: values.seatNumber ? parseInt(values.seatNumber, 10) : null,
       dietary: {
         type: values.dietaryType || null,
         notes: values.dietaryNotes || null,
       },
       logistics: {
         shuttleRequired: values.shuttleRequired,
         shuttleFrom: values.shuttleFrom || null,
         lodgingBooked: values.lodgingBooked,
         lodgingVenue: values.lodgingVenue || null,
       },
     }
     onSubmit(guestData)
   }
   ```
9. Render form with `<form onSubmit={handleSubmit(handleFormSubmit)} noValidate>`:
   - **Header**: `<div className="px-4 md:px-6 py-4 md:py-6">` with:
     - `<p className="text-label text-primary tracking-wider">{isEdit ? 'EDIT_ENTRY // MODIFICATION' : 'NEW_GUEST_ENTRY // REGISTRATION'}</p>`
     - `<h1 className="text-heading-1 text-foreground-heading mt-1">{isEdit ? 'MODIFY_RECORD' : 'NEW_ENTRY'}</h1>`
   - **Form body**: `<div className="px-4 md:px-6 pb-6">`
   - **Section 1 — IDENTITY_MATRIX**:
     - `FormField` for FIRST_NAME: `<input className="input w-full" {...register('firstName', { required: true })} placeholder="ENTER_DESIGNATION..." />` — pass `error={errors.firstName ? 'REQUIRED_FIELD // FIRST_NAME CANNOT BE EMPTY' : undefined}` and `hasError` class: add `border-red-500/50` to input when `errors.firstName`
     - `FormField` for LAST_NAME: same pattern with `register('lastName', { required: true })`
     - `FormField` for ROLE_DESIGNATION: `<input className="input w-full" {...register('role')} placeholder="E.G. PRIORITY VIP..." />`
   - **Section 2 — STATUS_CLASSIFICATION**:
     - `FormField` for STATUS: Use `SelectInput` with `options={[{ value: 'PENDING', label: 'PENDING' }, { value: 'CONFIRMED', label: 'CONFIRMED' }, { value: 'DECLINED', label: 'DECLINED' }]}`. Wire via `register('status', { required: true })` or use Controller pattern — for simplicity with native select, use `register` directly on a native `<select>` element styled with `.input` class, or wire `SelectInput` via `setValue`/`watch`. Recommendation: use `register` on native `<select>` inside `SelectInput` by spreading the register return. This requires `SelectInput` to accept `React.SelectHTMLAttributes` via a ref forwarding pattern, OR simply render a native `<select>` inline here with `.input` class and `{...register('status', { required: true })}`.
     - `FormField` for ACCESS_LEVEL: `<input className="input w-full" {...register('accessLevel')} placeholder="E.G. TIER_01..." />`
   - **Section 3 — SEATING_ALLOCATION**:
     - `FormField` for TABLE_ID: `<input className="input w-full" {...register('tableAssignment')} placeholder="E.G. TABLE_04..." />`
     - `FormField` for SEAT_POSITION: `<input className="input w-full" type="number" {...register('seatNumber')} placeholder="E.G. 01..." />`
   - **Section 4 — DIETARY_PROTOCOL**:
     - `FormField` for DIETARY_TYPE: `<input className="input w-full" {...register('dietaryType')} placeholder="E.G. VEGAN..." />`
     - `FormField` for DIETARY_NOTES: `<textarea className="input w-full resize-none" rows={3} {...register('dietaryNotes')} placeholder="ADDITIONAL_NOTES..." />`
   - **Section 5 — LOGISTICS_CONFIG**:
     - `FormField` for SHUTTLE_REQUIRED: Use `Toggle` component. Since `react-hook-form`'s `register` doesn't directly work with custom toggle, use `watch` + `setValue`:
       ```tsx
       <Toggle
         checked={shuttleRequired}
         onChange={(val) => setValue('shuttleRequired', val)}
       />
       ```
     - Conditional: `{shuttleRequired && <FormField label="SHUTTLE_ORIGIN">...register('shuttleFrom')...</FormField>}`
     - `FormField` for LODGING_STATUS: `Toggle` same pattern
     - Conditional: `{lodgingBooked && <FormField label="LODGING_VENUE">...register('lodgingVenue')...</FormField>}`
   - **Action buttons**: `<div className="flex justify-end gap-3 mt-8 px-4 md:px-6 pb-6">`
     - Cancel: `<button type="button" className="btn-secondary" onClick={onCancel}>CANCEL</button>`
     - Delete (edit mode only): `{isEdit && <button type="button" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded font-semibold text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2" onClick={() => setShowDeleteDialog(true)}>DELETE</button>}`
     - Submit: `<button type="submit" className="btn-primary">SAVE_ENTRY</button>`
10. Render `ConfirmDialog` when `showDeleteDialog` is true:
    ```tsx
    {
      showDeleteDialog && (
        <ConfirmDialog
          title="CONFIRM_DELETION"
          targetName={`${guest!.firstName} ${guest!.lastName}`}
          message="This action is irreversible. Guest record will be permanently removed from the database."
          onConfirm={() => onDelete?.(guest!.id)}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )
    }
    ```

**Project context**:

- `react-hook-form`: use `useForm`, `register`, `handleSubmit`, `watch`, `setValue`, `formState: { errors }`
- `.input` class from `index.css`: `bg-surface border border-border rounded px-3 py-2 text-foreground` with focus ring
- Cyberpunk labels: FIRST_NAME, LAST_NAME, ROLE_DESIGNATION, STATUS, ACCESS_LEVEL, TABLE_ID, SEAT_POSITION, DIETARY_TYPE, DIETARY_NOTES, SHUTTLE_REQUIRED, SHUTTLE_ORIGIN, LODGING_STATUS, LODGING_VENUE (from spec table lines 337-353)
- Placeholder text from spec table: `ENTER_DESIGNATION...`, `E.G. PRIORITY VIP...`, etc.
- Validation error style: `text-caption text-red-400`, input border `border-red-500/50` (spec line 355)
- Form component in `src/components/organisms/` — follows organism convention
- TypeScript strict mode — no implicit any, proper type annotations

**Dependencies**: TASK-003 (atoms), TASK-004 (molecules)

**Acceptance criteria**:

- Form renders all 13 fields organized in 5 sections
- `firstName` and `lastName` have required validation via react-hook-form
- `status` defaults to `PENDING` and has required validation
- Conditional fields (SHUTTLE_ORIGIN, LODGING_VENUE) show/hide based on toggle state
- Edit mode pre-populates all fields from guest data
- Edit mode shows DELETE button; add mode does not
- DELETE button opens ConfirmDialog
- Submit transforms flat form values to nested Guest shape
- Cancel button calls `onCancel`
- Form submission calls `onSubmit` with transformed data
- Inline validation errors appear below required fields on submit attempt
- All labels use cyberpunk naming convention
- Form is responsive (single column, full width on mobile)
- TypeScript compiles without errors

---

#### TASK-007: Refactor Routing and App Shell

**Description**: Refactor `main.tsx` and `App.tsx` to introduce React Router route definitions for `/guests/new` and `/guests/:id/edit`. Convert `App.tsx` into a layout route component that provides the shared app shell (TopNav, LeftSidebar, BottomTabBar, FAB) and renders child routes via `<Outlet />`. Replace mock data imports with `guest-store.ts`. Wire up all CRUD operations, callbacks, and navigation.

**Affected files**:

- `src/main.tsx` (modified)
- `src/App.tsx` (modified)

**Implementation instructions**:

**`src/main.tsx`** — Replace BrowserRouter + App with route-based setup:

1. Replace current contents with:

   ```typescript
   import { StrictMode } from 'react'
   import { createRoot } from 'react-dom/client'
   import { BrowserRouter, Routes, Route } from 'react-router'
   import './index.css'
   import App from './App.tsx'
   import AddGuestPage from './pages/AddGuestPage.tsx'
   import EditGuestPage from './pages/EditGuestPage.tsx'

   createRoot(document.getElementById('root')!).render(
     <StrictMode>
       <BrowserRouter>
         <Routes>
           <Route element={<App />}>
             <Route index element={null} />
             <Route path="guests/new" element={<AddGuestPage />} />
             <Route path="guests/:id/edit" element={<EditGuestPage />} />
           </Route>
         </Routes>
       </BrowserRouter>
     </StrictMode>,
   )
   ```

   Note: The `index` route renders `null` because the home page content (guest list / canvas tabs) is rendered directly by `App.tsx` when no child route matches. We detect this via `useMatch` or by checking `Outlet` rendering.

**`src/App.tsx`** — Convert to layout route with state management:

1. Remove all imports from `'./data/mock-guests'`
2. Add imports:
   ```typescript
   import { useState, useEffect, useCallback } from 'react'
   import {
     useSearchParams,
     useNavigate,
     useLocation,
     Outlet,
   } from 'react-router'
   import {
     getGuests,
     addGuest as storeAddGuest,
     updateGuest as storeUpdateGuest,
     deleteGuest as storeDeleteGuest,
     getConfirmedCount,
     getPendingCount,
     getConfirmationRate,
     getDietaryFlagCount,
     getTotalGuests,
     getWaitlistCount,
   } from './data/guest-store'
   import type { Guest } from './data/mock-guests'
   ```
   (Plus existing component imports)
3. Add `EmptyState` import: `import EmptyState from './components/organisms/EmptyState'`
4. State management changes:
   - Add `const [guests, setGuests] = useState<Guest[]>(() => getGuests())`
   - Add `const navigate = useNavigate()`
   - Add `const location = useLocation()`
   - Detect if a child route is active: `const isChildRoute = location.pathname.startsWith('/guests/')` — when true, render `<Outlet />` instead of the home page content
   - Handle `selectedGuestId` from navigation state (for post-edit auto-select):
     ```typescript
     useEffect(() => {
       const state = location.state as { selectedGuestId?: string } | null
       if (state?.selectedGuestId) {
         setSelectedGuestId(state.selectedGuestId)
         // Clear the state to prevent re-selecting on refresh
         window.history.replaceState({}, '')
       }
     }, [location.state])
     ```
5. CRUD callbacks:

   ```typescript
   const handleAddGuest = useCallback(
     (data: Omit<Guest, 'id'>) => {
       storeAddGuest(data)
       setGuests(getGuests())
       navigate('/?tab=guests', { replace: true })
     },
     [navigate],
   )

   const handleUpdateGuest = useCallback(
     (id: string, data: Omit<Guest, 'id'>) => {
       storeUpdateGuest(id, data)
       setGuests(getGuests())
       navigate('/?tab=guests', { state: { selectedGuestId: id } })
     },
     [navigate],
   )

   const handleDeleteGuest = useCallback(
     (id: string) => {
       storeDeleteGuest(id)
       setGuests(getGuests())
       setSelectedGuestId(null)
       navigate('/?tab=guests', { replace: true })
     },
     [navigate],
   )
   ```

6. Navigation callbacks for components:

   ```typescript
   const handleNavigateToAdd = useCallback(() => {
     navigate('/guests/new')
   }, [navigate])

   const handleNavigateToEdit = useCallback(
     (id: string) => {
       navigate(`/guests/${id}/edit`)
     },
     [navigate],
   )
   ```

7. Update `selectedGuest`:
   ```typescript
   const selectedGuest = guests.find((g) => g.id === selectedGuestId) ?? null
   ```
8. Compute stats from the `guests` state array (not from store functions, since we already have the data in state):
   ```typescript
   const confirmedCount = guests.filter((g) => g.status === 'CONFIRMED').length
   const pendingCount = guests.filter((g) => g.status === 'PENDING').length
   const totalGuests = guests.length
   const waitlistCount = pendingCount
   const confirmationRate =
     totalGuests > 0 ? Math.round((confirmedCount / totalGuests) * 100) : 0
   const dietaryFlagCount = guests.filter((g) => g.dietary.type !== null).length
   ```
   (Or keep using store stat functions — either approach works. Using state-derived is more efficient since we already have the array.)
9. JSX structure — refactor `return` to be a layout route:
   ```tsx
   return (
     <div className="flex flex-col h-screen overflow-hidden">
       <TopNav ... />
       <div className="flex flex-1 overflow-hidden">
         <LeftSidebar onAddGuest={handleNavigateToAdd} />
         <main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
           {isChildRoute ? (
             <Outlet context={{ guests, onAdd: handleAddGuest, onUpdate: handleUpdateGuest, onDelete: handleDeleteGuest, onCancel: () => navigate(-1) }} />
           ) : (
             // existing tab content
             activeTab === 'guests' ? (
               guests.length === 0 ? (
                 <EmptyState onAddGuest={handleNavigateToAdd} />
               ) : (
                 <>
                   <GuestListHeader ... />
                   <GuestTable guests={guests} ... searchQuery={searchQuery} />
                   <GuestListFooterStats ... />
                 </>
               )
             ) : (
               <div className="flex-1 flex items-center justify-center text-foreground-muted text-label tracking-wider">
                 {activeTab.toUpperCase()} // MODULE_OFFLINE
               </div>
             )
           )}
         </main>
         {selectedGuest && activeTab === 'guests' && !isChildRoute && (
           <GuestDetailPanel
             guest={selectedGuest}
             onClose={() => setSelectedGuestId(null)}
             onUpdate={() => handleNavigateToEdit(selectedGuest.id)}
             onDelete={() => handleDeleteGuest(selectedGuest.id)}
           />
         )}
       </div>
       {!isChildRoute && <FAB onClick={handleNavigateToAdd} label="Add guest" />}
       <BottomTabBar activeTab={activeTab} onTabChange={onTabChange} />
     </div>
   )
   ```
10. Pass stat values to `GuestListHeader` and `GuestListFooterStats` from computed values instead of mock-guests functions
11. Pass empty state: When `guests.length === 0` and `activeTab === 'guests'`, render `<EmptyState>` instead of the header+table+footer combo. The `GuestTable` search empty state ("NO_RESULTS // QUERY_MISMATCH") is separate and only applies when `guests.length > 0` but search yields no results.

**Project context**:

- React Router ^7.14.0 — uses `react-router` package (not `react-router-dom`). Imports: `BrowserRouter`, `Routes`, `Route`, `Outlet`, `useNavigate`, `useLocation`, `useParams`, `useSearchParams` all from `'react-router'`
- Current `main.tsx` wraps `<App />` in `<BrowserRouter>` — keep `BrowserRouter` in `main.tsx`, add `<Routes>` and `<Route>` inside it
- Current `App.tsx` uses `useSearchParams` for tab switching — this must continue working at root `/`
- `Outlet` context provides data to child routes (AddGuestPage, EditGuestPage)
- `useOutletContext` hook used in page components to access the context
- `location.state` for passing `selectedGuestId` after edit redirect (DD-9)
- `navigate('/?tab=guests', { replace: true })` for add form post-submission (DD-9)
- Existing `FAB` component already accepts `onClick` prop — just change the callback
- `useCallback` for stable function references passed as props

**Dependencies**: TASK-002 (guest-store), TASK-005 (EmptyState), TASK-008 (page components — but pages depend on this task too, so these are co-dependent; implement main.tsx and App.tsx first since pages import from context)

**Acceptance criteria**:

- `main.tsx` defines routes: index (`/`), `/guests/new`, `/guests/:id/edit` all under `App` layout
- `App.tsx` renders shared shell (TopNav, LeftSidebar, BottomTabBar) for all routes
- Child routes render in main content area via `<Outlet />`
- Existing tab switching (`/?tab=guests`, `/?tab=canvas`) still works at root `/`
- Guest list reads from localStorage via `guest-store.ts` (not mock data)
- Empty guest list shows `EmptyState` component
- Stats are computed from localStorage data
- FAB hidden when child route is active
- Detail panel hidden when child route is active
- Navigation callbacks wired: sidebar ADD GUEST, FAB, detail panel UPDATE
- CRUD operations update both localStorage and React state
- Post-add redirects to `/?tab=guests` with history replace
- Post-edit redirects to `/?tab=guests` with selected guest
- Post-delete redirects to `/?tab=guests`
- TypeScript compiles without errors

---

#### TASK-008: Create Page Components (AddGuestPage, EditGuestPage)

**Description**: Create thin page wrapper components for the add and edit guest routes. These extract route params and outlet context, then render `GuestForm` with the appropriate props.

**Affected files**:

- `src/pages/AddGuestPage.tsx` (**new**)
- `src/pages/EditGuestPage.tsx` (**new**)

**Implementation instructions**:

**`src/pages/AddGuestPage.tsx`**:

1. Create `src/pages/AddGuestPage.tsx`
2. Import:
   ```typescript
   import { useOutletContext } from 'react-router'
   import type { Guest } from '../data/mock-guests'
   import GuestForm from '../components/organisms/GuestForm'
   ```
3. Define outlet context type:
   ```typescript
   interface OutletContext {
     guests: Guest[]
     onAdd: (data: Omit<Guest, 'id'>) => void
     onUpdate: (id: string, data: Omit<Guest, 'id'>) => void
     onDelete: (id: string) => void
     onCancel: () => void
   }
   ```
4. Component:
   ```typescript
   function AddGuestPage() {
     const { onAdd, onCancel } = useOutletContext<OutletContext>()
     return <GuestForm onSubmit={onAdd} onCancel={onCancel} />
   }
   export default AddGuestPage
   ```

**`src/pages/EditGuestPage.tsx`**:

1. Create `src/pages/EditGuestPage.tsx`
2. Import:
   ```typescript
   import { useParams, useOutletContext, useNavigate } from 'react-router'
   import { useEffect } from 'react'
   import type { Guest } from '../data/mock-guests'
   import GuestForm from '../components/organisms/GuestForm'
   ```
3. Same `OutletContext` type as above
4. Component:

   ```typescript
   function EditGuestPage() {
     const { id } = useParams<{ id: string }>()
     const navigate = useNavigate()
     const { guests, onUpdate, onDelete, onCancel } = useOutletContext<OutletContext>()

     const guest = guests.find((g) => g.id === id)

     // Edge case: invalid/non-existent guest ID → silent redirect
     useEffect(() => {
       if (!guest) {
         navigate('/?tab=guests', { replace: true })
       }
     }, [guest, navigate])

     if (!guest) return null

     return (
       <GuestForm
         guest={guest}
         onSubmit={(data) => onUpdate(id!, data)}
         onDelete={onDelete}
         onCancel={onCancel}
       />
     )
   }
   export default EditGuestPage
   ```

**Project context**:

- `useOutletContext` from `'react-router'` — typed generic to access layout route context
- `useParams` returns `{ id: string }` for `/guests/:id/edit`
- Edge case from spec (Edge Case 1): non-existent guest ID redirects silently to `/?tab=guests`
- Page files go in `src/pages/` directory (**new directory**) — this is a new convention for route-level components distinct from the atomic design component hierarchy
- Function declaration, default export convention

**Dependencies**: TASK-006 (GuestForm), TASK-007 (App layout with Outlet context)

**Acceptance criteria**:

- `AddGuestPage` renders `GuestForm` in add mode (no guest prop)
- `EditGuestPage` renders `GuestForm` in edit mode with pre-populated guest data
- Invalid guest ID in edit route silently redirects to guest list
- Both pages access CRUD callbacks via `useOutletContext`
- Both pages access `onCancel` for navigation
- TypeScript compiles without errors

---

#### TASK-009: Update LeftSidebar with `onAddGuest` Callback

**Description**: Modify `LeftSidebar` to accept and use an `onAddGuest` callback prop for the ADD GUEST button.

**Affected files**:

- `src/components/organisms/LeftSidebar.tsx` (modified)

**Implementation instructions**:

1. Add `Props` interface:
   ```typescript
   interface Props {
     onAddGuest: () => void
   }
   ```
2. Update function signature: `function LeftSidebar({ onAddGuest }: Props)`
3. Replace the no-op `onClick={() => {}}` on line 24 with `onClick={onAddGuest}`
4. No other changes needed

**Project context**:

- Current code (lines 22-41): button has `onClick={() => {}}` — replace with prop callback
- Follow existing component pattern: `Props` interface above function, destructured in params
- Component already has correct styling, icon SVG, and button text

**Dependencies**: None (independent — the prop is wired by TASK-007 which imports this)

**Acceptance criteria**:

- `LeftSidebar` accepts `onAddGuest` prop
- ADD GUEST button calls `onAddGuest` when clicked
- No visual changes
- TypeScript compiles without errors

---

#### TASK-010: Update GuestDetailPanel with `onUpdate` and `onDelete` Callbacks

**Description**: Modify `GuestDetailPanel` to accept `onUpdate` and `onDelete` callback props. Wire the UPDATE button to `onUpdate`. Add a DELETE button that triggers `onDelete` with confirmation.

**Affected files**:

- `src/components/organisms/GuestDetailPanel.tsx` (modified)

**Implementation instructions**:

1. Add `useState` import: `import { useState } from 'react'`
2. Add `ConfirmDialog` import: `import ConfirmDialog from '../molecules/ConfirmDialog'`
3. Update `Props` interface:
   ```typescript
   interface Props {
     guest: Guest
     onClose: () => void
     onUpdate: () => void
     onDelete: () => void
   }
   ```
4. Update function signature: `function GuestDetailPanel({ guest, onClose, onUpdate, onDelete }: Props)`
5. Add delete confirmation state: `const [showDeleteDialog, setShowDeleteDialog] = useState(false)`
6. **Mobile action buttons** (lines 42-45): Replace:
   ```tsx
   <button className="btn-secondary flex-1">CONTACT</button>
   <button className="btn-primary flex-1">UPDATE</button>
   ```
   With:
   ```tsx
   <button className="btn-secondary flex-1">CONTACT</button>
   <button
     type="button"
     className="bg-red-600 hover:bg-red-700 text-white flex-1 px-5 py-2.5 rounded font-semibold text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
     onClick={() => setShowDeleteDialog(true)}
   >
     DELETE
   </button>
   <button className="btn-primary flex-1" onClick={onUpdate}>UPDATE</button>
   ```
7. **Desktop action buttons** (lines 75-78): Same replacement pattern as mobile
8. **ConfirmDialog**: Add at the end of the component (inside the fragment), before the closing `</>`:
   ```tsx
   {
     showDeleteDialog && (
       <ConfirmDialog
         title="CONFIRM_DELETION"
         targetName={`${guest.firstName} ${guest.lastName}`}
         message="This action is irreversible. Guest record will be permanently removed from the database."
         onConfirm={onDelete}
         onCancel={() => setShowDeleteDialog(false)}
       />
     )
   }
   ```

**Project context**:

- Current code has two parallel button sets: mobile (line 42-45) and desktop (line 75-78)
- Both sets must be updated identically
- Delete button uses red `bg-red-600` (design exception per DD-7)
- CONTACT button remains non-functional (out of scope)
- `ConfirmDialog` imported from `'../molecules/ConfirmDialog'`
- Confirmation flow: click DELETE → show dialog → CONFIRM removes guest, CANCEL closes dialog

**Dependencies**: TASK-004 (needs ConfirmDialog molecule)

**Acceptance criteria**:

- `GuestDetailPanel` accepts `onUpdate` and `onDelete` props
- UPDATE button calls `onUpdate` (both mobile and desktop)
- DELETE button appears in both mobile and desktop views
- DELETE button opens confirmation dialog
- Confirming deletion calls `onDelete`
- Canceling deletion closes the dialog
- CONTACT button unchanged (still non-functional)
- TypeScript compiles without errors

---

### Execution Order

```
Phase 1 — Independent (parallel):
  TASK-001: Install dependencies
  TASK-003: Create form atom components (Toggle, SelectInput, TextareaInput, FormError)
  TASK-005: Create EmptyState organism
  TASK-009: Update LeftSidebar with onAddGuest callback

Phase 2 — Depends on Phase 1:
  TASK-002: Create guest-store.ts (depends on TASK-001 for uuid)
  TASK-004: Create form molecule components (depends on TASK-003 for FormError)
  TASK-010: Update GuestDetailPanel (depends on TASK-004 for ConfirmDialog)

Phase 3 — Depends on Phase 2:
  TASK-006: Create GuestForm organism (depends on TASK-003, TASK-004)

Phase 4 — Depends on Phase 3:
  TASK-007: Refactor routing and App shell (depends on TASK-002, TASK-005, TASK-006, TASK-009, TASK-010)
  TASK-008: Create page components (depends on TASK-006, TASK-007 — co-dependent, implement together)
```

Note: TASK-007 and TASK-008 are co-dependent (main.tsx imports pages, pages use outlet context from App). They must be implemented in the same phase. The recommended approach is to implement TASK-007 first (since it defines the context shape), then TASK-008 immediately after.

---

### Verification Checklist

- [ ] `npm install` runs without errors after TASK-001
- [ ] `npx tsc -b` compiles without errors after all tasks
- [ ] `npm run lint` passes after all tasks
- [ ] `npx prettier --check .` passes after all tasks
- [ ] App loads at `/` with an empty guest list (EmptyState shown)
- [ ] Clicking "NEW_ENTRY" in EmptyState navigates to `/guests/new`
- [ ] Clicking "ADD GUEST" in sidebar navigates to `/guests/new`
- [ ] Tapping FAB on mobile navigates to `/guests/new`
- [ ] Add guest form shows all 13 fields in 5 sections
- [ ] Submitting with empty first name shows inline validation error
- [ ] Submitting with empty last name shows inline validation error
- [ ] Submitting with all required fields creates guest in localStorage
- [ ] After adding, redirected to `/?tab=guests` with guest in list
- [ ] Page reload preserves guest data
- [ ] Clicking guest row opens detail panel
- [ ] Detail panel UPDATE button navigates to `/guests/:id/edit`
- [ ] Edit form pre-populates all fields
- [ ] Modifying and submitting updates guest in localStorage
- [ ] After editing, redirected to `/?tab=guests` with guest selected
- [ ] DELETE button in edit form opens confirmation dialog
- [ ] DELETE button in detail panel opens confirmation dialog
- [ ] Confirming delete removes guest from localStorage and list
- [ ] Cancel on delete dialog closes it without action
- [ ] CANCEL button on form navigates back
- [ ] Shuttle From field shows/hides with Shuttle Required toggle
- [ ] Lodging Venue field shows/hides with Lodging Booked toggle
- [ ] Navigating to `/guests/INVALID-ID/edit` redirects to `/?tab=guests`
- [ ] Stats (confirmed, pending, confirmation rate, dietary flags) reflect current data
- [ ] Tab switching (`/?tab=guests`, `/?tab=canvas`) still works
- [ ] Mobile layout: form is single-column, bottom tab bar visible
- [ ] All form labels use cyberpunk uppercase convention

## Notes

- The existing `src/data/mock-guests.ts` file retains the `Guest` and `GuestStatus` type definitions. The mock data array and stat helper functions are superseded by `guest-store.ts` but the file is not deleted — it serves as the type definition source. Existing component imports of `type { Guest }` from `../../data/mock-guests` remain valid.
- Two new npm packages must be installed: `npm install react-hook-form uuid` and `npm install -D @types/uuid`.
- React Router configuration must be updated to define routes for `/guests/new` and `/guests/:id/edit`. A layout route should wrap both the existing root route (which handles tab switching) and the new form routes, providing the shared app shell (TopNav, LeftSidebar). The `GuestForm` page components use `useParams` (for the guest ID in edit mode) and `useNavigate` (for post-submission redirects).
- The existing tab-switching mechanism (`/?tab=guests`, `/?tab=canvas`) in `App.tsx` via `useSearchParams` remains unchanged. The new routes are separate route definitions, not additional tab values.
- Stats in `GuestListHeader` and `GuestListFooterStats` must now be computed from the localStorage-backed data (via `guest-store.ts`), not from the mock data module.
- The CONTACT button in the detail panel remains non-functional (out of scope for this spec, as noted in guest-list-screen spec).
- The delete confirmation button uses red (`bg-red-600`) as an exception to the cobalt-only accent rule. This is a standard destructive action pattern that overrides the design system's accent constraint for UX safety.
- Guest IDs are now UUIDs (e.g., `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"`). The detail panel and guest list can still display a truncated or formatted version of the ID for the cyberpunk aesthetic (e.g., "ID: A1B2C3D4" — first 8 hex chars, uppercased), but the underlying value is a full UUID.

## Changelog

- 2026-04-03: Initial draft
- 2026-04-03: Updated per user feedback — (1) Replaced query-param tab views (`/?tab=add-guest`, `/?tab=edit-guest&id=...`) with dedicated React Router routes (`/guests/new`, `/guests/:id/edit`). Updated DD-1, DD-9, DD-10, DD-11, all affected ACs, edge cases, scope, and notes. (2) Replaced custom `XXXX-XX` ID generation with `uuid` v4 library. Updated DD-5, AC-13, edge case 5, data requirements, and notes. Added `uuid` + `@types/uuid` as new dependencies.
- 2026-04-03: Technical plan added by TPM
- 2026-04-03: Implementation completed — 10 tasks across 4 phases. Validator approved after 2 iterations (4 MAJOR issues fixed: a11y on form inputs, lint error in useEffect, duplicate search filtering, dead code removal). Build, lint, and TypeScript all pass.
- 2026-04-03: Added `gift` field (`number | null`) to Guest interface. New GIFT_REGISTRY form section with GIFT_VALUE number input. Gift displayed in GuestDetailPanel with monetary formatting. Updated DD-8 (6 sections), AC-11, edge case 9, data requirements, and form field table.
