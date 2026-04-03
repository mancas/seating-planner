# Spec: Guest List Screen

## Metadata

- **Slug**: `guest-list-screen`
- **Date**: 2026-04-03
- **Status**: Completed
- **Author**: User
- **Related specs**: [spec/nought-cobalt-design-system.md](./nought-cobalt-design-system.md)

## Description

Build the guest list screen for the wedding seating plan application. This is the first fully functional screen — the default Vite template will be replaced with the actual app shell and the guest list view. The screen is **fully responsive** with distinct desktop and mobile layouts.

### Desktop Layout (>=768px)

A three-panel layout:

1. **Top navigation bar** — Brand, page links (Canvas, Guest List), search input, settings icon, user avatar
2. **Left sidebar** — Session info, navigation items (Properties, Layout, Objects, Export), "Add Guest" button, history link
3. **Main content area** — Guest list header with summary stats, data table of all guests, bottom stat cards (confirmation rate, dietary flags, RSVP deadline)
4. **Right detail panel** — Slides open when a guest row is clicked; shows full guest details with metadata, preferences, logistics, and action buttons

### Mobile Layout (<768px)

A single-column layout with bottom tab bar:

1. **Simplified top bar** — Brand text (PLANNER_V1.0) + settings icon + user avatar only (no nav links, no search)
2. **Header** — "SYSTEM_LOG" label, "GUEST LIST" title, status subtitle (e.g., "STATUS: 124 / 150 CONFIRMED"), two stat cards side-by-side (TOTAL GUESTS + WAITLIST) with cobalt left border accent
3. **Guest list grouped by table** — Each table group shows: location label (e.g., "LOCATION_A"), table name (e.g., "TABLE 01"), seat capacity (e.g., "08/08 SEATS"), then guest rows with seat number, name, role, and status icon (checkmark for confirmed, ellipsis for pending)
4. **FAB (Floating Action Button)** — Bottom-right, cobalt blue, person-add icon (replaces sidebar ADD GUEST button)
5. **Bottom tab bar** — CANVAS, GUESTS (active), TOOLS, MORE (replaces left sidebar navigation)

The UI follows a sci-fi/cyberpunk naming aesthetic (e.g., `REGISTRY.SYSTEM_V4`, `SEATING_01`, `T_04`) consistent with the design reference.

Mock data powers everything — real data integration is out of scope.

## User Stories

1. As a **wedding planner**, I want to see all guests in a data table so that I can quickly scan names, RSVP statuses, and table assignments.
2. As a **wedding planner**, I want to click a guest row to view their full details in a side panel so that I can review dietary needs, logistics, and contact information without leaving the list.
3. As a **wedding planner**, I want to see summary statistics (total confirmed, pending, confirmation rate, dietary flags, RSVP deadline) so that I have an at-a-glance overview of wedding readiness.
4. As a **wedding planner**, I want a search bar in the top nav so that I can quickly find a specific guest by name.
5. As a **wedding planner**, I want an "Add Guest" button in the sidebar so that I have a clear entry point for adding new guests (functionality deferred, button should be present but non-functional beyond visual feedback).
6. As a **wedding planner on mobile**, I want to see guests grouped by table so that I can quickly check the seating arrangement per table.
7. As a **wedding planner on mobile**, I want a bottom tab bar so that I can navigate between app sections with one hand.
8. As a **wedding planner on mobile**, I want a floating action button to add guests so that I always have a visible entry point regardless of scroll position.

## Acceptance Criteria

1. GIVEN the app is loaded at the root URL (`/`) WHEN the page renders THEN the guest list screen is displayed (default tab is `guests` when no `tab` query param is present).

2. GIVEN the guests tab is active (default, or `/?tab=guests`) WHEN the page renders THEN a three-panel layout is visible: top nav bar, left sidebar, and main content area.

3. GIVEN the guest list page is loaded WHEN viewing the top nav THEN the brand text "PLANNER_V1.0" is visible on the left, nav links "CANVAS" and "GUEST LIST" are present, "GUEST LIST" has an active indicator (cobalt underline) because the current tab is `guests` (i.e., `/?tab=guests` or no `tab` param), nav links switch tabs via query params (e.g., clicking "CANVAS" navigates to `/?tab=canvas`, clicking "GUEST LIST" navigates to `/?tab=guests`), a search input with placeholder "SEARCH_DATABASE" is visible, and a settings icon and user avatar are on the right.

4. GIVEN the guest list page is loaded WHEN viewing the left sidebar THEN the session info "SEATING_01 / ACTIVE SESSION" is visible, navigation items (Properties, Layout, Objects, Export) are listed with "Objects" highlighted in cobalt as the active item, an "ADD GUEST" primary button is at the bottom, and a "HISTORY" link is below it.

5. GIVEN the guest list page is loaded WHEN viewing the main content area THEN a header shows the label "REGISTRY.SYSTEM_V4", the title "GUEST_LIST", and summary stat cards displaying "TOTAL CONFIRMED" and "PENDING" counts computed from mock data.

6. GIVEN the guest list page is loaded WHEN viewing the data table THEN columns are: NAME / IDENTIFIER, STATUS, TABLE, ACTIONS — and all mock guests are displayed as rows.

7. GIVEN a guest row in the data table WHEN viewing the row THEN it shows: an initials avatar circle, the guest name in uppercase bold, an ID code (e.g., "ID: 4492-AX"), a status badge, and a table assignment (or "- - -" if unassigned).

8. GIVEN a guest with status "CONFIRMED" WHEN viewing their status badge THEN the badge has a filled cobalt blue background with white text.

9. GIVEN a guest with status "PENDING" WHEN viewing their status badge THEN the badge has an outlined/ghost style (transparent background, cobalt border, cobalt text).

10. GIVEN a guest with status "DECLINED" WHEN viewing their status badge THEN the badge has an outlined style with a muted red/error color treatment.

11. GIVEN the guest list page is loaded WHEN viewing the bottom section THEN three stat cards are visible: "CONFIRMATION RATE" (percentage with progress bar), "DIETARY FLAGS" (count, with urgency indicator), and "RSVP DEADLINE" (countdown, with urgent badge). All values are computed from mock data.

12. GIVEN the data table is displayed WHEN the user clicks a guest row THEN a detail panel slides open on the right side showing full guest information.

13. GIVEN the detail panel is open WHEN viewing its contents THEN it shows: "GUEST_DETAILS" header with a close (X) button, guest avatar/initials, guest name and role/title, Core Metadata (Status, Access Level, Assigned Table), Preferences (Dietary info with notes), Logistics (Shuttle, Lodging), and action buttons ("CONTACT" secondary, "UPDATE" primary).

14. GIVEN the detail panel is open WHEN the user clicks the close (X) button THEN the detail panel closes and no guest row is selected.

15. GIVEN the search input in the top nav WHEN the user types a query THEN the guest list table filters to show only guests whose name matches the search term (case-insensitive substring match).

16. GIVEN the user clicks the "ADD GUEST" button in the sidebar WHEN the button is clicked THEN visual feedback is provided (e.g., button press state) but no actual add-guest flow occurs (placeholder for future feature).

17. GIVEN the app is loaded with `/?tab=canvas` WHEN the page renders THEN the "CANVAS" nav link has the active indicator and the main content area shows a placeholder (Canvas page content is out of scope).

18. GIVEN the app is loaded with an unrecognized `tab` value (e.g., `/?tab=foo`) WHEN the page renders THEN the default `guests` tab is shown.

19. GIVEN the project source code WHEN inspecting the component file structure THEN components follow atomic design organization: `atoms/`, `molecules/`, `organisms/` folders under `src/components/`. No barrel `index.ts` files exist in any folder.

### Mobile-Specific Acceptance Criteria

20. GIVEN the viewport width is below 768px WHEN the page renders THEN the layout switches to a single-column mobile view: no left sidebar, no right detail panel, and a bottom tab bar is visible.

21. GIVEN mobile viewport WHEN viewing the top bar THEN only the brand text "PLANNER_V1.0" (with cobalt dot indicator), settings icon, and user avatar are visible. No nav links (Canvas/Guest List) and no search input appear in the top bar.

22. GIVEN mobile viewport WHEN viewing the header THEN "SYSTEM_LOG" label (cobalt), "GUEST LIST" title, a status subtitle (e.g., "STATUS: X / Y CONFIRMED"), and two side-by-side stat cards ("TOTAL GUESTS" + "WAITLIST") with cobalt left border accent are displayed.

23. GIVEN mobile viewport WHEN viewing the guest list THEN guests are grouped by table assignment. Each group shows: a location label (e.g., "LOCATION_A" in cobalt), a table heading (e.g., "TABLE 01"), a seat capacity indicator (e.g., "08/08 SEATS"), and guest rows within.

24. GIVEN mobile viewport WHEN viewing a guest row within a table group THEN it shows: a seat number (muted, left), guest name (uppercase bold with underscores), role/type below name (muted), and a status icon on the right — cobalt checkmark circle for CONFIRMED, ellipsis/dots icon for PENDING.

25. GIVEN mobile viewport WHEN viewing the bottom of the screen THEN a bottom tab bar with four tabs is visible: CANVAS (pencil icon), GUESTS (person icon, active with cobalt highlight), TOOLS (wrench icon), MORE (dots icon). The active tab has a cobalt background on the icon and cobalt text.

26. GIVEN mobile viewport WHEN viewing the bottom-right area THEN a floating action button (FAB) with a person-add icon is visible above the bottom tab bar. The FAB is cobalt blue and circular.

