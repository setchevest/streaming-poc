# Feature Specification: Homepage Dashboard

## Description
Main landing page showcasing featured live sports events, upcoming matches, and sport categories. Serves as the primary entry point for users to discover content and access live streams.

## User / Role
Sports fans, casual visitors, return users

## Business Value
Increases user engagement and time on site by 40%, improves stream discoverability, supports content marketing goals

## Acceptance Criteria

* Displays 1-3 active live streams with prominent placement
* Shows 3-6 featured events with clear CTAs
* Provides 6-12 sport category browsing options
* Loads in <2.5 seconds with skeleton loading states
* Fully responsive across mobile/desktop
* Supports internationalization

## Dependencies
* Live stream availability, event metadata API, image CDN
* Video player component, event card components

## Design

### Layout Structure
The homepage follows a progressive content loading approach with three distinct zones optimized for the soft dystopian aesthetic:

#### Hero Stream Section (Conditional - Full Width)
- **Layout**: VideoPlayer component with overlay information panel
- **Visual Treatment**:
  - 16:9 aspect ratio with rust-colored worn borders
  - Gradient overlay from shadow (transparent) to full opacity at bottom
  - Noise texture overlay at 3% opacity for weathered appearance
- **Content Overlay**:
  - Event title in Display typography (40px, stone color)
  - Sport category label (monospace, small, ash color)
  - Live indicator badge (warning color, pulsing animation)
  - Enhanced "Watch Live" primary button with worn shadow
- **Responsive**: Full width on all devices, height auto-adjusts to maintain aspect ratio

#### Featured Events Zone (3-4 Column Grid)
- **Layout**: Curated events grid using EventCard components (featured variant)
- **Grid Structure**:
  - Desktop/Tablet: 3 columns (1024px+) with 16px gaps
  - Mobile: 2 columns (768px-1023px) with 12px gaps
  - Full mobile: 1 column (<768px)
- **Visual Treatment**:
  - PageContainer wrapper with responsive max-widths
  - Section headline "Featured Events" (24px, stone color)
  - Elevated card variants with layered shadows for featured content
  - Right-aligned "View All" ghost button with clay accent color
- **Animation**: Smooth scale transitions (105%) on card hover with enhanced worn shadow

#### Upcoming Events Zone (4 Column Grid)
- **Layout**: Chronological event display with standard EventCard components
- **Grid Structure**:
  - Desktop: 4 columns (1280px+) with 16px gaps
  - Tablet: 2 columns (768px-1279px)
  - Mobile: 1 column (<768px)
- **Visual Treatment**:
  - Section title "Upcoming Events" matching featured section typography
  - Consistent padding and spacing with dust background containers
  - Ash-colored section separators (1px borders, 30% opacity)
- **Progressive Loading**: "Load More" secondary button with clay accent on interaction

### Component Specifications
- **VideoOverlay**: Canvas variant card, absolute positioning, backdrop-blur effect
- **EventCard (featured)**: Larger scale (1.2x), layered shadow elevation, premium visual treatment
- **EventCard (standard)**: Consistent aspect ratios, worn shadow effects, clay hover accents
- **Sections**: 32px vertical spacing, gradual fade-in animations (300ms ease-out)

### Responsive Design
- **Mobile (<768px)**: Single column stack, touch-optimized 44px minimum targets
- **Tablet (768-1024px)**: Hybrid layouts, 2-column grids, maintained readability
- **Desktop (>1024px)**: Full multi-column experience, enhanced hover interactions
- **Loading States**: Skeleton components matching exact grid layouts and proportions

### Color Harmony
All elements follow the soft dystopian palette with:
- Stone typography on dust/worn backgrounds
- Signal accents for primary actions
- Ash details for secondary information
- Subtle noise textures throughout for authentic weathered appearance
