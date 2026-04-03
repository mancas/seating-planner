# Task Report — TASK-010: Organism — BottomTabBar

## Status: DONE

## File Created

- `src/components/organisms/BottomTabBar.tsx`

## Implementation Details

### Props Interface

- `activeTab: string` — identifies which tab is currently active
- `onTabChange: (tab: string) => void` — callback fired when a tab is tapped

### Structure

- `<nav>` wrapper with classes: `md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border`
  - Hidden on `md` and above; fixed to viewport bottom on mobile
- Inner `<div>` with `flex items-center justify-around py-2 px-4` for evenly spaced tabs

### Tabs Rendered

| Label  | Tab Value | Icon            |
| ------ | --------- | --------------- |
| CANVAS | `canvas`  | Pencil/edit     |
| GUESTS | `guests`  | Person          |
| TOOLS  | `tools`   | Wrench          |
| MORE   | `more`    | Horizontal dots |

Each tab is a `<TabBarItem>` from `../atoms/TabBarItem` receiving:

- `icon` — inline SVG (16x16, viewBox 0 0 24 24)
- `label` — uppercase tab name
- `isActive` — `activeTab === '<tab-value>'`
- `onClick` — `() => onTabChange('<tab-value>')`

### Conventions Followed

- No semicolons
- Single quotes
- 2-space indentation
- `function` declaration (not arrow)
- `export default` at bottom
- No barrel files