27. GIVEN mobile viewport WHEN the user taps a guest row THEN the row is highlighted (selected state) but no detail panel opens. (Mobile detail view is out of scope for this spec.)

28. GIVEN mobile viewport WHEN the user taps a different tab in the bottom tab bar THEN the `tab` query param updates accordingly (same query-param mechanism as desktop nav links).

## Scope

### In Scope

- React Router 7 setup with query-param-based tab switching (`/?tab=guests`, `/?tab=canvas`) — app renders at root `/`, default tab is `guests`
- App shell layout: top nav bar, left sidebar (shared chrome — desktop only)
- Guest list main content: header with stats, data table, bottom stat cards
- Guest detail right panel (opens on row click, closes on X — desktop only)
- Search filtering in top nav (filters table by guest name — desktop only)
- Mock data module with 4–6 guests with varied statuses, dietary needs, table assignments, and logistics
- Stat computations from mock data (confirmation rate, dietary flags count, RSVP deadline)
- Status badges with three visual variants: CONFIRMED (filled cobalt), PENDING (outlined cobalt), DECLINED (outlined muted red)
- Cyberpunk/sci-fi naming aesthetic in UI text
- Component organization following atomic design (atoms, molecules, organisms)
- Active states: cobalt underline on "GUEST LIST" nav link, cobalt highlight on "Objects" sidebar item, cobalt left border on selected guest row
- **Responsive mobile layout** (<768px): single-column, bottom tab bar, FAB, table-grouped guest list, simplified top bar, stat cards with cobalt left border
- Bottom tab bar with 4 tabs: CANVAS, GUESTS, TOOLS, MORE
- Floating Action Button (FAB) for add guest on mobile
- Mobile guest rows with seat number, name, role, status icon

### Out of Scope

- Real data integration / API calls / backend
- Add Guest form/flow (button exists but is non-functional)
- Edit/Update guest functionality (button exists but is non-functional)
- Contact guest functionality (button exists but is non-functional)
- Canvas page / route
- Settings page / functionality
- User authentication / avatar functionality
- History page / functionality
- Properties, Layout, Export sidebar nav destinations
- Mobile guest detail view (full-screen detail view on tap — not shown in mobile design, future spec)
- Drag-and-drop or table assignment functionality
- TOOLS and MORE tab destinations (placeholder only)
- Pagination or virtualized scrolling (mock data is small)
- Animation/transition for the detail panel (CSS transitions are acceptable but no spring/physics animation library)

## Edge Cases

1. **No guest selected on initial load**: The detail panel should be hidden. The main content area should occupy the full width (minus the left sidebar).
2. **Search with no results**: When the search query matches no guests, the table body should display an empty state message (e.g., "NO_RESULTS // QUERY_MISMATCH") in the cyberpunk aesthetic. The summary stat cards in the header should still reflect the full dataset, not the filtered view.
3. **Guest with no table assignment**: The TABLE column should display "- - -" (three dashes with spaces) instead of a table code.
4. **Guest with no dietary flags**: The Preferences section in the detail panel should still be visible but show a "NONE" or "NO_RESTRICTIONS" indicator.
5. **Guest with no logistics needs**: The Logistics section in the detail panel should still be visible but show "N/A" for shuttle and lodging fields.
6. **Clicking a different guest while panel is open**: The detail panel should update to show the newly selected guest's data. The previously selected row loses its active indicator and the new row gains it.
7. **Clicking the same guest row while panel is open**: The detail panel should close (toggle behavior).
8. **Search input cleared**: When the search input is emptied, the full guest list is restored.
9. **Guest with no table assignment on mobile**: Shown in an "UNASSIGNED" group at the end of the table-grouped list.
10. **Window resize across breakpoint**: If the viewport crosses the 768px breakpoint (e.g., rotating a tablet), the layout should switch between mobile and desktop without page reload. Selected guest state may be lost on transition — this is acceptable.

## Design Decisions

### DD-1: Three-Panel Layout Architecture

**Decision**: Use a CSS Grid layout for the app shell with four regions: top nav (full width), left sidebar (fixed width), main content (flexible), and right detail panel (fixed width, conditionally rendered).
**Reasoning**: CSS Grid provides clean control over the three-panel layout without complex nesting. The detail panel can be conditionally included in the grid without affecting the other panels. This approach is more maintainable than absolute positioning.

### DD-2: Atomic Design Component Organization

**Decision**: Organize components into `src/components/atoms/`, `src/components/molecules/`, and `src/components/organisms/` folders. No barrel `index.ts` files. **Components are shared between desktop and mobile** — instead of creating separate mobile-specific components, each component uses Tailwind responsive utilities (`hidden md:block`, `md:hidden`, `flex-col md:flex-row`, etc.) to adapt its layout, visibility, and content density to the viewport.
**Reasoning**: User requirement for atomic design + explicit preference to avoid component duplication. A single `GuestRow` component, for example, renders seat number + name + role + status icon on mobile (hiding the ID, status badge, and table column) and the full data-table row on desktop. This keeps the component tree shallow and avoids diverging logic across two parallel component sets.

Shared components with responsive behavior:

- **Atoms**: StatusBadge, Avatar, StatCard, SearchInput, IconButton, NavLink, StatusIcon, FAB, TabBarItem
- **Molecules**: GuestRow (adapts: mobile shows seat/name/role/icon, desktop shows avatar/name+ID/badge/table/actions), SidebarNavItem, GuestDetailSection, TableGroupHeader (mobile-only visibility)
- **Organisms**: TopNav (hides search + nav links on mobile), LeftSidebar (hidden on mobile), GuestTable (flat on desktop, grouped on mobile), GuestDetailPanel (hidden on mobile), GuestListHeader (adapts stat cards), GuestListFooterStats (desktop only), BottomTabBar (mobile only)

### DD-3: Mock Data Module

**Decision**: Create a `src/data/mock-guests.ts` module exporting a typed array of guest objects and helper functions for computing stats.
**Reasoning**: Centralizing mock data in one module makes it trivial to replace with real data later. Typed interfaces ensure the data shape is consistent and documented. Helper functions (e.g., `getConfirmationRate()`, `getDietaryFlagCount()`) keep computation logic co-located with the data.

### DD-4: Guest Data Model

**Decision**: Use the following TypeScript interface for guest data:

```typescript
type GuestStatus = 'CONFIRMED' | 'PENDING' | 'DECLINED'

interface Guest {
  id: string // unique identifier, e.g., "4492-AX"
  firstName: string
  lastName: string
  role: string // e.g., "LEAD SYSTEMS ARCHITECT"
  status: GuestStatus
  accessLevel: string // e.g., "TIER_01"
  tableAssignment: string | null // e.g., "TABLE_04" or null if unassigned
  seatNumber: number | null // seat position within assigned table, e.g., 1, 2, 3; null if unassigned
  dietary: {
    type: string | null // e.g., "VEGAN", "VEGETARIAN", null
    notes: string | null // e.g., "Severe nut allergy..."
  }
  logistics: {
    shuttleRequired: boolean
    shuttleFrom: string | null // e.g., "DOWNTOWN_HUB"
    lodgingBooked: boolean
    lodgingVenue: string | null // e.g., "THE GRAND MERIDIAN"
  }
}
```

**Reasoning**: Covers all fields visible in the design reference. `tableAssignment` is nullable to handle the "- - -" display case. Dietary and logistics are nested objects since they represent distinct information groups shown in separate detail panel sections. Status is a union type to enforce the three valid values.

### DD-5: React Router Configuration

**Decision**: The app renders entirely at the root route (`/`). Tab switching between "Guest List" and "Canvas" is handled via the `tab` query parameter (e.g., `/?tab=guests`, `/?tab=canvas`). When no `tab` param is present, the default tab is `guests`. React Router 7's `useSearchParams` hook is used to read and write the query parameter. There are no sub-route definitions — only the root route exists.
**Reasoning**: Query-param-based tab switching avoids separate route definitions and redirects. The app shell (nav, sidebar) is always rendered at `/` and the main content area swaps based on the `tab` param. This simplifies routing config and keeps the URL clean. The Canvas page (out of scope) will render a placeholder when `tab=canvas` is selected.

### DD-6: Detail Panel State Management

**Decision**: Use React `useState` in the guest list page component to track the selected guest ID. The detail panel renders conditionally based on whether a selected guest exists.
**Reasoning**: Simple local state is sufficient — only the guest list page needs to know which guest is selected. No global state management is needed for this feature. The panel toggles: clicking the same guest closes it, clicking a different guest switches it.

### DD-7: Search Implementation

**Decision**: Use a controlled input with `useState` for the search query. Filter the guest array client-side using case-insensitive substring matching on `firstName + lastName`.
**Reasoning**: With only 4–6 mock guests (and even real wedding lists rarely exceeding a few hundred), client-side filtering is instantaneous. No debounce needed. The filter applies only to the table display; header stats always reflect the full dataset.

### DD-8: Cyberpunk Aesthetic Naming

**Decision**: All UI label text follows the sci-fi/cyberpunk naming convention from the design (uppercase, underscores, technical-sounding codes). This is hardcoded in the component JSX, not derived from data.
**Reasoning**: This is a deliberate design choice visible in the reference. Labels like "REGISTRY.SYSTEM_V4", "SEATING_01 / ACTIVE SESSION", "T_04", "TIER_01" are part of the visual identity. They are static UI chrome, not user-generated content.

### DD-9: Status Badge Variants

**Decision**: Three visual variants:

