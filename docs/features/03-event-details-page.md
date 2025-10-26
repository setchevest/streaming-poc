# Feature Specification: Event Details Page

## Description
Detailed information page for individual sports events showing teams, venue, statistics, and real-time status. Provides clear paths to watch live or set reminders.

## User / Role
Users viewing event information, fans of specific teams/sports

## Business Value
Increases conversion to live viewing by 30%, improves user understanding of events, supports engagement through related content

## Acceptance Criteria

* Event metadata: Teams, venue, date/time, sport category
* Status indicators: Live/Upcoming/Ended badges
* Statistics panel (when available): Viewers, head-to-head records
* Clear CTAs: "Watch Live" (live), "Set Reminder" (upcoming)
* Related events sidebar (same sport)
* SEO optimization with structured data
* Mobile: Vertical stacked layout

## Dependencies
* Event detail API, statistics endpoints, live stream URLs
* Team logos/images, venue information

## Design

### Page Layout Framework
The event detail page implements a comprehensive sidebar layout optimized for detailed content consumption, embracing the soft dystopian aesthetic through weathered materials and strategic visual hierarchy.

#### Responsive Grid Structure
- **Desktop Layout**: 3-column grid (1-2-1 relationship, centered content)
- **Tablet Adaptation**: Stacked vertical layout (768px-1024px) with maintained proportions
- **Mobile Stacking**: Single-column arrangement (<768px) with prioritized content hierarchy

#### Hero Section (Full Width)
- **Aspect Ratio**: Fixed 16:9 container with responsive scaling
- **Visual Treatment**:
  - Primary event imagery with gradient vignette overlay
  - Canvas texture background with subtle noise application
  - Status badge (top-left absolute positioning, elevated z-index)
- **Typography Hierarchy**:
  - Display-heading event name (stone color, shadow elevation)
  - Monospace sport metadata (small size, ash color)
- **Border Elements**: Rust-colored accent borders with aged appearance

#### Metadata Information Row
- **Flex Layout**: Horizontal arrangement with 16px element spacing
- **Icon Integration**: 18px icons preceding each data point (calendar, map pin, users)
- **Typography**: Compact information display (small body text, concrete color)
- **Responsive Flexibility**: Wrap-capability for mobile devices (flex-wrap implementation)

#### Content Organization
- **Primary Content Column** (2/3 width): Event narrative and core information
- **Sidebar Column** (1/3 width): Contextual recommendations and real-time data
- **Sticky Positioning**: Sidebar maintains visibility during scroll navigation

### Team and Content Sections
#### Teams Information Panel
- **Card Container**: Canvas variant with substantial padding (24px vertical/horizontal)
- **Layout Structure**: 2-column equal-width configuration for competitive balance
- **Team Element Design**:
  - Centered vertical alignment (flex column, items-center)
  - 80px×80px team logos with circular treatment and opacity layering
  - Title typography for team names (stone color, hierarchical prominence)
  - Caption statistics (ash color, monospace styling)
- **Separator Element**: "vs" divider positioned between competitors

#### Event Description Section
- **Content Container**: Flat card variant with generous padding (large configuration)
- **Typography**: Relaxed body text (1.6 line-height) promoting readability
- **Spatial Organization**: Full-width utilization with no artificial constraints

### Statistics and Analytics Display
#### Enhanced Statistics Panel
- **Premium Card Treatment**: Canvas background with pattern overlay
- **Grid Organization**: Responsive 4-column structure (2 columns on constrained displays)
- **Statistical Element Format**:
  - Display-scale numerical values (32px stone typography)
  - Uppercase caption labels (ash color, wide character spacing)
- **Visual Hierarchy**: Consistent centering with 16px element separation
- **Dynamic Data**: Real-time updates with smooth number transitions

#### Sidebar Content Architecture
- **Related Events Display**: Vertical stacking with 16px inter-element spacing
- **EventCard Components**: Compact variant optimized for sidebar integration
- **Sticky positioning**: 80px top offset maintaining persistent availability
- **Live Stream Statistics**: Conditional display during active event streaming

### Call-to-Action Strategy
#### Primary Action Elements
- **Live Status**: Primary button with signal accent and worn shadow treatment
- **Upcoming Status**: Secondary button variant with moss accent coloring
- **Completed Status**: Worn button styling for historical content access

#### Responsive Touch Optimization
- **Mobile Adaptation**: Full-width button implementation (minimum 44px vertical touch target)
- **Desktop Refinement**: Auto-width configuration with centered page alignment
- **Loading States**: Skeleton button representation during content transitions

### Visual Language Implementation
- **Color Harmony**: Stone headings with dust substrate backgrounds
- **Animation Protocol**: 300ms ease-out transitions with reduced motion option support
- **Texture Integration**: 3% opacity noise overlays enhancing surface authenticity
- **Accessibility Compliance**: Proper heading progression and focus management protocols
