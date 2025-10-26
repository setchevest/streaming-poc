# Reusable Components Architecture - Sports Streaming Platform

## Overview

This document outlines the reusable component library and architectural patterns for the Sports Streaming Platform. Based on the requirements from `docs/specifications.md`, design system foundations from `docs/design/design-system.md`, and feature implementations across `docs/features/`, this architecture establishes a consistent, scalable component ecosystem following the soft dystopian aesthetic.

## Architecture Principles

### Component Organization
- **Atomic UI Components**: `/components/ui/` - Foundational, reusable UI primitives
- **Feature Components**: `/components/features/` - Business-logic components for specific use cases
- **Layout Components**: `/components/layouts/` - Structural components for page organization
- **Server vs Client Components**: Server components prioritized for performance, client components for interactive features

### Design System Adherence
All components follow the soft dystopian design system:
- Color palette: Muted earth tones, faded pastels, silhouetted text hierarchy
- Typography: Inter (sans-serif) + JetBrains Mono (monospace) with 6-scale type system
- Visual elements: Noise overlays (3%), worn shadows, canvas textures, subtle gradients

## Component Library

### 1. Atomic UI Components (`/components/ui/`)

#### Button Component
**Description**: Versatile button component supporting multiple variants for different contexts, with wear-and-tear aesthetic styling.

**Architecture Location**: `/components/ui/Button.tsx`

**Supported Variants** (Design System Reference):
- Primary: Signal green background, worn shadow - primary CTAs
- Secondary: Concrete background, lighter text - secondary actions
- Ghost: Transparent with ash border - tertiary actions
- Worn: Clay background, aged appearance - special/archive contexts

**Size Variants**: Small (32px height), Medium (40px), Large (48px)

**Reuse Patterns**:
- Homepage Feature 1: "Watch Live Now" CTA (primary variant)
- Events Directory Feature 2: Filter actions, search triggers
- Live Streaming Feature 4: Video controls (play/pause, fullscreen)
- Real-time Chat Feature 5: Send message action
- Navigation Feature 7: Header actions, language switcher

#### Card Component
**Description**: Container component with layered, worn aesthetic supporting content organization and visual hierarchy.

**Architecture Location**: `/components/ui/Card.tsx`

**Supported Variants** (Design System Reference):
- Default: Dust background, ash border, worn shadow - standard content
- Elevated: Fog background, layered shadow - featured/highlighted content
- Flat: Dust background, no border/shadow - minimal containers
- Canvas: Canvas texture overlay - artistic/special sections

**Reuse Patterns**:
- Homepage Feature 1: Featured events, upcoming events sections
- Events Directory Feature 2: Event listings, filter panels
- Event Details Feature 3: Event metadata, statistics panels, team information
- Live Streaming Feature 4: Stream information panel, quality selector
- Real-time Chat Feature 5: Message container
- Analytics Feature 9: Statistics display panels

#### Badge Component
**Description**: Status indicators with muted color schemes for displaying event states and metadata.

**Architecture Location**: `/components/ui/Badge.tsx`

**Supported Variants** (Design System Reference):
- Live: Warning amber background, pulsing dot - active streaming
- Upcoming: Moss green background - scheduled events
- Ended: Concrete gray background - completed events
- Featured: Signal green background - highlighted content

**Reuse Patterns**:
- Homepage Feature 1: Live stream indicators, event status badges
- Events Directory Feature 2: Status filters, event states
- Event Details Feature 3: Event state display, stream status
- Live Streaming Feature 4: Current stream status, quality indicators

#### Input Component
**Description**: Form input with dystopian styling and validation states.

**Architecture Location**: `/components/ui/Input.tsx`

**Features** (Design System Reference):
- Fog background, ash border, focus state transitions
- Monospace font for technical inputs
- Error state handling with rust-colored accents

**Reuse Patterns**:
- Search & Navigation Feature 7: Global search input
- Events Directory Feature 2: Filter search inputs
- Real-time Chat Feature 5: Message input field
- Internationalization Feature 6: Language selector (within navigation)

#### Select/Dropdown Component
**Description**: Custom select component with consistent dystopian styling.

**Architecture Location**: `/components/ui/Select.tsx`

**Features** (Design System Reference):
- Matching input styling with canvas dropdown menu
- Ash border accents and signal hover states

**Reuse Patterns**:
- Events Directory Feature 2: Sort dropdown, sports filter
- Live Streaming Feature 4: Quality selector
- Analytics Feature 9: Time range selectors

#### Skeleton Component
**Description**: Loading state placeholders maintaining layout consistency during data fetching.

**Architecture Location**: `/components/ui/Skeleton.tsx`

