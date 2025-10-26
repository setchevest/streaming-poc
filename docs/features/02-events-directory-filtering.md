# Feature Specification: Events Directory & Filtering

## Description
Comprehensive events browsing page with advanced filtering by sport, status (live/upcoming/ended), date, and search. Supports pagination and sorting options.

## User / Role
Sports enthusiasts looking to find specific matches/events

## Business Value
Reduces time to find relevant content, increases event viewership by 25%, supports user retention through personalized discovery

## Acceptance Criteria

* Filters: Sport categories (dynamic from API), status (all/live/upcoming/ended), date ranges
* Search by event title, team names, sports
* Pagination with 12 events per page (configurable)
* Sort options: Latest, Popular, Start Time, Alphabetical
* Real-time filter counts and loading states
* URL-based state for shareability
* Mobile: Collapsible drawer for filters

## Dependencies
* Events API with filtering endpoints, sports taxonomy data
* Event card components, filter UI components

## Design

### Layout Architecture
The events directory employs a sidebar layout pattern with advanced filtering capabilities, following the soft dystopian aesthetic with weathered textures and muted color schemes.

#### Main Layout Structure (Desktop)
- **Grid System**: 4-column arrangement (1-3-0 split)
- **Sidebar Width**: Fixed 280px width with canvas background treatment
- **Content Area**: Flexible 3-column content with responsive max-widths
- **Container**: PageContainer component with responsive padding and centering

#### Filter Sidebar (Sticky Positioning)
- **Positioning**: Sticky top position (80px offset from header)
- **Visual Design**:
  - Canvas card variant background with subtle texture overlay
  - Large padding (24px) for comfortable touch interactions
  - Ash-colored separators (1px borders, 30% opacity) between filter groups
- **Section Organization**:
  - Status filters (radio button group, signal accent on selection)
  - Sports categories (dynamic list with event count badges)
  - Date ranges (dropdown selection with clay accent backgrounds)
  - Clear filters action (ghost button, conditional visibility)

#### Main Content Grid
- **Grid Configuration**:
  - 3-column responsive layout (desktop/tablet)
  - EventCard components (standard variant) × 12 per page
  - 24px gaps between cards for proper visual breathing
- **Results Header**:
  - Results count (monospace font, small size, ash color)
  - Sort dropdown (select component with fog background)
  - Full-width flex layout with right-aligned sort control
- **Empty States**: Centered messaging with clear filters action button

### Component Specifications
- **FilterSection**: Vertical stack with 20px spacing, monospace labels
- **FilterChip**: Badge variants (moss for active, concrete for inactive)
- **EventCard**: Standard variant with worn shadows and clay hover effects
- **SortSelector**: Dropdown component matching input styling aesthetics
- **ClearFiltersButton**: Ghost variant, clay accent on hover

### Mobile Adaptations
- **Breakpoint (<768px)**: Single column stack, filter drawer overlay
- **Filter Access**: Collapsible drawer triggered by "Filters" button
- **Touch Optimization**: 44px minimum touch targets, gesture support
- **Navigation**: Bottom sheet pattern for filter selection
- **Grid Adaptation**: 1-column card layout with optimized spacing

### Interactive Design
- **Filter Application**: URL-based state management, immediate results update
- **Visual Feedback**: Skeleton loading states during filter transitions
- **Animation**: Smooth opacity transitions (200ms) on filter changes
- **Accessibility**: ARIA labels, keyboard navigation support
- **Progressive Enhancement**: Client-side filtering fallback available

### Visual Consistency
All design elements adhere to the soft dystopian system:
- **Color Palette**: Stone text on dust backgrounds, signal accents for active states
- **Typography**: Body text with relaxed line-height, monospace for technical labels
- **Textures**: Subtle noise overlays, canvas backgrounds for specialized areas
- **Shadows**: Worn shadow effects with 2px blur, 0.1 opacity for layers
- **Spacing**: Consistent 4px scale (16px, 24px, 32px increments)
