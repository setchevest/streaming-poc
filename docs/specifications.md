# Sports Streaming Platform - Technical Specification Document

## Executive Summary

This document outlines the architecture and implementation details for a **sports streaming live platform** built with **Next.js 14+** (App Router), **TypeScript**, **Server-Side Rendering (SSR)**, and **next-intl** for internationalization. The platform features a **component-based architecture** optimized for **reusability**, **performance**, and the **"soft dystopian" aesthetic theme**.

## Table of Contents

- [1. Technology Stack](#1-technology-stack)
- [2. Project Architecture](#2-project-architecture)
- [3. Design System](#3-design-system)
- [4. Core Components Library](#4-core-components-library)
- [5. Page Structures](#5-page-structures)
  - [5.1 Homepage](#51-homepage-applocalepagetsx)
  - [5.2 Events Page](#52-events-page-applocaleeventspagetsx)
  - [5.3 Event Detail Page](#53-event-detail-page-applocaleevents-eventidpagetsx)
  - [5.4 Live Video Page](#54-live-video-page-applocalelive-streamidpagetsx)
- [6. Internationalization Strategy](#6-internationalization-strategy-next-intl)
- [7. Data Flow & State Management](#7-data-flow--state-management)
- [8. Performance Optimization](#8-performance-optimization)
- [Reference Documents](#reference-documents)

## 1. Technology Stack

### Core Technologies

| Component | Technology | Version/Details |
|-----------|------------|-----------------|
| **Framework** | Next.js 14+ | App Router with Server Components |
| **Language** | TypeScript | 5+ |
| **Styling** | Tailwind CSS | 3.4+ |
| **i18n** | next-intl | with middleware for locale detection |
| **Video Streaming** | HLS.js / Video.js | adaptive streaming |
| **State Management** | React Server Components + Zustand | minimal client-side state |
| **API Layer** | Next.js API Routes / Server Actions | RESTful API |

### Development Tools

- **Code Quality**: ESLint + Prettier
- **Git Hooks**: Husky for pre-commit hooks
- **Testing**: Jest + React Testing Library

## 2. Project Architecture

### Folder Structure

```
frontend/
├── app/
│   ├── [locale]/                    # Locale-based routing
│   │   ├── layout.tsx               # Root layout with i18n provider
│   │   ├── page.tsx                 # Homepage
│   │   ├── events/
│   │   │   ├── page.tsx             # Events listing page
│   │   │   └── [eventId]/
│   │   │       └── page.tsx         # Event detail page
│   │   └── live/
│   │       └── [streamId]/
│   │           └── page.tsx         # Live video player page
│   ├── api/                         # API routes
│   └── globals.css                  # Global styles + Tailwind
├── components/
│   ├── ui/                          # Atomic UI components
│   ├── features/                    # Feature-specific components
│   └── layouts/                     # Layout components
├── lib/
│   ├── utils/                       # Utility functions
│   ├── hooks/                       # Custom React hooks
│   └── api/                         # API client functions
├── messages/                        # i18n translation files
│   ├── en.json
│   ├── es.json
│   └── pt.json
├── types/                           # TypeScript type definitions
└── middleware.ts                    # next-intl middleware
```

## 3. Design System

This project implements a comprehensive **soft dystopian design system** that creates a **worn, muted atmosphere** evoking a functional but faded future. The design balances **rugged practicality** with **subtle elegance** while maintaining modern usability and accessibility standards.

For detailed information on the soft dystopian design system, including:

- **Complete color palette** (muted earth tones, faded pastels, interactive accents)
- **Typography system** (Inter & JetBrains Mono font families, 6-scale type system)
- **Visual elements** (textures, shadows, effects, animations)
- **Component styling guidelines** (buttons, cards, forms, layouts)
- **Responsive design patterns** and **accessibility standards**
- **Implementation guidelines** and **performance considerations**

See: `docs/design/design-system.md`

## 4. Core Components Library

This project implements a comprehensive **reusable component library** following the soft dystopian design system. The library is organized into **atomic UI components**, **feature components**, and **layout components**, prioritizing **reusability** and **maintainability**.

For detailed information on the component library architecture, including:

- **Component organization** (atomic UI, feature, layout components)
- **Detailed specification** for each component (Button, Card, Badge, Input, Select, EventCard, VideoPlayer, NavigationHeader, LiveChat, etc.)
- **Component architecture** and **reusability patterns** by feature area
- **Server vs Client component strategy** for optimal performance
- **Design system integration** and **implementation guidelines**
- **TypeScript interfaces** and **prop definitions**

See: `docs/web-architecture/reusable-components-architecture.md`

## 5. Page Structures

### 5.1 Homepage (`app/[locale]/page.tsx`)

**Purpose:** Landing page showcasing platform content  
**Rendering Strategy:** Server-Side Rendering (SSR) with dynamic data fetching

#### Data Requirements

- **Featured events** (3-6 items)
- **Live streams** (1-3 active)
- **Upcoming events** (4-8 items)
- **Sports categories** (6-12 items)

#### Page Sections

##### **Hero Section - Featured Live Stream**
- **Condition:** Only shows if there's an active live stream
- **Layout:** Full-width video player with overlay information
- **Components Used:**
  - `VideoPlayer` (autoplay off, poster visible)
  - `Badge` (live indicator)
- **Content:**
  - Event title (display typography)
  - Sport category (caption)
  - Viewer count (monospace)
  - "Watch Live" CTA button (primary variant)
- **Height:** Auto (aspect-video maintains 16:9)

##### **Featured Events Section**
- **Title:** "Featured Events" (headline typography)
- **Layout:** 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
- **Components Used:**
  - `EventCard` (featured variant) × 3
  - `Button` (view all, ghost variant)
- **Spacing:** 24px gap between cards
- **Right-aligned "View All" button**

##### **Upcoming Events Section**
- **Title:** "Upcoming Events" (headline typography)
- **Layout:** 4-column grid (desktop), 2-column (tablet/mobile)
- **Components Used:**
  - `EventCard` (standard variant) × 4-6
- **Spacing:** 16px gap between cards
- **Shows next 4-6 events chronologically**

##### **Sports Categories Section**
- **Title:** "Browse by Category" (headline typography)
- **Layout:** 6-column grid (desktop), 4-column (tablet), 2-column (mobile)
- **Components Used:**
  - `Button` (worn variant) × 6
- **Each Button Contains:**
  - Sport icon (emoji or SVG, 32px)
  - Sport name (small text)
- **Button Height:** 96px (h-24)
- **Hover Effect:** Transition to rust variant

#### Loading States

Each section uses **Suspense boundaries**:

- Skeleton loaders match section layouts
- Progressive hydration for interactive elements

#### Responsive Breakpoints

- **Mobile:** < 768px (stack sections, 1-2 columns)
- **Tablet:** 768px - 1024px (2-3 columns)
- **Desktop:** > 1024px (full layout, 3-4 columns)

#### Component Reuse Summary

- `PageContainer`: 1×
- `VideoPlayer`: 0-1× (conditional)
- `EventCard`: 7-9×
- `Button`: 8-10×
- `Badge`: 1-4×

### 5.2 Events Page (`app/[locale]/events/page.tsx`)

**Purpose:** Comprehensive listing of all sports events with advanced filtering  
**Rendering Strategy:** SSR with URL-based search params for filters

#### Data Requirements

- **All events** (paginated, 12 per page)
- **Sports categories** with event counts
- **Active filters** from URL params

#### URL Search Params

- `sport`: string (sport category slug)
- `status`: 'live' | 'upcoming' | 'ended' | 'all'
- `date`: 'today' | 'tomorrow' | 'thisWeek' | 'thisMonth'
- `search`: string (keyword search)
- `page`: number (pagination)

#### Page Layout

##### **Page Header**
- **Title:** "Sports Events" (display typography)
- **Description:** Brief intro paragraph (body typography)
- **Spacing:** 32px margin bottom

##### **Main Grid Layout**
- **Desktop:** 4-column grid (sidebar 1 col, content 3 cols)
- **Tablet:** 2-row stack (filters top, content bottom)
- **Mobile:** Single column stack
- **Gap:** 32px

##### **Sidebar - Filters (left column)**
- **Component:** `EventFilters`
- **Width:** 1 column (250-300px)
- **Position:** Sticky (top: 80px, stays visible on scroll)
- **Card Style:** Canvas variant with medium padding
- **Sections:**
  - Status filter (4 options)
  - Sports filter (dynamic list with counts)
  - Date range filter (4 options)
  - Clear filters button (conditional)

##### **Main Content Area (right 3 columns)**

###### **Results Header**
- **Left:** Result count (monospace, "24 events found")
- **Right:** Sort dropdown
  - Options: Latest, Most Popular, Start Time, A-Z
  - `Select` component with fog background
- **Height:** 40px
- **Margin Bottom:** 24px
- **Border Bottom:** Ash 30% opacity

###### **Events Grid**
- **Layout:** 3-column grid (within content area)
- **Tablet:** 2-column
- **Mobile:** 1-column
- **Components:** `EventCard` (standard variant) × 12
- **Gap:** 24px
- **Min Height:** 600px (prevents layout shift)

###### **Empty State** (if no results)
- Centered content
- **Message:** "No events found matching your filters"
- **Clear filters** button (primary variant)
- **Spacing:** 64px vertical padding

###### **Load More Section**
- **Condition:** Shows if more than 12 results available
- **Component:** `Button` (secondary variant, large size)
- **Text:** "Load More Events"
- **Alignment:** Center
- **Margin Top:** 32px

#### Loading States

- **Initial Load:** Full-page skeleton
- **Filter Changes:** Grid skeleton only (sidebar remains)
- **Load More:** Shows loading indicator, appends new cards

#### Filter Behavior

- Clicking filter **updates URL** via Next.js router
- Server **re-renders** with new data
- Scroll position **preserved** on filter changes
- **Multiple filters** combine (AND logic)
- **Clear all** resets to `/events`

#### Performance Optimizations

- **Suspense boundary** around EventsGrid component
- **Server Components** for filters and cards
- **Static sports categories** cached
- **Incremental static regeneration (ISR)** every 60 seconds

#### Component Reuse Summary

- `PageContainer`: 1×
- `SidebarLayout`: 1×
- `EventFilters`: 1×
- `EventCard`: 12× per page
- `Button`: 3-5×
- `Skeleton`: 12× (loading state)
- `Select`: 1× (sort dropdown)

#### Translation Keys Required

- `Events.pageTitle`
- `Events.pageDescription`
- `Events.eventsFound`
- `Events.sortBy.latest`
- `Events.sortBy.popular`
- `Events.sortBy.startTime`
- `Events.noEventsFound`
- `Events.loadMore`
- `Events.clearFilters`

### 5.3 Event Detail Page (`app/[locale]/events/[eventId]/page.tsx`)

**Purpose:** Detailed information about a specific event  
**Rendering Strategy:** SSR with dynamic params, ISR fallback

#### Data Requirements

- **Event details** (title, description, teams, stats, venue, time)
- **Related events** (same sport, 3-5 items)
- **Live stream URL** (if event is live)

#### URL Structure
`/[locale]/events/[eventId]`

- `eventId`: UUID or slug identifier

#### Page Layout

##### **Main Content Area (2/3 width)**

###### **Hero Image Section**
- **Component:** Next.js `Image` (priority loading)
- **Aspect Ratio:** 16:9
- **Styling:** Rounded-lg, shadow-layered
- **Overlay:** Status badge (top-left, absolute positioned)
- **Margin Bottom:** 24px

###### **Event Header**
- Sport category label (caption typography, ash color)
- Event title (display typography, shadow color)
- **Margin Bottom:** 16px

###### **Event Metadata Row**
- Icons + text for:
  - Date/time (calendar icon)
  - Venue (map pin icon)
  - Viewers (users icon, if live)
- **Layout:** Flex row, gap 16px
- **Wraps on mobile:** Flex-wrap
- **Icon Size:** 18px
- **Text:** Small, concrete color
- **Margin Bottom:** 24px

#### Call-to-Action

**If Live:**
- "Watch Live Now" button (primary variant, large size)
- Links to `/live/[streamId]`
- Full width on mobile, auto width on desktop

**If Upcoming:**
- "Set Reminder" button (secondary variant, large size)
- Opens reminder modal (future feature)

**If Ended:**
- "Watch Replay" button (worn variant) or hide if unavailable

- **Margin Bottom:** 32px

##### **Teams Section** (if applicable)
- **Component:** `Card` (canvas variant, large padding)
- **Title:** "Teams" (headline typography)
- **Layout:** 2-column grid with 32px gap
- **Each Team Cell:**
  - Centered layout (flex column, items-center)
  - Team logo (80×80px, `Image` component)
  - Team name (title typography, stone color)
  - Team record/stats (caption, ash color)
- **Margin Bottom:** 32px
- Shows "vs" divider between teams (stone color, caption)

##### **Description Section**
- **Component:** `Card` (flat variant, large padding)
- **Title:** "About This Event" (headline typography)
- **Content:** Paragraph text (body typography, concrete color)
- **Line Height:** Relaxed (1.75)
- **Max Width:** None (full width)
- **Margin Bottom:** 32px

##### **Statistics Panel** (if available)
- **Component:** `Card` (canvas variant, large padding)
- **Title:** "Statistics" (headline typography)
- **Layout:** 4-column grid (2 columns on mobile)
- **Each Stat:**
  - Number (display typography, 32px, stone color)
  - Label (caption typography, uppercase, ash color)
  - Centered alignment
- **Gap:** 16px
- **Common Stats:** Total viewers, peak viewers, duration, engagement rate
- **Margin Bottom:** 32px

##### **Venue Information** (optional)
- **Component:** `Card` (flat variant)
- **Title:** "Venue Details"
- **Content:** Address, capacity, facilities info
- **Map Integration:** Embedded map (future feature)

##### **Sidebar (1/3 width)**

###### **Related Events Section**
- **Container:** Sticky (top: 80px)
- **Title:** "Related Events" (title typography, stone color)
- **Margin Bottom:** 16px
- **Layout:** Vertical stack with 16px gap
- **Components:** `EventCard` × 3-5 (compact variant)
- **Filter Logic:** Same sport, exclude current event, upcoming first
- **Fallback:** If no related events, show "Popular Events"

###### **Streaming Information** (if live)
- **Component:** `Card` (elevated variant)
- **Content:**
  - Live indicator badge
  - Current viewer count
  - Stream quality info
  - Estimated end time
- **Position:** Above related events

#### Responsive Behavior

- **Desktop:** 3-column grid (main 2 cols, sidebar 1 col)
- **Tablet:** Stack vertically, sidebar below main content
- **Mobile:** Single column, full width

#### Loading States

- **Hero image:** Priority loading with blur placeholder
- **Main content:** Skeleton matching layout structure
- **Sidebar:** Separate Suspense boundary with skeleton cards

#### Error Handling

- **Invalid eventId:** Redirect to 404 page
- **Event not found:** Custom "Event Not Available" message
- **Network errors:** Retry button with error message

#### SEO Optimization

- **Dynamic metadata** (title, description, OG tags)
- **Structured data** (JSON-LD for Event schema)
- **Canonical URL** with locale
- **robots meta tags** based on event status

#### Static Generation Strategy

- **Popular events:** Pre-rendered at build time
- **Other events:** ISR with 60-second revalidation
- **generateStaticParams** for top 100 events

#### Component Reuse Summary

- `PageContainer`: 1×
- `SidebarLayout`: 1×
- `Card`: 3-5×
- `Badge`: 1-2×
- `Button`: 1-3×
- `EventCard`: 3-5× (sidebar)
- `Image`: 2-10× (hero, team logos)

#### Translation Keys Required

- `EventDetail.watchLive`
- `EventDetail.setReminder`
- `EventDetail.watchReplay`
- `EventDetail.teams`
- `EventDetail.aboutEvent`
- `EventDetail.statistics`
- `EventDetail.relatedEvents`
- `EventDetail.venue`
- `EventDetail.viewers`
- `EventDetail.watching`
- `EventDetail.stats.*` (dynamic stat labels)

### 5.4 Live Video Page (`app/[locale]/live/[streamId]/page.tsx`)

**Purpose:** Full live streaming experience with video player, chat, and real-time interactions  
**Rendering Strategy:** SSR initial load, then client-side real-time updates

#### Data Requirements

- **Stream metadata** (title, sport, teams, status)
- **HLS stream URL**
- **Chat room ID**
- **Related live streams**
- **Real-time viewer count**
- **Stream statistics**

#### URL Structure
`/[locale]/live/[streamId]`

- `streamId`: Unique stream identifier

#### Page Layout

##### **Desktop Layout (> 1024px)**
###### **Main Video Section (70% width)**
- **Component:** `VideoPlayer` (autoplay on)
- **Aspect Ratio:** 16:9
- **Position:** Sticky (follows scroll for short time)
- **Features:**
  - Custom controls overlay
  - Quality selector
  - Fullscreen mode
  - Picture-in-picture
  - Live badge (top-right corner)

###### **Below Player: Stream info panel**

##### **Chat Sidebar (30% width)**
- **Component:** `LiveChat`
- **Height:** Matches video player + info panel
- **Position:** Sticky (stays visible during scroll)
- **Features:**
  - Real-time messages
  - User badges
  - Emoji support
  - Message rate limiting
  - Auto-scroll
  - Connection status indicator

#### Stream Information Panel (below video)

- **Component:** `Card` (flat variant)
- **Layout:** Horizontal flex
- **Left Section:**
  - Event title (headline typography)
  - Sport category + team names (caption)
  - Viewer count with icon (updates every 5s)
- **Right Section:**
  - Share button (ghost variant)
  - Quality indicator badge
  - Settings menu button
- **Padding:** 16px
- **Border:** Top border, ash 30% opacity

##### **Tabs Section (below stream info)**
**Tab Options:**
- **Overview** (default)
- **Statistics**
- **About**
- **Chat Archive** (mobile only)

- **Styling:** Ghost buttons, signal underline for active
- **Margin Bottom:** 24px

##### **Tab Content Area**

###### **Overview Tab**
- Event description (body typography)
- **Teams section** (if applicable):
  - 2-column layout
  - Team logos, names, current scores
- Venue and time information
- **Related events carousel** (horizontal scroll)

###### **Statistics Tab**
- **Component:** `EventStatsPanel` (grid layout)
- **Real-time updating stats:**
  - Current viewers
  - Peak viewers
  - Average watch time
  - Chat activity
  - Stream uptime
- **Update Frequency:** Every 10 seconds

###### **About Tab**
- Long-form event description
- Sponsor information
- League/tournament details
- Social media links

##### **Related Live Streams** (below tabs)
- **Title:** "Other Live Events" (headline)
- **Layout:** Horizontal scrollable row
- **Components:** `EventCard` (compact, live events only) × 4-6
- **Scroll Behavior:** Smooth scroll with arrow buttons
- **Gap:** 16px

#### Mobile Layout (< 768px)

**Structure:**
- Full-width video player (top)
- Stream info panel (collapsible)
- Tabs navigation (sticky)
- Tab content (scrollable)
- Chat moved to separate tab
- Related streams at bottom

**Special Mobile Features:**
- Player exits fullscreen gracefully
- Landscape mode: Player only (hide all other content)
- Portrait mode: Vertical stack
- Floating chat button (if chat tab not active)
- Pull-to-refresh for stream reconnection

#### Tablet Layout (768px - 1024px)

Similar to desktop but narrower chat (25% width):
- Related streams: 2-column grid instead of horizontal scroll
- Stream info: May stack vertically if tight

#### Real-Time Features

##### **Viewer Count Updates**
- WebSocket or Server-Sent Events
- Updates every 5 seconds
- Smooth number animation on change
- Peak viewer badge appears when hitting records

##### **Stream Health Monitoring**
- Connection status indicator
- Automatic reconnection on disconnect
- Quality adjustment notifications
- Buffering state feedback

##### **Chat Integration**
- WebSocket connection to chat server
- Message batching for performance
- User authentication (if logged in)
- Moderation features (report, block)
- Slow mode indicator

##### **Analytics Tracking**
- Watch time
- Engagement events (play, pause, quality change)
- Chat participation
- Share actions

#### Loading States

- **Initial Load:** Video skeleton with pulse
- **Stream Connecting:** Spinner overlay with "Connecting to stream..."
- **Chat Loading:** Message skeleton loaders
- **Related Events:** Horizontal skeleton cards

#### Error States

- **Stream Unavailable:** Full-screen message with retry button
- **Stream Ended:** "Redirect prompt" to event detail page
- **Chat Connection Failed:** Show offline mode indicator
- **Quality Issues:** Auto-adjust or show warning

#### Performance Optimizations

- Video player lazy loads HLS.js
- Chat messages virtualized (only render visible)
- Related events: Client-side prefetch on hover
- Image optimization for team logos
- Debounced viewer count updates
- Request animation frame for smooth UI updates

#### Keyboard Shortcuts

- **Space:** Play/Pause
- **F:** Fullscreen
- **M:** Mute
- **C:** Focus chat input
- **Escape:** Exit fullscreen
- **Arrow keys:** Volume/seek

#### Accessibility Features

- **ARIA labels** for all controls
- **Keyboard navigation support**
- **Screen reader announcements** for live events
- **High contrast mode** support
- **Closed captions** (if available)

#### Component Reuse Summary

- `PageContainer`: 1×
- `VideoPlayer`: 1× (main player)
- `LiveChat`: 1×
- `Card`: 4-6×
- `Badge`: 3-5×
- `Button`: 6-10×
- `EventCard`: 4-6× (related streams)
- `EventStatsPanel`: 1× (stats tab)
- `Tabs`: 1× (navigation)

#### Translation Keys Required

- `Live.viewerCount`
- `Live.peakViewers`
- `Live.shareStream`
- `Live.qualitySettings`
- `Live.connecting`
- `Live.streamUnavailable`
- `Live.streamEnded`
- `Live.tabs.overview`
- `Live.tabs.statistics`
- `Live.tabs.about`
- `Live.tabs.chat`
- `Live.otherLiveEvents`
- `Live.watchingNow`
- `Chat.typeMessage`
- `Chat.connecting`
- `Chat.connectionLost`

## 6. Internationalization Strategy (next-intl)

### Implementation Approach

**Middleware Configuration:**  
`middleware.ts` handles:
- **Locale detection** from URL, cookies, or Accept-Language header
- **Automatic redirects** to localized routes
- **Locale persistence** across navigation
- **Default locale fallback**

### Supported Locales

| Language | Code | Coverage | Focus |
|----------|------|----------|-------|
| **English** | `en` | Primary | Most complete translations |
| **Spanish** | `es` | Full | Latin America |
| **Portuguese** | `pt` | Brazilian | pt-BR variant |

### Locale Routing Structure

- **Format:** `/{locale}/{page}`
- **Examples:**
  - `/en/events`
  - `/es/eventos` (translated slug)
  - `/pt/eventos`
- **Default locale** (`en`) does **NOT** redirect to `/en`, stays at root

### Translation File Structure

```
messages/
├── en.json
├── es.json
└── pt.json
```

**JSON Structure:**
```json
{
  "Navigation": {
    "home": "Home",
    "events": "Events",
    "live": "Live",
    "siteName": "StreamSport"
  },
  "Events": {
    "pageTitle": "Sports Events",
    "status": {
      "live": "Live",
      "upcoming": "Upcoming",
      "ended": "Ended"
    },
    "filters": {
      "status": "Status",
      "sports": "Sports",
      "date": "Date"
    }
  }
}
```

### Server Components Translation

- Use `getTranslations()` from next-intl/server
- **Async function,** called in Server Components
- **Namespace-based** for organization
- **Example:**
  ```typescript
  const t = await getTranslations('Events');
  ```

### Client Components Translation

- Use `useTranslations()` hook
- **Synchronous,** client-side only
- Same namespace structure
- **Example:**
  ```typescript
  const t = useTranslations('Events');
  ```

### Date/Time Formatting

- Use `Intl.DateTimeFormat` **with locale parameter**
- **Server-side:** Pass locale from params
- **Client-side:** Use next-intl locale context
- **Formats:**
  - **Full date:** "Monday, January 15, 2025"
  - **Short date:** "Jan 15"
  - **Time:** "3:30 PM"
  - **Relative:** "in 2 hours"

### Number Formatting

- **Viewer counts:** `toLocaleString(locale)`
- **Large numbers:** Abbreviated (1.2K, 3.4M)
- **Currency:** `Intl.NumberFormat` with currency code
- **Percentages:** One decimal place

### Translation Best Practices

#### 1. Namespace Organization
- **Group** by feature or page
- **Keep** related translations together
- **Avoid** deep nesting (max 2-3 levels)

#### 2. Key Naming Conventions
- **camelCase** for keys
- **Descriptive** names
- **Context** in parent namespace
- **Example:** `Events.status.live` not `Events.live`

#### 3. Plural Forms
- Use **ICU message format**
- **Example:** `"{count, plural, =0 {No events} one {1 event} other {# events}}"`
- **Handled by** next-intl automatically

#### 4. Variables in Translations
- Use **{variable} syntax**
- Pass as second parameter
- **Example:** `t('welcome', { name: 'John' })`

#### 5. Rich Text
- Use **t.rich() for HTML** content
- Define tag components
- **Maintain text security**

### Language Switcher Implementation

- Dropdown in navigation header
- Shows current locale flag/name
- Menu with all available locales
- **Updates URL** to switch locale
- **Preserves** current page path
- **Stores** preference in cookie

### SEO Considerations

- **hreflang tags** for all locale versions
- **Localized meta descriptions**
- **Canonical URLs** include locale
- **Sitemap** per locale
- **robots.txt** allows all locales

### Locale-Specific Features

#### Date Preferences
- **US** (`en`): MM/DD/YYYY, 12-hour time
- **Latin America** (`es`): DD/MM/YYYY, 24-hour time
- **Brazil** (`pt`): DD/MM/YYYY, 24-hour time

#### Cultural Adaptations
- Sport popularity varies by locale
- Featured events may differ
- Currency display (USD, MXN, BRL)
- Distance units (miles vs kilometers)

### Translation Workflow

- **Development:** English first
- **Professional translation** for es, pt
- **Context notes** for translators
- **Review** by native speakers
- **Continuous updates** for new features

### Missing Translation Handling

- **Falls back** to English (`en`)
- **Logs** missing keys in development
- **Never shows** translation keys to users
- **Automated checks** in CI/CD

### Performance Optimizations

- Translation files **bundled per page**
- **Only load** needed namespaces
- **Cached** on CDN
- **Gzip compressed**
- **Tree-shaking** unused translations

---

## 7. Data Flow & State Management

### Architecture Overview

#### Server-First Approach
- **Majority** of data fetching on server (React Server Components)
- **Reduces** client-side JavaScript
- **Improves** initial page load
- **SEO-friendly** with full HTML rendering

#### State Management Layers

1. **URL State** (Search Params)
   - Filters, pagination, sorting
   - Shareable and bookmarkable
   - SSR-friendly
   - Examples: `/events?sport=soccer&status=live`

2. **Server State** (React Server Components)
   - Event data
   - Stream metadata
   - User preferences (from cookies)
   - No client-side state management needed

3. **Client State** (Zustand - minimal usage)
   - Video player controls state
   - Chat connection status
   - UI toggles (modals, dropdowns)
   - Temporary form inputs

4. **Real-Time State** (WebSockets)
   - Live viewer counts
   - Chat messages
   - Stream status updates
   - Managed in specific components only

### Data Fetching Patterns

#### API Client Structure
```
lib/api/
├── events.ts        # Event-related API calls
├── streams.ts       # Streaming API calls
├── chat.ts          # Chat API calls
└── base.ts          # Base fetch wrapper
```

**Base Fetch Wrapper Features:**
- Automatic error handling
- **Retry logic** (3 attempts)
- **Request timeouts**
- **Response type validation**
- **Authentication token injection**
- **Locale header injection**

#### Server Component Data Fetching
- Direct **async/await** in components
- **Parallel fetching** with Promise.all()
- **Error boundaries** for failures
- **Loading UI** with Suspense
- **No useEffect** needed

**Example Pattern:**
```typescript
// Fetching in Server Component
async function EventsPage() {
  const [events, categories] = await Promise.all([
    fetchEvents(),
    fetchCategories()
  ]);
  
  return <EventsGrid events={events} categories={categories} />;
}
```

#### Client Component Data Fetching
- **Only** for real-time or user-initiated actions
- **Custom hooks** for reusability
- **SWR or TanStack Query** for caching (optional)
- **Optimistic updates** where appropriate

### Caching Strategy

#### Next.js Cache
- **fetch()** automatically cached
- **Revalidate** with tags or time-based
- **On-demand** revalidation via API routes

#### CDN Caching
- **Static assets:** 1 year
- **API responses:** 60 seconds
- **Event images:** Long cache with versioning

#### Browser Caching
- **LocalStorage:** User preferences only (**NOT for artifacts**)
- **SessionStorage:** Temporary UI state (**NOT for artifacts**)
- **Cookies:** Authentication, locale

### Real-Time Updates

**WebSocket Connections:**
- **Established** client-side only
- **Connection pooling** per page
- **Automatic reconnection** logic
- **Heartbeat** ping/pong
- **Graceful degradation** to polling

**Use Cases:**
- **Live viewer counts** (5-second updates)
- **Chat messages** (immediate)
- **Stream status changes** (immediate)
- **Event score updates** (immediate)

**Connection Management:**
- **Single WebSocket** per page
- **Multiplexed channels** for different data types
- **Cleanup** on component unmount
- **Rate limiting** on client
- **Queue** messages during disconnection

### Form Handling

**Server Actions:**
- Use Next.js **Server Actions** for form submissions
- **No client-side API calls** needed
- **Automatic revalidation**
- **Progressive enhancement** (works without JS)

**Form Validation:**
- **Zod schema** validation
- **Server-side validation** always
- **Client-side validation** for UX
- **Type-safe** form data

**Example Use Cases:**
- Chat message submission
- Set reminder forms
- Search/filter forms
- Newsletter signup

### Error Handling

**Error Boundaries:**
- **Page-level** error boundaries
- **Component-level** for critical features
- **Fallback UI** with retry actions
- **Error logging** to monitoring service

**API Error Responses:**
- **Standardized error format**
- **HTTP status codes** used correctly
- **User-friendly error messages**
- **Translated error messages**

**Retry Logic:**
- **Automatic retry** for transient failures
- **Exponential backoff**
- **Max retry attempts:** 3
- **User-initiated** manual retry option

**Network Offline Handling:**
- **Detect** offline status
- **Show** offline banner
- **Queue** actions when possible
- **Sync** when connection restored

### Performance Monitoring

**Metrics to Track:**
- **Page load time** (TTFB, FCP, LCP)
- **Video start time**
- **Chat message latency**
- **API response times**
- **WebSocket connection stability**

**Tools:**
- **Next.js Analytics**
- **Vercel Speed Insights**
- **Custom performance marks**
- **Real User Monitoring (RUM)**

## 8. Performance Optimization

### Next.js Optimizations

### Rendering Strategies

#### Static Generation (SSG)
**Used for:**
- About pages, help pages, terms
- Built at compile time
- **Fastest** possible delivery
- **Rare updates**

#### Incremental Static Regeneration (ISR)
**Used for:**
- Popular events, sports categories
- Revalidate every 60 seconds
- **Fast first load,** fresh content
- **Background regeneration**

#### Server-Side Rendering (SSR)
**Used for:**
- Homepage, events listing, live pages
- **Fresh data** every request
- **Personalized content**
- **SEO-friendly**

#### Client-Side Rendering
**Used for:**
- Video player, chat, interactive widgets
- Hydration after SSR
- **Real-time features**

### Code Splitting

- **Automatic** route-based splitting
- **Dynamic imports** for heavy components
- **Lazy load** video player library
- **Separate chunks** for each locale

### Image Optimization

- **Next.js Image** component for all images
- **Automatic** WebP/AVIF format
- **Responsive sizes** with srcset
- **Lazy loading** below fold
- **Blur placeholder** for better UX
- **Priority loading** for hero images

### Font Optimization

- **Self-hosted** fonts (Inter, JetBrains Mono)
- **Variable fonts** to reduce weight
- **Font display:** swap
- **Preload** critical fonts
- **Subset** fonts for used characters

### Video Streaming Optimization

**HLS Configuration:**
- Adaptive bitrate streaming
- **Multiple quality levels:**
  - **1080p:** 5 Mbps
  - **720p:** 2.5 Mbps
  - **480p:** 1 Mbps
  - **360p:** 500 Kbps
- **Low-latency** mode enabled
- **Segment duration:** 2-4 seconds

**Player Optimizations:**
- **Lazy load** HLS.js (40KB gzipped)
- **Preconnect** to CDN domains
- **Buffer ahead** by 30 seconds
- **Quality auto-adjustment**
- **Fast channel switching**

**CDN Strategy:**
- **Multi-CDN** setup for reliability
- **Edge caching** for stream segments
- **Geographic routing** to nearest edge
- **Failover** to backup CDN

### Bundle Size Optimization

**Target Sizes:**
- **First Load JS:** < 200KB
- **Per-page JS:** < 50KB
- **CSS:** < 30KB per page

**Techniques:**
- **Tree-shaking** unused code
- **Remove** console logs in production
- **Compress** with Brotli
- **Analyze** bundle with webpack analyzer
- **Use lighter** alternatives for heavy libraries

**Third-Party Scripts:**
- **Load** analytics async
- **Defer** non-critical scripts
- **Use Partytown** for web workers (optional)
- **Minimize** tracking scripts

### Database & API Optimization

#### Query Optimization
- **Index** frequently queried fields
- **Limit** result sets (pagination)
- **Select** only needed columns
- **Use** database-level joins
- **Cache** expensive queries

#### API Response Optimization
- **Compress** responses (gzip/brotli)
- **Minimize** payload size
- **Use GraphQL** for flexible queries (optional)
- **Implement** field filtering
- **ETags** for cache validation

#### Rate Limiting
- **API endpoints:** 100 requests/minute per IP
- **WebSocket messages:** 10/second per user
- **Graceful degradation** on limit
- **Clear error messages**

### Caching Strategy

#### Multi-Layer Caching

##### CDN Edge Cache (Cloudflare/Vercel)
- **Static assets:** 1 year
- **API responses:** 60 seconds
- **HTML pages:** 10 seconds
- **Purge** on content updates

##### Application Cache (Next.js)
- **fetch()** requests cached
- **Revalidate** with tags
- **On-demand** revalidation
- **Partial** prerendering

##### Database Query Cache (Redis)
- **Popular queries** cached
- **TTL:** 5-60 seconds depending on data
- **Invalidate** on mutations
- **Reduce** DB load

##### Browser Cache
- **Service Worker** for offline (future)
- **Cache-Control headers** set correctly
- **Versioned assets** for cache busting

### Monitoring & Profiling

**Core Web Vitals Targets:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

**Monitoring Tools:**
- **Vercel Analytics** for deployment metrics
- **Sentry** for error tracking
- **Custom performance marks**
- **Real User Monitoring**

**Performance Budget:**
- **Fail CI** if bundle exceeds limits
- **Lighthouse CI** integration
- **Regular performance audits**
- **Regression testing**

### Additional Technical Considerations

#### Security
**Authentication & Authorization:**
- JWT tokens for API authentication
- Secure HTTP-only cookies
- **CSRF protection**
- **Rate limiting** on sensitive endpoints

**Content Security:**
- **CSP headers** configured
- **XSS prevention**
- **SQL injection protection** (parameterized queries)
- **Input sanitization**

**Video Security:**
- **Signed URLs** for streams
- **Token-based access control**
- **DRM** for premium content (optional)
- **Prevent hotlinking**

#### Accessibility (a11y)
**WCAG 2.1 AA Compliance:**
- **Semantic HTML** throughout
- **ARIA labels** on interactive elements
- **Keyboard navigation** support
- **Focus management**
- **Color contrast ratios** met
- **Alt text** for all images

**Video Player Accessibility:**
- **Keyboard controls** documented
- **Closed captions** support
- **Audio descriptions** (when available)
- **Screen reader announcements**

#### Browser Support
**Target Browsers:**
- **Chrome/Edge:** Last 2 versions
- **Firefox:** Last 2 versions
- **Safari:** Last 2 versions
- **Mobile Safari:** Last 2 versions
- **Samsung Internet:** Last version

**Polyfills:**
- **HLS.js** for browsers without native HLS
- **Intersection Observer** polyfill
- **Minimal** polyfills for modern features

#### DevOps & Deployment
**CI/CD Pipeline:**
- **GitHub Actions** for automation
- **Automated testing** on PR
- **Preview deployments** per branch
- **Production** deployment on merge

**Environment Configuration:**
- Development, staging, production
- **Environment variables** for secrets
- **Feature flags** for gradual rollout

**Monitoring:**
- **Uptime monitoring**
- **Error rate alerts**
- **Performance degradation alerts**
- **Stream health monitoring**

## Reference Documents

### Design System
- `docs/design/design-system.md` - Comprehensive design system documentation including colors, typography, components, animations, and implementation guidelines

### Component Architecture
- `docs/web-architecture/reusable-components-architecture.md` - Detailed component library specifications, usage patterns, and technical implementations

### Feature Documentation
- `docs/features/` - Feature-specific requirements and implementation details
  - `01-homepage-dashboard.md` - Homepage functionality
  - `02-events-directory-filtering.md` - Events listing and filtering
  - `03-event-details-page.md` - Individual event pages
  - `04-live-video-streaming.md` - Video streaming functionality
  - `05-real-time-chat-system.md` - Chat system specifications
  - `06-internationalization-support.md` - i18n requirements
  - `07-advanced-search-navigation.md` - Search and navigation features
  - `08-responsive-multi-device-support.md` - Responsive design requirements
  - `09-stream-statistics-analytics.md` - Analytics and statistics