**Supported Variants** (Design System Reference):
- Text: Ash background pulses for placeholder text
- Card: Full card dimensions with animation
- Video: 16:9 aspect ratio placeholders

**Reuse Patterns**:
- All Features: Initial load states across homepage, events directory, live streaming, event details

### 2. Feature Components (`/components/features/`)

#### EventCard Component (Server)
**Description**: Displays event information in a consistent card format optimized for listings and previews.

**Architecture Location**: `/components/features/EventCard.tsx` (Server Component)

**Key Props**:
- event: Event object with id, title, thumbnail, startTime, sport, status
- variant: 'featured' | 'standard' | 'compact'

**Reuse Patterns**:
- Homepage Feature 1: Featured events section (featured variant), upcoming events (standard)
- Events Directory Feature 2: Main grid results (standard), related events in sidebar
- Event Details Feature 3: Related events sidebar (compact variant)
- Search & Navigation Feature 7: Search results display

**Server Component Benefits**: Pre-renders event data, improved SEO and performance

#### VideoPlayer Component (Client)
**Description**: HLS video player with custom controls, quality selection, and dystopian UI overlay.

**Architecture Location**: `/components/features/VideoPlayer.tsx` (Client Component)

**Features**:
- HLS.js integration for adaptive streaming
- Custom overlay controls with auto-hide
- Quality selector, fullscreen support, keyboard shortcuts

**Reuse Patterns**:
- Homepage Feature 1: Hero stream section (optional)
- Live Streaming Feature 4: Main video player
- Event Details Feature 3: Preview player (if live)

#### NavigationHeader Component (Server)
**Description**: Global navigation with i18n language switcher and site branding.

**Architecture Location**: `/components/features/NavigationHeader.tsx` (Server Component)

**Structure**:
- Logo section (left): Branded icon and text
- Navigation menu (center): Home, Events, Live links
- Actions (right): Search, language switcher, user menu

**Reuse Patterns**:
- All Features: Site-wide navigation across homepage, events directory, event details, live streaming

#### LiveChat Component (Client)
**Description**: Real-time chat system for live sporting events with WebSocket integration.

**Architecture Location**: `/components/features/LiveChat.tsx` (Client Component)

**Features**:
- WebSocket message delivery, emoji support
- Auto-scroll, rate limiting, message history
- Connection status indicators

**Reuse Patterns**:
- Live Streaming Feature 4: Desktop sidebar, mobile tab
- Event Details Feature 3: Conditional display (if event is live)

#### EventFilters Component (Server)
**Description**: Advanced filtering sidebar for events page with URL-based state management.

**Architecture Location**: `/components/features/EventFilters.tsx` (Server Component)

**Filter Categories**:
- Status filters (live/upcoming/ended), sports categories, date ranges
- Server-side filtering with URL search params

**Reuse Patterns**:
- Events Directory Feature 2: Main filter sidebar
- Search & Navigation Feature 7: Search results filters

#### LanguageSwitcher Component (Client)
**Description**: Dropdown language selector integrated with next-intl localization system.

**Architecture Location**: `/components/features/LanguageSwitcher.tsx` (Client Component)

**Supported Languages**: English (en), Spanish (es), Portuguese (pt)

**Reuse Patterns**:
- All Features: Available in navigation header across entire platform
- Internationalization Feature 6: Core language switching functionality

#### EventStatsPanel Component (Server)
**Description**: Displays statistics and analytics for sporting events.

**Architecture Location**: `/components/features/EventStatsPanel.tsx` (Server Component)

**Layout Options**: Grid (2-4 columns) or horizontal flex

**Reuse Patterns**:
- Event Details Feature 3: Statistics section
- Live Streaming Feature 4: Real-time stats sidebar
- Analytics Feature 9: Comprehensive statistics dashboard

### 3. Layout Components (`/components/layouts/`)

#### PageContainer Component
**Description**: Consistent page wrapper providing max-width constraints and responsive padding.

**Architecture Location**: `/components/layouts/PageContainer.tsx`

**Max-Width Options**: sm (640px), md (768px), lg (1024px), xl (1280px), full

**Reuse Patterns**:
- All page-level features as root container
- Homepage Feature 1: Wraps all content sections
- Events Directory Feature 2: Main content container
- Event Details Feature 3: Page structure wrapper

#### SidebarLayout Component
**Purpose**: Two-column layout with configurable sidebar positioning and responsive behavior.

**Architecture Location**: `/components/layouts/SidebarLayout.tsx`

**Configuration Options**:
- sidebarPosition: 'left' | 'right'
- sidebarWidth: 'sm' | 'md' | 'lg'
- Mobile: Stacks vertically