- **CONFIRMED**: `bg-primary text-white` (filled cobalt blue badge)
- **PENDING**: `border border-primary text-primary bg-transparent` (outlined cobalt)
- **DECLINED**: `border border-red-500/50 text-red-400/70 bg-transparent` (outlined muted red — red is not in the design system's accent palette, so use a raw Tailwind red at reduced opacity to keep it subdued)
  **Reasoning**: The design shows clear visual differentiation between the three statuses. CONFIRMED is the most prominent (filled), PENDING is secondary (outlined), and DECLINED is de-emphasized (muted red outline). Using reduced opacity on the red keeps it from clashing with the cobalt-dominant palette.

### DD-10: Selected Row Indicator

**Decision**: The selected guest row has a cobalt blue left border (`border-l-2 border-l-primary`) and a subtle elevated background (`bg-surface-elevated`).
**Reasoning**: Matches the design reference which shows a cobalt left accent bar on the selected/active row. The elevated background provides additional visual distinction without being heavy-handed.

### DD-11: Responsive Breakpoint

**Decision**: Use a single breakpoint at 768px. Below 768px renders the mobile layout; 768px and above renders the desktop three-panel layout. Use Tailwind's `md:` prefix (768px) for responsive utilities.
**Reasoning**: 768px is the standard tablet/mobile boundary. The desktop layout requires a minimum of ~960px to fit sidebar + content comfortably, but 768px gives a reasonable cut-off. The mobile design is a fundamentally different layout (not just a squeezed desktop), so a clean breakpoint swap is appropriate.

### DD-12: Mobile Navigation — Bottom Tab Bar

**Decision**: On mobile, the left sidebar is completely hidden and replaced by a fixed bottom tab bar with 4 tabs: CANVAS, GUESTS, TOOLS, MORE. Tabs use the same `tab` query param mechanism as desktop nav links. TOOLS and MORE are non-functional placeholders.
**Reasoning**: Bottom tab bars are the standard mobile navigation pattern for thumb-reachable interaction. The sidebar's items (Properties, Layout, Objects, Export, History) are collapsed into TOOLS and MORE for mobile — these are out of scope but the tab bar structure is present. This approach avoids hamburger menus which have lower discoverability.

### DD-13: Mobile Guest List — Grouped by Table

**Decision**: On mobile, the same `GuestTable` organism renders guests grouped by `tableAssignment` instead of as a flat data table. The component detects the viewport (via a Tailwind `md:` responsive approach or a `useMediaQuery`-style hook) and switches its internal rendering: grouped list on mobile, flat table on desktop. `GuestRow` also adapts — on mobile it renders seat number + name + role + status icon; on desktop it renders the full data-table row. Guests with `tableAssignment: null` are placed in an "UNASSIGNED" group at the end.
**Reasoning**: The mobile design shows this grouped layout. By keeping a single `GuestTable` and `GuestRow` component that adapts, we avoid duplicating list rendering logic. Grouping by table makes more sense on mobile where the user is likely checking table-by-table. The simpler row format (no ID, no badge — just an icon) fits the narrower viewport.

### DD-14: Mobile FAB Replaces Sidebar Add Button

**Decision**: On mobile, the sidebar's "ADD GUEST" button is replaced by a floating action button (FAB) positioned in the bottom-right corner, above the tab bar. Circular, cobalt blue, with a person-add icon.
**Reasoning**: FABs are the standard mobile pattern for primary actions. They stay visible during scrolling and are thumb-reachable. The sidebar button is invisible on mobile (sidebar is hidden), so the FAB provides equivalent functionality.

### DD-15: Mobile Top Bar Simplification

**Decision**: On mobile, the top bar only shows the brand text (with cobalt dot indicator), settings icon, and user avatar. Nav links (Canvas/Guest List) and the search input are removed from the top bar — navigation moves to the bottom tab bar.
**Reasoning**: Mobile top bars have limited horizontal space. The nav links are redundant with the bottom tab bar. Search is not shown in the mobile design reference — it can be added later as a search icon that expands, but is out of scope for this spec.

### DD-16: Mobile Guest Data Model — Seat Number

**Decision**: Add a `seatNumber` field (type `number | null`) to the Guest interface to support the mobile layout which shows seat numbers (01, 02, 03, etc.) per table group.
**Reasoning**: The mobile design shows seat numbers per guest within each table group. This is a per-table sequential number indicating the guest's seat position at their assigned table. Guests with no table assignment have `seatNumber: null`.

## UI/UX Details

### Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│  TOP NAV: PLANNER_V1.0 | CANVAS  GUEST LIST | 🔍 ⚙ 👤  │
├──────────┬───────────────────────────┬───────────────────┤
│          │  REGISTRY.SYSTEM_V4       │                   │
│ SIDEBAR  │  GUEST_LIST               │  GUEST_DETAILS    │
│          │  ┌─────────┬──────────┐   │  (conditional)    │
│ SEATING  │  │CONFIRMED│ PENDING  │   │                   │
│ _01      │  │  142    │   28     │   │  Name / Role      │
│          │  └─────────┴──────────┘   │  Core Metadata    │
│ Props    │                           │  Preferences      │
│ Layout   │  NAME/ID  STATUS TBL ACT  │  Logistics        │
│ Objects* │  ──────────────────────── │                   │
│ Export   │  Guest 1  CONF   T_04  …  │  [CONTACT][UPDATE]│
│          │  Guest 2  PEND   - - - …  │                   │
│ [ADD     │  Guest 3  DECL   T_02  …  │                   │
│  GUEST]  │  ...                      │                   │
│          │                           │                   │
│ HISTORY  │  ┌────────┬───────┬─────┐ │                   │
│          │  │ CONF%  │ DIET  │RSVP │ │                   │
│          │  │  84%   │  12   │T-08D│ │                   │
│          │  └────────┴───────┴─────┘ │                   │
└──────────┴───────────────────────────┴───────────────────┘
```

### Widths

- Left sidebar: ~220px fixed
- Right detail panel: ~320px fixed (when open)
- Main content: fills remaining space
- Top nav: full viewport width

### Mobile Layout Structure (<768px)

```
┌──────────────────────────┐
│ ■ PLANNER_V1.0      ⚙ 👤│
├──────────────────────────┤
│ SYSTEM_LOG               │
│ GUEST LIST               │
│ STATUS: 124/150 CONFIRMED│
│                          │
│ ┌───────────┬───────────┐│
│ │TOTAL GUEST│ WAITLIST  ││
│ │   142     │    08     ││
│ └───────────┴───────────┘│
│                          │
│ LOCATION_A               │
│ TABLE 01      08/08 SEATS│
│ ─────────────────────────│
│ 01 ALEXANDER_VANCE     ✓ │
│    PRIORITY VIP          │
│ 02 ELARA_SANTOS        ✓ │
│    GENERAL               │
│ 03 MARCUS_CHEN         ✓ │
│    PLUS ONE              │
│                          │
│ LOCATION_B               │
│ TABLE 02      04/08 SEATS│
│ ─────────────────────────│
│ 09 SOPHIA_LOWE        ··· │
│    PENDING RESPONSE      │
│ 10 JULIAN_DRAKE        ✓ │
│    GENERAL          [FAB]│
│                          │
├──────────────────────────┤
│ CANVAS GUESTS TOOLS MORE │
└──────────────────────────┘
```

### Component Breakdown (Atomic Design)

Components are **shared between desktop and mobile** — responsive behavior is handled inside each component via Tailwind responsive utilities (`hidden md:block`, `md:hidden`, etc.). No duplicate components for mobile.

**Atoms:**

- `StatusBadge` — renders CONFIRMED/PENDING/DECLINED with correct variant styling (desktop: text badge, mobile: hidden — replaced by StatusIcon)
- `StatusIcon` — checkmark circle (confirmed) or ellipsis/dots (pending/declined) icon (mobile: visible, desktop: hidden)
- `Avatar` — circular initials avatar with background color (desktop: visible in row, mobile: hidden in row)
- `StatCard` — single stat card (label + value + optional sub-element like progress bar or badge); adapts layout with cobalt left border on mobile
- `SearchInput` — styled input with search icon and placeholder (desktop only, hidden on mobile via responsive class)
- `IconButton` — icon-only button (close, settings, etc.)
- `NavLink` — top nav link with active underline state (desktop only inside TopNav)
- `FAB` — floating action button, circular, cobalt blue, fixed position (mobile only, hidden on desktop via responsive class)
- `TabBarItem` — single tab item in bottom tab bar: icon + label, active state with cobalt highlight (mobile only)

**Molecules:**

- `GuestRow` — **adapts per viewport**: mobile shows seat number + name (with underscores) + role + StatusIcon; desktop shows Avatar + name/ID + StatusBadge + table assignment + actions. Single component, responsive visibility on child elements.
- `SidebarNavItem` — sidebar navigation item with icon area and active highlight (desktop only, inside LeftSidebar)
- `GuestDetailSection` — labeled section within the detail panel (Core Metadata, Preferences, Logistics)
- `TableGroupHeader` — location label + table name + seat capacity (mobile only, hidden on desktop via responsive class)

**Organisms:**

- `TopNav` — full top navigation bar. Hides SearchInput and NavLinks on mobile; shows only brand + settings + avatar.
- `LeftSidebar` — full left sidebar panel. Hidden entirely on mobile (`hidden md:block`).
- `GuestTable` — **adapts per viewport**: desktop renders a flat data table with column headers; mobile renders guests grouped by table with TableGroupHeader between groups. Single component with responsive internal logic.
- `GuestDetailPanel` — full right detail panel. Hidden on mobile (`hidden md:block`); only renders on desktop when a guest is selected.
- `GuestListHeader` — title area + summary stat cards. Adapts: desktop shows "REGISTRY.SYSTEM_V4" + TOTAL CONFIRMED/PENDING; mobile shows "SYSTEM_LOG" + status subtitle + TOTAL GUESTS/WAITLIST.
- `GuestListFooterStats` — bottom three stat cards (desktop only, hidden on mobile).
- `BottomTabBar` — fixed bottom tab bar with 4 TabBarItems. Mobile only (`md:hidden`).

### Interaction Details

- **Row hover**: subtle background change (`bg-gray-800/50`)
- **Row click**: selects guest, opens/switches detail panel
- **Selected row**: cobalt left border + elevated background
- **Detail panel close (X)**: deselects guest, hides panel
- **Search typing**: live filtering of table rows (no submit button)

## Data Requirements

### Guest Interface

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

### Mock Data (4–6 guests)

The mock data module should include guests with:

- At least 2 CONFIRMED, 1–2 PENDING, 1 DECLINED
- At least 1 guest with no table assignment (null)
- At least 1 guest with dietary restrictions and notes
- At least 1 guest with no dietary restrictions
- At least 1 guest requiring shuttle
- At least 1 guest with lodging booked
- Varied access levels (TIER_01, TIER_02)
- IDs following the pattern "XXXX-XX" (4 digits, dash, 2 uppercase letters)

### Computed Stats

Stats computed from mock data:

- **Total Confirmed**: count of guests with status "CONFIRMED"
- **Pending**: count of guests with status "PENDING"
- **Confirmation Rate**: `(confirmed / total) * 100`, displayed as percentage with progress bar
- **Dietary Flags**: count of guests where `dietary.type` is not null
- **RSVP Deadline**: static mock value (e.g., "T-08D" meaning 8 days remaining), displayed with an urgent badge

## Technical Plan

### Impact Analysis

#### Affected Areas

| Area                           | Files                                               | Type of Change                                                                                                                                |
| ------------------------------ | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| App shell & routing            | `src/App.tsx`                                       | **Replace** — gut Vite template, implement query-param tab switching with `useSearchParams`, CSS Grid app shell, responsive layout            |
| App styles                     | `src/App.css`                                       | **Delete contents** — all old template styles are obsolete; file can be emptied or removed (import removed from App.tsx)                      |
| Root container                 | `src/index.css` (lines 185–195, `#root` rule)       | **Modify** — change `width: 1126px` / `text-align: center` to full-viewport layout (`width: 100%`, remove text-align, adjust for 100svh grid) |
| Mock data                      | `src/data/mock-guests.ts`                           | **Create** — Guest/GuestStatus types, mock guest array, stat helper functions                                                                 |
| Atom: StatusBadge              | `src/components/atoms/StatusBadge.tsx`              | **Create**                                                                                                                                    |
| Atom: StatusIcon               | `src/components/atoms/StatusIcon.tsx`               | **Create**                                                                                                                                    |
| Atom: Avatar                   | `src/components/atoms/Avatar.tsx`                   | **Create**                                                                                                                                    |
| Atom: StatCard                 | `src/components/atoms/StatCard.tsx`                 | **Create**                                                                                                                                    |
| Atom: SearchInput              | `src/components/atoms/SearchInput.tsx`              | **Create**                                                                                                                                    |
| Atom: IconButton               | `src/components/atoms/IconButton.tsx`               | **Create**                                                                                                                                    |
| Atom: NavLink                  | `src/components/atoms/NavLink.tsx`                  | **Create**                                                                                                                                    |
| Atom: FAB                      | `src/components/atoms/FAB.tsx`                      | **Create**                                                                                                                                    |
| Atom: TabBarItem               | `src/components/atoms/TabBarItem.tsx`               | **Create**                                                                                                                                    |
| Molecule: GuestRow             | `src/components/molecules/GuestRow.tsx`             | **Create**                                                                                                                                    |
| Molecule: SidebarNavItem       | `src/components/molecules/SidebarNavItem.tsx`       | **Create**                                                                                                                                    |
| Molecule: GuestDetailSection   | `src/components/molecules/GuestDetailSection.tsx`   | **Create**                                                                                                                                    |
| Molecule: TableGroupHeader     | `src/components/molecules/TableGroupHeader.tsx`     | **Create**                                                                                                                                    |
| Organism: TopNav               | `src/components/organisms/TopNav.tsx`               | **Create**                                                                                                                                    |
| Organism: LeftSidebar          | `src/components/organisms/LeftSidebar.tsx`          | **Create**                                                                                                                                    |
| Organism: GuestTable           | `src/components/organisms/GuestTable.tsx`           | **Create**                                                                                                                                    |
| Organism: GuestDetailPanel     | `src/components/organisms/GuestDetailPanel.tsx`     | **Create**                                                                                                                                    |
| Organism: GuestListHeader      | `src/components/organisms/GuestListHeader.tsx`      | **Create**                                                                                                                                    |
| Organism: GuestListFooterStats | `src/components/organisms/GuestListFooterStats.tsx` | **Create**                                                                                                                                    |
| Organism: BottomTabBar         | `src/components/organisms/BottomTabBar.tsx`         | **Create**                                                                                                                                    |

#### Integration Points

- **`src/main.tsx`** — No changes needed. Already wraps `<App />` in `<BrowserRouter>`.
- **`src/index.css`** — The `#root` rule must change from fixed-width centered layout to full-viewport. All design tokens, `@theme`, `:root`, typography utilities, and component base styles remain untouched.
- **`src/App.tsx`** — Becomes the app shell. Imports and orchestrates all organisms. Uses `useSearchParams` from `react-router` for tab switching. Manages `selectedGuestId` and `searchQuery` state.
- **`src/data/mock-guests.ts`** — Consumed by `App.tsx` (or passed down as props). Provides the `Guest` type used across all components.
- **`public/icons.svg`** — Existing SVG sprite contains Vite template icons only. New icons needed for the guest list UI (search, settings, close, person, person-add, pencil, wrench, dots, checkmark, shuttle, lodging, etc.) will be added as new `<symbol>` entries, or inline SVGs can be used directly in components. The plan uses inline SVGs to avoid coupling to the sprite file.

#### Risk Areas

- **`src/index.css` `#root` rule** — Shared by all pages. Changing `width` from `1126px` to `100%` and removing `text-align: center` affects the entire app. Since the old Vite template is being fully replaced, this is safe, but verify no downstream CSS depends on the centered text-align.
- **`src/App.css`** — Being completely emptied. Ensure the import `import './App.css'` is removed from App.tsx (or the file is deleted) so no stale styles linger.
- **TypeScript strict mode** — `verbatimModuleSyntax` is enabled, so all type-only imports must use `import type { ... }`. `noUnusedLocals` and `noUnusedParameters` are enabled — every import and parameter must be used.

### Task Breakdown

#### TASK-001: Mock Data Module

- **Description**: Create the Guest type definitions and mock data array with 6 guests covering all required variations. Include stat helper functions.
- **Files**: `src/data/mock-guests.ts` (create)
- **Instructions**:
  1. Create directory `src/data/`
  2. Create `src/data/mock-guests.ts`
  3. Define and export `type GuestStatus = 'CONFIRMED' | 'PENDING' | 'DECLINED'`
  4. Define and export `interface Guest` with all fields from DD-4 (id, firstName, lastName, role, status, accessLevel, tableAssignment, seatNumber, dietary, logistics)
  5. Export a `const guests: Guest[]` array with 6 guests:
     - Guest 1: CONFIRMED, TABLE_04, seat 1, VEGAN dietary with nut allergy notes, shuttle required from DOWNTOWN_HUB, lodging booked at THE GRAND MERIDIAN, TIER_01, role "LEAD SYSTEMS ARCHITECT"
     - Guest 2: CONFIRMED, TABLE_04, seat 2, no dietary restrictions, no shuttle, no lodging, TIER_01, role "PRIORITY VIP"
     - Guest 3: PENDING, TABLE_02, seat 1, VEGETARIAN dietary with no notes, shuttle required from AIRPORT_TERMINAL, no lodging, TIER_02, role "GENERAL"
     - Guest 4: CONFIRMED, TABLE_02, seat 2, no dietary restrictions, no shuttle, lodging booked at PARKSIDE INN, TIER_01, role "PLUS ONE"
     - Guest 5: DECLINED, TABLE_01, seat 1, GLUTEN-FREE dietary with celiac note, no shuttle, no lodging, TIER_02, role "GENERAL"
     - Guest 6: PENDING, null tableAssignment, null seatNumber, no dietary restrictions, no shuttle, no lodging, TIER_02, role "PENDING RESPONSE"
  6. Use cyberpunk-style IDs: "4492-AX", "3371-BK", "5580-CR", "2218-DL", "6643-EM", "7789-FN"
  7. Use cyberpunk names: ALEXANDER VANCE, ELARA SANTOS, MARCUS CHEN, SOPHIA LOWE, JULIAN DRAKE, NOVA REYES
  8. Export helper functions:
     - `getConfirmedCount(): number` — count guests with status CONFIRMED
     - `getPendingCount(): number` — count guests with status PENDING
     - `getConfirmationRate(): number` — `(confirmed / total) * 100`, rounded to nearest integer
     - `getDietaryFlagCount(): number` — count guests where `dietary.type` is not null
     - `getTotalGuests(): number` — total guest count
     - `getWaitlistCount(): number` — count of PENDING guests (same as getPendingCount, aliased for mobile stat card)
     - `getGuestsByTable(): Map<string, Guest[]>` — group guests by tableAssignment, with null grouped under key "UNASSIGNED"
- **Project context**:
  - Framework: TypeScript ~5.9.3 strict mode, ES2023 target
  - Conventions: No semicolons, single quotes, 2-space indent, trailing commas on all. `verbatimModuleSyntax` — use `export type` for type-only exports where needed
  - Libraries: No external libraries needed
- **Dependencies**: None
- **Acceptance criteria**: File compiles with `tsc -b`. Exports `Guest`, `GuestStatus`, `guests`, and all helper functions. Mock data includes all required variations (2+ CONFIRMED, 1–2 PENDING, 1 DECLINED, 1 null table, 1+ dietary, 1+ shuttle, 1+ lodging).

---

#### TASK-002: Atom Components

- **Description**: Create all 9 atom components: StatusBadge, StatusIcon, Avatar, StatCard, SearchInput, IconButton, NavLink, FAB, TabBarItem.
- **Files**:
  - `src/components/atoms/StatusBadge.tsx` (create)
  - `src/components/atoms/StatusIcon.tsx` (create)
  - `src/components/atoms/Avatar.tsx` (create)
  - `src/components/atoms/StatCard.tsx` (create)
  - `src/components/atoms/SearchInput.tsx` (create)
  - `src/components/atoms/IconButton.tsx` (create)
  - `src/components/atoms/NavLink.tsx` (create)
  - `src/components/atoms/FAB.tsx` (create)
  - `src/components/atoms/TabBarItem.tsx` (create)
- **Instructions**:
  1. Create directories: `src/components/`, `src/components/atoms/`
  2. **StatusBadge.tsx**: Props: `status: GuestStatus`. Renders a `<span>` with text-label typography (uppercase, 12px, 500 weight, 0.8px tracking). Variants per DD-9:
     - CONFIRMED: `bg-primary text-primary-foreground` (filled cobalt)
     - PENDING: `border border-primary text-primary bg-transparent`
     - DECLINED: `border border-red-500/50 text-red-400/70 bg-transparent`
     - All: `px-2 py-0.5 rounded text-label` base classes
     - Hidden on mobile: add `hidden md:inline-flex` (mobile uses StatusIcon instead)
  3. **StatusIcon.tsx**: Props: `status: GuestStatus`. Renders an inline SVG icon:
     - CONFIRMED: checkmark inside a circle, cobalt color (`text-primary`)
     - PENDING/DECLINED: three dots (ellipsis), muted color (`text-foreground-muted`)
     - Size: 20×20px
     - Visible on mobile only: `md:hidden`
  4. **Avatar.tsx**: Props: `firstName: string, lastName: string, size?: 'sm' | 'md' | 'lg'`. Renders a circular div with initials (first letter of each name). Background: `bg-surface-elevated`, text: `text-foreground-heading`, centered. Sizes: sm=32px, md=40px, lg=56px. Default md.
     - Hidden in mobile guest rows (controlled by parent), visible in detail panel
  5. **StatCard.tsx**: Props: `label: string, value: string | number, children?: ReactNode` (for sub-elements like progress bar or badge). Renders a `.card`-styled container (use the existing `.card` class from index.css component layer) with label in `text-label text-foreground-muted` and value in `text-heading-4 text-foreground-heading`.
     - On mobile: add `border-l-2 border-l-primary` via a `mobileBorder?: boolean` prop (or always when `md:` not present). The parent controls this via responsive classes.
  6. **SearchInput.tsx**: Props: `value: string, onChange: (value: string) => void, placeholder?: string`. Renders an `<input>` using the `.input` class. Prepend an inline SVG search icon inside a wrapper div. Placeholder default: "SEARCH_DATABASE".
     - Hidden on mobile: parent wraps with `hidden md:flex`
  7. **IconButton.tsx**: Props: `onClick?: () => void, label: string, children: ReactNode` (icon as child). Renders a `<button>` with `aria-label`, icon-only styling: `p-2 rounded hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring`.
  8. **NavLink.tsx**: Props: `label: string, isActive: boolean, onClick: () => void`. Renders a `<button>` with uppercase text-label typography. Active state: cobalt underline (`border-b-2 border-b-primary text-foreground-heading`). Inactive: `text-foreground-muted hover:text-foreground`. Hidden on mobile (parent controls via `hidden md:flex`).
  9. **FAB.tsx**: Props: `onClick?: () => void, label: string`. Renders a circular button (`w-14 h-14 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg`) with a person-add inline SVG icon. Fixed position: `fixed bottom-20 right-4 z-50`. Visible on mobile only: `md:hidden`.
  10. **TabBarItem.tsx**: Props: `icon: ReactNode, label: string, isActive: boolean, onClick: () => void`. Renders a flex-col button with icon on top and label below. Active: icon has `bg-primary text-primary-foreground rounded-lg p-1` wrapper, label is `text-primary`. Inactive: `text-foreground-muted`. Typography: text-caption for label.
  11. All components: function declarations with default export, no semicolons, single quotes, 2-space indent. Import `type { GuestStatus }` (not `import { GuestStatus }`) when importing type-only. Use `import type { ReactNode } from 'react'` pattern.
- **Project context**:
  - Framework: React 19, TypeScript strict, `verbatimModuleSyntax` (use `import type`)
  - Conventions: No semicolons, single quotes, 2-space indent, PascalCase components, function declarations with default export, no barrel files
  - Libraries: Tailwind classes for styling. Use existing `.card`, `.input`, `.badge` classes from `src/index.css` where applicable. Use `text-label`, `text-caption`, `text-heading-4`, `text-body-sm` custom typography utilities. Semantic colors: `bg-primary`, `text-primary`, `bg-surface`, `bg-surface-elevated`, `text-foreground`, `text-foreground-muted`, `text-foreground-heading`, `border-border`
- **Dependencies**: TASK-001 (needs `GuestStatus` type for StatusBadge and StatusIcon)
- **Acceptance criteria**: All 9 atom files exist under `src/components/atoms/`. Each compiles without errors. StatusBadge renders three visual variants. StatusIcon renders two icon variants. Avatar shows initials. StatCard displays label/value. SearchInput is a controlled input. NavLink shows active underline. FAB is mobile-only. TabBarItem shows active cobalt state. No barrel index.ts files.

---

#### TASK-003: Molecule Components

- **Description**: Create all 4 molecule components: GuestRow, SidebarNavItem, GuestDetailSection, TableGroupHeader.
- **Files**:
  - `src/components/molecules/GuestRow.tsx` (create)
  - `src/components/molecules/SidebarNavItem.tsx` (create)
  - `src/components/molecules/GuestDetailSection.tsx` (create)
  - `src/components/molecules/TableGroupHeader.tsx` (create)
- **Instructions**:
  1. Create directory `src/components/molecules/`
  2. **GuestRow.tsx**: Props: `guest: Guest, isSelected: boolean, onClick: () => void`. This is a **responsive dual-layout** component:
     - **Desktop layout** (`hidden md:flex` wrapper or responsive classes on children): Renders as a table-like row with: Avatar (initials), name column (name in uppercase bold + ID code "ID: {id}" in muted text below), StatusBadge, table assignment (or "- - -" if null), actions area (ellipsis icon button). Selected state: `border-l-2 border-l-primary bg-surface-elevated`. Hover: `hover:bg-gray-800/50`. Cursor pointer.
     - **Mobile layout** (`md:hidden` wrapper): Renders seat number (formatted as 2-digit, e.g., "01") in muted text on the left, guest name (uppercase, with underscore replacing space, bold) and role below in muted text, StatusIcon on the right. Selected state: `bg-surface-elevated`. No Avatar, no ID, no StatusBadge, no table column on mobile.
     - Combine both in a single component using responsive visibility classes on the inner elements, or two sibling wrapper divs (one `hidden md:flex`, one `md:hidden`).
     - Full row is clickable (`onClick`).
     - Name formatting: `${firstName}_${lastName}` on mobile (underscore), `${firstName} ${lastName}` on desktop (space), always uppercase.
  3. **SidebarNavItem.tsx**: Props: `label: string, isActive: boolean, onClick?: () => void`. Renders a row with a placeholder icon area (small square or line), label text, and optional active highlight. Active: `text-primary` text, `bg-primary/10` background, `border-l-2 border-l-primary` left border. Inactive: `text-foreground-muted hover:text-foreground hover:bg-surface-elevated`. Padding: `py-2 px-4`.
  4. **GuestDetailSection.tsx**: Props: `title: string, children: ReactNode`. Renders a section with a title in `text-label text-foreground-muted uppercase tracking-wider` and content below with a top border separator `border-t border-border pt-4 mt-4`.
  5. **TableGroupHeader.tsx**: Props: `location: string, tableName: string, seatCount: number, totalSeats: number`. Renders:
     - Location label in `text-label text-primary` (e.g., "LOCATION_A")
     - Row with table name in `text-body font-semibold text-foreground-heading` and seat indicator in `text-caption text-foreground-muted` (e.g., "08/08 SEATS")
     - A separator line below (`border-b border-border`)
     - Visible on mobile only: `md:hidden`
- **Project context**:
  - Framework: React 19, TypeScript strict, `verbatimModuleSyntax`
  - Conventions: No semicolons, single quotes, 2-space indent, PascalCase, function declarations, default export, no barrel files
  - Libraries: Import `type { Guest }` from `../../data/mock-guests`. Use atoms: `StatusBadge`, `StatusIcon`, `Avatar`, `IconButton`. Use Tailwind responsive utilities (`hidden md:flex`, `md:hidden`) for viewport switching inside GuestRow.
- **Dependencies**: TASK-001 (Guest type), TASK-002 (atom components)
- **Acceptance criteria**: All 4 molecule files exist. GuestRow renders correctly at both breakpoints (desktop row and mobile row in one component). SidebarNavItem shows active/inactive states. GuestDetailSection renders titled sections. TableGroupHeader shows location/table/seats (mobile only). No barrel files.

---

#### TASK-004: Organism — TopNav

- **Description**: Create the TopNav organism: brand text, nav links (CANVAS/GUEST LIST), search input, settings icon, user avatar.
- **Files**: `src/components/organisms/TopNav.tsx` (create)
- **Instructions**:
  1. Create directory `src/components/organisms/`
  2. Props: `activeTab: string, onTabChange: (tab: string) => void, searchQuery: string, onSearchChange: (query: string) => void`
  3. Render a `<header>` or `<nav>` with full-width, fixed height (~56px), `bg-surface`, `border-b border-border`
  4. Layout: `flex items-center justify-between px-4 md:px-6`
  5. Left section:
     - Brand text "PLANNER_V1.0" in `text-label text-foreground-heading font-semibold tracking-wider`
     - On mobile: add a small cobalt dot indicator before/after brand text (a `w-2 h-2 rounded-full bg-primary inline-block` span)
  6. Center section (desktop only — `hidden md:flex items-center gap-6`):
     - NavLink for "CANVAS" — `isActive: activeTab === 'canvas'`, `onClick: () => onTabChange('canvas')`
     - NavLink for "GUEST LIST" — `isActive: activeTab === 'guests'`, `onClick: () => onTabChange('guests')`
  7. Right section: `flex items-center gap-2 md:gap-4`
     - SearchInput (desktop only — wrap in `hidden md:block`): `value={searchQuery}`, `onChange={onSearchChange}`
     - IconButton for settings (inline SVG gear/cog icon), `label="Settings"`
     - Avatar with fixed initials (e.g., "JD" for a placeholder user) — small size
  8. On mobile (<768px): only brand + cobalt dot, settings icon, and avatar are visible. Nav links and search are hidden via `hidden md:flex` / `hidden md:block`.
- **Project context**:
  - Framework: React 19, TypeScript strict
  - Conventions: No semicolons, single quotes, 2-space indent, function declaration, default export
  - Libraries: Import atoms: `NavLink`, `SearchInput`, `IconButton`, `Avatar` from `../atoms/`. Tailwind responsive classes.
- **Dependencies**: TASK-002 (atoms: NavLink, SearchInput, IconButton, Avatar)
- **Acceptance criteria**: TopNav renders brand, nav links (desktop), search (desktop), settings icon, and avatar. Nav links call `onTabChange` with correct tab values. Search input is controlled. Mobile shows only brand + dot + settings + avatar. Matches AC-3, AC-21.

---

#### TASK-005: Organism — LeftSidebar

- **Description**: Create the LeftSidebar organism: session info, nav items, ADD GUEST button, HISTORY link. Desktop only.
- **Files**: `src/components/organisms/LeftSidebar.tsx` (create)
- **Instructions**:
  1. Props: none (all content is static/chrome)
  2. Render an `<aside>` with `hidden md:flex flex-col w-[220px] min-w-[220px] bg-surface border-r border-border h-full`
  3. Top section: session info "SEATING_01 / ACTIVE SESSION" in `text-caption text-foreground-muted px-4 py-3 border-b border-border`
  4. Nav items section (`flex-1 py-2`): 4 SidebarNavItems:
     - "PROPERTIES" — inactive
     - "LAYOUT" — inactive
     - "OBJECTS" — active (cobalt highlight, per AC-4)
     - "EXPORT" — inactive
  5. Bottom section (`mt-auto px-4 py-4 border-t border-border`):
     - "ADD GUEST" button using `.btn-primary` class, full width (`w-full`). `onClick` provides visual feedback only (no-op or brief active state). Text: "[ + ] ADD GUEST" or "+ ADD GUEST"
     - "HISTORY" link below: `text-caption text-foreground-muted hover:text-foreground cursor-pointer mt-2 text-center`
  6. Entirely hidden on mobile via the `hidden md:flex` on the root element.
- **Project context**:
  - Framework: React 19, TypeScript strict
  - Conventions: No semicolons, single quotes, 2-space indent, function declaration, default export
  - Libraries: Import `SidebarNavItem` from `../molecules/`. Use `.btn-primary` class from index.css. Tailwind classes.
- **Dependencies**: TASK-003 (molecule: SidebarNavItem)
- **Acceptance criteria**: Sidebar renders session info, 4 nav items with "OBJECTS" active, ADD GUEST button (visual feedback only), HISTORY link. Hidden on mobile. Matches AC-4, AC-16.

---

#### TASK-006: Organism — GuestListHeader

- **Description**: Create the GuestListHeader organism: registry label, title, summary stat cards. Responsive — different content on mobile vs desktop.
- **Files**: `src/components/organisms/GuestListHeader.tsx` (create)
- **Instructions**:
  1. Props: `confirmedCount: number, pendingCount: number, totalGuests: number, waitlistCount: number`
  2. **Desktop layout** (`hidden md:block` or responsive classes):
     - Label: "REGISTRY.SYSTEM_V4" in `text-label text-primary tracking-wider`
     - Title: "GUEST_LIST" in `text-heading-3 text-foreground-heading`
     - Two StatCards side by side in a `flex gap-4 mt-4`:
       - "TOTAL CONFIRMED" with value `confirmedCount`
       - "PENDING" with value `pendingCount`
  3. **Mobile layout** (`md:hidden`):
     - Label: "SYSTEM_LOG" in `text-label text-primary tracking-wider`
     - Title: "GUEST LIST" in `text-heading-3 text-foreground-heading`
     - Subtitle: "STATUS: {confirmedCount} / {totalGuests} CONFIRMED" in `text-caption text-foreground-muted mt-1`
     - Two StatCards side by side in `grid grid-cols-2 gap-3 mt-4`, each with `mobileBorder` prop (cobalt left border):
       - "TOTAL GUESTS" with value `totalGuests`
       - "WAITLIST" with value `waitlistCount`
  4. Wrap in a `<div className="px-4 md:px-6 py-4 md:py-6">`
- **Project context**:
  - Framework: React 19, TypeScript strict
  - Conventions: No semicolons, single quotes, 2-space indent, function declaration, default export
  - Libraries: Import `StatCard` from `../atoms/`. Tailwind responsive classes.
- **Dependencies**: TASK-002 (atom: StatCard)
- **Acceptance criteria**: Desktop shows REGISTRY.SYSTEM_V4, GUEST_LIST, and CONFIRMED/PENDING stat cards. Mobile shows SYSTEM_LOG, GUEST LIST, status subtitle, TOTAL GUESTS/WAITLIST with cobalt left border. Matches AC-5, AC-22.

---

#### TASK-007: Organism — GuestTable

- **Description**: Create the GuestTable organism: flat data table on desktop, grouped-by-table list on mobile. Includes empty state for search.
- **Files**: `src/components/organisms/GuestTable.tsx` (create)
- **Instructions**:
  1. Props: `guests: Guest[], selectedGuestId: string | null, onGuestClick: (guestId: string) => void, searchQuery: string`
  2. Filter guests by `searchQuery` (case-insensitive substring match on `firstName + ' ' + lastName`). If searchQuery is empty, show all.
  3. **Desktop layout** (`hidden md:block`):
     - Column headers row: "NAME / IDENTIFIER", "STATUS", "TABLE", "ACTIONS" — styled in `text-label text-foreground-muted uppercase tracking-wider` with `border-b border-border py-3 px-4 md:px-6`
     - Map over filtered guests, render `<GuestRow>` for each with `isSelected={guest.id === selectedGuestId}` and `onClick={() => onGuestClick(guest.id)}`
     - If filtered list is empty: show "NO_RESULTS // QUERY_MISMATCH" message in cyberpunk style, centered, muted text
  4. **Mobile layout** (`md:hidden`):
     - Use `getGuestsByTable()` or compute grouping inline: group filtered guests by `tableAssignment`. Null assignments go to "UNASSIGNED" group at end.
     - For each group: render `<TableGroupHeader>` with location (e.g., "LOCATION_A", "LOCATION_B" — derive from table name or use a simple mapping), table name (e.g., "TABLE 01" from "TABLE_04"), seat count (guests in group) and total seats (hardcode 8 per table, or derive from data).
     - Below each header: render `<GuestRow>` for each guest in the group.
     - UNASSIGNED group: location = "UNASSIGNED", tableName = "NO TABLE", seatCount = count, totalSeats = 0.
     - If filtered list is empty on mobile: same "NO_RESULTS // QUERY_MISMATCH" empty state.
  5. Wrap in a `<div className="flex-1 overflow-y-auto">` for scrollability.
- **Project context**:
  - Framework: React 19, TypeScript strict
  - Conventions: No semicolons, single quotes, 2-space indent, function declaration, default export
  - Libraries: Import `type { Guest }` from `../../data/mock-guests`. Import `GuestRow` from `../molecules/`, `TableGroupHeader` from `../molecules/`. Tailwind responsive classes.
- **Dependencies**: TASK-001 (Guest type, getGuestsByTable), TASK-003 (molecules: GuestRow, TableGroupHeader)
- **Acceptance criteria**: Desktop renders flat table with 4 column headers and all guest rows. Mobile renders guests grouped by table with TableGroupHeader. Search filtering works (case-insensitive). Empty state displays cyberpunk message. Selected guest highlighted. Matches AC-6, AC-7, AC-12, AC-15, AC-23, AC-24, edge cases 2, 3, 9.

---

#### TASK-008: Organism — GuestDetailPanel

- **Description**: Create the right detail panel: guest details with metadata, preferences, logistics, and action buttons. Desktop only.
- **Files**: `src/components/organisms/GuestDetailPanel.tsx` (create)
- **Instructions**:
  1. Props: `guest: Guest, onClose: () => void`
  2. Render an `<aside>` with `hidden md:flex flex-col w-[320px] min-w-[320px] bg-surface border-l border-border h-full overflow-y-auto`
  3. Header: "GUEST_DETAILS" in `text-label text-foreground-muted tracking-wider` + IconButton close (X) icon on the right. `flex items-center justify-between px-4 py-3 border-b border-border`.
  4. Guest identity section: Avatar (lg size), guest name (`${firstName} ${lastName}` uppercase, `text-heading-4`), role in `text-body-sm text-foreground-muted`. Centered, `py-6 px-4 text-center`.
  5. GuestDetailSection "CORE METADATA":
     - Status: StatusBadge with guest's status
     - Access Level: guest.accessLevel in text-body-sm
     - Assigned Table: guest.tableAssignment or "- - -"
     - Each as a label/value row: label in `text-caption text-foreground-muted`, value in `text-body-sm text-foreground`
  6. GuestDetailSection "PREFERENCES":
     - Dietary: `guest.dietary.type` or "NO_RESTRICTIONS"
     - Notes: `guest.dietary.notes` or "NONE"
  7. GuestDetailSection "LOGISTICS":
     - Shuttle: If `shuttleRequired`, show `shuttleFrom` value; else "N/A"
     - Lodging: If `lodgingBooked`, show `lodgingVenue` value; else "N/A"
  8. Action buttons at bottom: `px-4 py-4 mt-auto border-t border-border flex gap-3`
     - "CONTACT" button using `.btn-secondary` class
     - "UPDATE" button using `.btn-primary` class
     - Both non-functional (no onClick behavior beyond default button states)
  9. Transition: `transition-all duration-200` on the aside for smooth appearance (CSS transition is acceptable per spec scope).
- **Project context**:
  - Framework: React 19, TypeScript strict
  - Conventions: No semicolons, single quotes, 2-space indent, function declaration, default export
  - Libraries: Import `type { Guest }` from `../../data/mock-guests`. Import `Avatar`, `StatusBadge`, `IconButton` from `../atoms/`, `GuestDetailSection` from `../molecules/`. Use `.btn-primary`, `.btn-secondary` classes. Tailwind classes.
- **Dependencies**: TASK-001 (Guest type), TASK-002 (atoms: Avatar, StatusBadge, IconButton), TASK-003 (molecule: GuestDetailSection)
- **Acceptance criteria**: Panel shows guest name, role, avatar, three sections (metadata, preferences, logistics), and two action buttons. Close button calls onClose. Handles all edge cases (null dietary, null logistics, null table). Hidden on mobile. Matches AC-12, AC-13, AC-14, edge cases 4, 5.

---

#### TASK-009: Organism — GuestListFooterStats

- **Description**: Create the bottom stat cards section: confirmation rate, dietary flags, RSVP deadline. Desktop only.
- **Files**: `src/components/organisms/GuestListFooterStats.tsx` (create)
- **Instructions**:
  1. Props: `confirmationRate: number, dietaryFlagCount: number`
  2. Render `hidden md:flex` wrapper with `gap-4 px-4 md:px-6 py-4 border-t border-border`
  3. Three StatCards:
     - "CONFIRMATION RATE": value `${confirmationRate}%`, child: a progress bar div (outer `bg-gray-800 rounded-full h-2 w-full mt-2`, inner `bg-primary rounded-full h-2` with `width: ${confirmationRate}%` inline style)
     - "DIETARY FLAGS": value `dietaryFlagCount`, child: a small badge or indicator "REQUIRES ATTENTION" in `text-caption` if count > 0
     - "RSVP DEADLINE": value "T-08D" (static mock), child: a badge `<span className="badge">URGENT</span>` using the existing `.badge` class
  4. Hidden on mobile via `hidden md:flex`.
- **Project context**:
  - Framework: React 19, TypeScript strict
  - Conventions: No semicolons, single quotes, 2-space indent, function declaration, default export
  - Libraries: Import `StatCard` from `../atoms/`. Use `.badge` class from index.css. Tailwind classes.
- **Dependencies**: TASK-002 (atom: StatCard)
- **Acceptance criteria**: Three stat cards render with correct data. Progress bar for confirmation rate. Dietary flags with urgency indicator. RSVP deadline with URGENT badge. Hidden on mobile. Matches AC-11.

---

#### TASK-010: Organism — BottomTabBar

- **Description**: Create the fixed bottom tab bar with 4 tabs for mobile navigation.
- **Files**: `src/components/organisms/BottomTabBar.tsx` (create)
- **Instructions**:
  1. Props: `activeTab: string, onTabChange: (tab: string) => void`
  2. Render a `<nav>` with `md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border`
  3. Inner: `flex items-center justify-around py-2 px-4`
  4. Four TabBarItems:
     - "CANVAS" with pencil/edit inline SVG icon, `isActive: activeTab === 'canvas'`, `onClick: () => onTabChange('canvas')`
     - "GUESTS" with person inline SVG icon, `isActive: activeTab === 'guests'`, `onClick: () => onTabChange('guests')`
     - "TOOLS" with wrench inline SVG icon, `isActive: activeTab === 'tools'`, `onClick: () => onTabChange('tools')`
     - "MORE" with horizontal dots inline SVG icon, `isActive: activeTab === 'more'`, `onClick: () => onTabChange('more')`
  5. The active tab (GUESTS when `activeTab === 'guests'`) has cobalt highlight on icon background and cobalt text.
  6. Hidden on desktop via `md:hidden`.
- **Project context**:
  - Framework: React 19, TypeScript strict
  - Conventions: No semicolons, single quotes, 2-space indent, function declaration, default export
  - Libraries: Import `TabBarItem` from `../atoms/`. Tailwind classes. Inline SVGs for icons.
- **Dependencies**: TASK-002 (atom: TabBarItem)
- **Acceptance criteria**: Tab bar renders 4 tabs with icons and labels. Active tab has cobalt highlight. Clicking a tab calls onTabChange. Hidden on desktop. Matches AC-25, AC-28.

---

#### TASK-011: App Shell — Root Layout, Routing, and Integration

- **Description**: Replace the Vite template App.tsx with the full app shell. Wire up React Router query-param tab switching, CSS Grid layout, state management for selected guest and search, and integrate all organisms. Modify `#root` styles in index.css. Remove App.css.
- **Files**:
  - `src/App.tsx` (replace)
  - `src/App.css` (empty/delete contents)
  - `src/index.css` (modify `#root` rule, lines 185–195)
- **Instructions**:
  1. **Modify `src/index.css`**: Change the `#root` rule from:
     ```css
     #root {
       width: 1126px;
       max-width: 100%;
       margin: 0 auto;
       text-align: center;
       border-inline: 1px solid var(--nc-border);
       min-height: 100svh;
       display: flex;
       flex-direction: column;
       box-sizing: border-box;
     }
     ```
     To:
     ```css
     #root {
       width: 100%;
       min-height: 100svh;
       display: flex;
       flex-direction: column;
       box-sizing: border-box;
     }
     ```
     Remove `max-width`, `margin`, `text-align`, `border-inline`. Keep `width: 100%`, `min-height: 100svh`, `display: flex`, `flex-direction: column`, `box-sizing`.
  2. **Empty `src/App.css`**: Remove all contents (or delete the file and remove the import).
  3. **Rewrite `src/App.tsx`**:
     - Remove old imports (`useState` counter, logos, heroImg, `./App.css`)
     - Import `{ useState }` from `'react'`, `{ useSearchParams }` from `'react-router'`
     - Import `{ guests, getConfirmedCount, getPendingCount, getConfirmationRate, getDietaryFlagCount, getTotalGuests, getWaitlistCount }` from `'./data/mock-guests'`
     - Import type `{ Guest }` from `'./data/mock-guests'` (separate type import)
     - Import all organisms: TopNav, LeftSidebar, GuestListHeader, GuestTable, GuestListFooterStats, GuestDetailPanel, BottomTabBar
     - Import FAB from atoms
     - Use `useSearchParams` to read `tab` param: `const [searchParams, setSearchParams] = useSearchParams()`
     - Derive `activeTab`: `searchParams.get('tab') ?? 'guests'`. If value is not 'guests' or 'canvas', default to 'guests' (AC-18). Handle 'tools' and 'more' for mobile tabs — these are recognized but show placeholder.
     - `onTabChange` function: `(tab: string) => setSearchParams({ tab })`
     - `const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null)`
     - `const [searchQuery, setSearchQuery] = useState('')`
     - `onGuestClick` function: toggle logic — if clicking same guest, set to null; if different, set to new ID (DD-6, edge cases 6, 7)
     - `selectedGuest`: find from guests array by selectedGuestId
     - Layout structure:
       ```
       <div className="flex flex-col h-screen">
         <TopNav ... />
         <div className="flex flex-1 overflow-hidden">
           <LeftSidebar />
           <main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
             {activeTab === 'guests' ? (
               <>
                 <GuestListHeader ... />
                 <GuestTable ... />
                 <GuestListFooterStats ... />
               </>
             ) : (
               <div className="flex-1 flex items-center justify-center text-foreground-muted text-label tracking-wider">
                 CANVAS // MODULE_OFFLINE
               </div>
             )}
           </main>
           {selectedGuest && activeTab === 'guests' && (
             <GuestDetailPanel guest={selectedGuest} onClose={() => setSelectedGuestId(null)} />
           )}
         </div>
         <FAB onClick={() => {}} label="Add guest" />
         <BottomTabBar activeTab={activeTab} onTabChange={onTabChange} />
       </div>
       ```
     - Mobile padding: `main` needs `pb-16 md:pb-0` to account for fixed bottom tab bar
     - FAB visible on mobile only (component handles its own `md:hidden`)
     - BottomTabBar visible on mobile only (component handles its own `md:hidden`)
     - Pass all necessary props to organisms
  4. Ensure `function App()` with `export default App` pattern
  5. No semicolons, single quotes, 2-space indent
- **Project context**:
  - Framework: React 19, React Router 7 (`useSearchParams`), TypeScript strict
  - Conventions: No semicolons, single quotes, 2-space indent, function declarations, default export. `verbatimModuleSyntax` — use `import type` for type-only imports.
  - Libraries: React Router `useSearchParams` for tab switching. Tailwind classes for layout. All design tokens from index.css.
  - Guardrails: G-3 (use `var(--nc-*)` in custom CSS, never raw hex), G-4 (dark mode only)
- **Dependencies**: TASK-001 through TASK-010 (all data and components must exist)
- **Acceptance criteria**:
  - App renders at `/` with guest list as default tab (AC-1, AC-2)
  - Tab switching works via query params: `/?tab=guests`, `/?tab=canvas` (AC-3, AC-17)
  - Unrecognized tab values default to guests (AC-18)
  - Three-panel desktop layout: top nav, left sidebar, main content (AC-2)
  - Detail panel opens on guest click, closes on X, toggles on same-guest click (AC-12, AC-13, AC-14, edge cases 6, 7)
  - Search filters guest table by name (AC-15, edge case 8)
  - Mobile layout: single column, no sidebar, no detail panel, bottom tab bar, FAB (AC-20, AC-25, AC-26, AC-27, AC-28)
  - `#root` is full-viewport width
  - App.css is empty/removed
  - Component structure follows atomic design with no barrel files (AC-19)

### Execution Order

```
Phase 1 (Independent — can run in parallel):
  └── TASK-001: Mock Data Module

Phase 2 (Depends on TASK-001):
  └── TASK-002: Atom Components

Phase 3 (Depends on TASK-001 + TASK-002):
  ├── TASK-003: Molecule Components
  ├── TASK-006: GuestListHeader (depends on TASK-002 only)
  ├── TASK-009: GuestListFooterStats (depends on TASK-002 only)
  └── TASK-010: BottomTabBar (depends on TASK-002 only)

Phase 4 (Depends on TASK-003):
  ├── TASK-004: TopNav (depends on TASK-002 only — can run in Phase 3)
  ├── TASK-005: LeftSidebar (depends on TASK-003)
  ├── TASK-007: GuestTable (depends on TASK-001, TASK-003)
  └── TASK-008: GuestDetailPanel (depends on TASK-001, TASK-002, TASK-003)

Phase 5 (Depends on ALL above):
  └── TASK-011: App Shell — Root Layout, Routing, Integration
```

Optimal parallel grouping:

| Phase | Tasks                                            | Can Parallelize                             |
| ----- | ------------------------------------------------ | ------------------------------------------- |
| 1     | TASK-001                                         | Single task                                 |
| 2     | TASK-002                                         | Single task (depends on TASK-001 for types) |
| 3     | TASK-003, TASK-004, TASK-006, TASK-009, TASK-010 | Yes — all 5 can run in parallel             |
| 4     | TASK-005, TASK-007, TASK-008                     | Yes — all 3 can run in parallel             |
| 5     | TASK-011                                         | Single task (integration)                   |

### Verification Checklist

- [ ] `tsc -b` compiles without errors
- [ ] `npm run lint` passes
- [ ] `npx prettier --check .` passes
- [ ] App loads at `/` and shows guest list (AC-1)
- [ ] Three-panel desktop layout renders correctly (AC-2)
- [ ] Top nav shows brand, nav links, search, settings, avatar (AC-3)
- [ ] Left sidebar shows session info, nav items, ADD GUEST, HISTORY (AC-4)
- [ ] Guest list header shows label, title, stat cards (AC-5)
- [ ] Data table has correct columns and all mock guests (AC-6, AC-7)
- [ ] Status badges show correct variants (AC-8, AC-9, AC-10)
- [ ] Footer stat cards show rate, dietary, deadline (AC-11)
- [ ] Clicking a guest row opens detail panel (AC-12)
- [ ] Detail panel shows all sections and action buttons (AC-13)
- [ ] Close button closes detail panel (AC-14)
- [ ] Search input filters guest list by name (AC-15)
- [ ] ADD GUEST button provides visual feedback only (AC-16)
- [ ] `/?tab=canvas` shows canvas placeholder with active indicator (AC-17)
- [ ] Unrecognized tab defaults to guests (AC-18)
- [ ] Components organized in atoms/molecules/organisms, no barrel files (AC-19)
- [ ] Mobile: single-column layout, no sidebar, no detail panel (AC-20)
- [ ] Mobile: simplified top bar (AC-21)
- [ ] Mobile: header with SYSTEM_LOG, stat cards with cobalt border (AC-22)
- [ ] Mobile: guests grouped by table (AC-23)
- [ ] Mobile: guest rows show seat, name, role, status icon (AC-24)
- [ ] Mobile: bottom tab bar with 4 tabs (AC-25)
- [ ] Mobile: FAB visible (AC-26)
- [ ] Mobile: guest tap highlights row but no detail panel (AC-27)
- [ ] Mobile: tab bar changes tab query param (AC-28)
- [ ] Edge case: no guest selected on load — panel hidden (EC-1)
- [ ] Edge case: search with no results shows empty state (EC-2)
- [ ] Edge case: null table shows "- - -" (EC-3)
- [ ] Edge case: null dietary shows NO_RESTRICTIONS (EC-4)
- [ ] Edge case: null logistics shows N/A (EC-5)
- [ ] Edge case: clicking different guest switches panel (EC-6)
- [ ] Edge case: clicking same guest closes panel (EC-7)
- [ ] Edge case: clearing search restores full list (EC-8)
- [ ] Edge case: unassigned guests in UNASSIGNED group on mobile (EC-9)
- [ ] Edge case: resize across 768px switches layout (EC-10)

## Notes

- This is the first screen being built. The current `App.tsx` contains the default Vite+React template which will be replaced.
- `App.css` can be removed or gutted since the old template styles are no longer needed.
- The Nought Cobalt design system (spec `nought-cobalt-design-system`) provides all color tokens, typography, and component base styles via `src/index.css`. This spec builds on those tokens.
- React Router 7 is installed (`react-router@^7.14.0`) and `BrowserRouter` is already wrapping `<App />` in `main.tsx`. The app renders at `/` with tab switching via query params (`useSearchParams`). No sub-route definitions are needed — only the root route exists.
- The "CANVAS" nav link should set `?tab=canvas`. The Canvas tab content is out of scope — it can show a placeholder. The "GUEST LIST" nav link should set `?tab=guests`.
- Non-functional buttons (ADD GUEST, CONTACT, UPDATE) should have correct styling and cursor/hover states but no wired-up behavior beyond visual feedback. They exist to match the design; actual functionality is a future spec.
- The `#root` container in `index.css` currently has `width: 1126px` and `text-align: center` — this will likely need to be adjusted to `width: 100%` or removed to support the full-viewport three-panel layout. This is a technical plan concern.
- For the DECLINED status badge, a muted red color is needed but not defined in the Nought Cobalt design system. Use Tailwind's built-in red scale at reduced opacity (e.g., `red-500/50` border, `red-400/70` text) to keep it subdued within the dark theme.

## Changelog

- 2026-04-03: Initial draft
- 2026-04-03: Changed routing approach — replaced sub-routes (`/guests`, `/canvas`) and redirects with query-param-based tab switching at root `/` (e.g., `/?tab=guests`, `/?tab=canvas`). Updated AC-1, AC-3, AC-17/18/19, DD-5, In Scope, and Notes.
- 2026-04-03: Added responsive mobile layout from design reference. Added DD-11 through DD-16, AC-20 through AC-28, edge cases 9-10, mobile user stories 6-8, updated component breakdown to shared-component approach (no duplicate mobile components — responsive Tailwind classes control visibility/layout per viewport).
- 2026-04-03: Technical Plan populated by TPM agent. 11 tasks across 5 phases: mock data module, 9 atoms, 4 molecules, 7 organisms, app shell integration. Impact analysis covers 25 files (3 modified, 22 created). Full verification checklist maps all 28 ACs + 10 edge cases.
- 2026-04-03: Implementation completed. All 11 tasks passed TPM verification. Validator review found 1 CRITICAL + 4 MAJOR issues — all fixed in iteration 1. Build succeeds. Status set to Completed.