**Reuse Patterns**:
- Events Directory Feature 2: Filters sidebar + content grid
- Event Details Feature 3: Info panel + main content
- Live Streaming Feature 4: Chat sidebar + video player

## Reuse Patterns by Feature

### Homepage Feature 1 (Dashboard)
- EventCard (featured variant × 3, standard variant × 4-6)
- VideoPlayer (conditional for live hero)
- Button (view all CTA, featured CTAs)
- Badge (live indicators)
- Card (section containers)
- PageContainer (root wrapper)

### Events Directory Feature 2 (Filtering)
- EventFilters (main filter panel)
- EventCard (grid results × 12 per page)
- Button (sort actions, pagination)
- Select (sort dropdown)
- Card (results container)
- Skeleton (loading states)
- SidebarLayout (main page structure)

### Event Details Feature 3 (Page)
- EventCard (related events × 3-5)
- Button (watch live/commit reminder CTAs)
- Badge (event status)
- Card (metadata panels, statistics)
- EventStatsPanel (statistics display)
- SidebarLayout (main content + related)
- PageContainer (root wrapper)

### Live Streaming Feature 4 (Video)
- VideoPlayer (main player)
- LiveChat (communication system)
- Badge (stream status, quality indicator)
- Button (player controls as ghost variants)
- Card (stream info panel)
- EventStatsPanel (real-time analytics)
- PageContainer (layout wrapper)

### Real-time Chat Feature 5 (Communication)
- LiveChat (primary component)
- Button (send message)
- Input (message field)
- Card (chat container)
- Badge (connection status)

### Internationalization Feature 6 (Language)
- LanguageSwitcher (header integration)
- Button (dropdown trigger)
- Select (within language switcher)

### Search & Navigation Feature 7 (Discovery)
- Input (search field with autocomplete)
- EventCard (search results)
- Button (search triggers, navigation)
- Select (sort/filter options)
- NavigationHeader (global navigation)

### Responsive Multi-device Feature 8 (Platform)
- PageContainer (responsive breakpoints)
- SidebarLayout (mobile stacking, tablet grids)
- EventCard (responsive aspect ratios)
- Button (size variants by breakpoint)
- NavigationHeader (mobile adaptations)

### Analytics Feature 9 (Statistics)
- EventStatsPanel (metrics display)
- Badge (status indicators)
- Card (analytics containers)
- Select (time range filters)

## Component Composition Patterns

### Atomic → Feature → Layout Hierarchy
1. **Atomic Components**: Base styling and interaction primitives
2. **Feature Components**: Business logic composition using atomic components
3. **Layout Components**: Structural organization of feature components

### Server vs Client Component Strategy
- **Server Components**: EventCard, NavigationHeader, EventFilters, EventStatsPanel
  - Data fetching integration
  - SEO benefits, performance optimization
- **Client Components**: VideoPlayer, LiveChat, LanguageSwitcher
  - Real-time interactions, browser APIs
  - WebSocket connections, media controls

## Design System Integration

### Color Usage Patterns
- **Signal (#8FA87E)**: Primary actions, success states (buttons, badges)
- **Concrete (#78716C)**: Body text, secondary elements
- **Ash (#A8A29E)**: Borders, dividers, tertiary text
- **Dust (#E7E5E4)**: Backgrounds, surface layers
- **Stone (#57534E)**: Primary text, headings
- **Rust (#A8826B)**: Special states, aged elements

### Typography Application
- **Display (40-48px)**: Page titles, hero content
- **Headline (24-32px)**: Section headers, card titles
- **Body (16px)**: Primary content, descriptions
- **Caption (12-14px)**: Metadata, status labels
- **Monospace**: Technical data, timestamps, code elements

### Visual Consistency Rules
- 3% noise overlay on all surfaces for aged aesthetic
- Worn shadows (2px blur, low opacity) for default elevation
- Layered shadows (4px-1px stacked) for elevated elements
- 4px increment spacing scale (8, 12, 16, 24, 32, 48px)
- Canvas texture application for specialized content areas

## Performance Considerations

### Server Component Benefits
- Reduced client-side JavaScript bundle
- Improved initial page load (TTFB, LCP)
- Better SEO through server-rendered HTML
- Parallel data fetching capabilities

### Client Component Necessity
- Used only when required (WebSocket connections, media APIs, browser storage)
- Lazy-loaded when possible to minimize bundle impact
- Hydration-optimized for progressive enhancement

### Reusability Impact
Each component designed for maximum flexibility:
- Flexible prop interfaces for variant behavior
- Consistent API patterns across component types
- Naming conventions following established patterns
- Documentation of supported use cases and limitations
