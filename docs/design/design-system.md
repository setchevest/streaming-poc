# Soft Dystopian Design System

## Overview

The Soft Dystopian design system establishes a visual language that evokes a future that's functional yet faded, blending rugged practicality with subtle elegance. This aesthetic creates an atmosphere that suggests aged materials and weathered experiences while maintaining modern usability and accessibility standards.

The system is built around muted earth tones, weathered textures, and a carefully calibrated color palette that feels both organic and mechanical. Visual elements feature noise overlays, subtle gradients, and layered shadows to achieve the worn, authentic feel of something that's been used and cherished over time.

## Color Palette

### Base Neutrals - Muted and Worn
- **Ash** (#A8A29E) - Primary muted gray for secondary text and subtle borders
- **Concrete** (#78716C) - Medium gray-brown for body text in long-form content
- **Stone** (#57534E) - Dark gray for headings and primary text elements
- **Shadow** (#292524) - Near-black brown for high contrast text and icons

### Earthy Accents
- **Moss** (#7C8A6E) - Olive green for friendly status indicators and secondary accents
- **Clay** (#9C8573) - Muted tan-brown for aged or worn interactive elements
- **Rust** (#A8826B) - Weathered rust for special states and vintage styling

### Faded Pastels
- **Fog** (#D4D4D8) - Very light gray for backgrounds and subtle layering
- **Dust** (#E7E5E4) - Off-white with warm undertones for card backgrounds and surfaces
- **Faded Blue** (#B8C5D6) - Washed out blue for minimal accents and highlights
- **Faded Rose** (#D4C4C0) - Barely pink tones for delicate touches and warmth

### Interactive and Status Colors
- **Signal** (#8FA87E) - Muted sage green for primary actions and success states
- **Warning** (#B89968) - Muted amber for alerts, live indicators, and attention-grabbing elements

## Typography System

### Font Families
- **Inter** - Primary sans-serif for all body text and UI elements. Clean, readable, technically precise.
- **JetBrains Mono** - Monospace font for technical labels, timestamps, metadata, and code-like elements.

### Type Scale
1. **Display** (40-48px, medium weight) - Page titles, hero headlines, major section headers
2. **Headline** (24-32px, medium weight) - Section headers, feature titles, important announcements
3. **Title** (20px, normal weight) - Card titles, sub-headers, event names
4. **Body** (16px, normal weight) - Primary content text, paragraphs, descriptions
5. **Caption** (12-14px, uppercase, wide tracking) - Metadata, labels, status text, credits
6. **Label** (14px, normal weight) - Form field labels, UI controls, navigation items

### Typography Guidelines
- Body text uses relaxed line-height (1.6-1.7) for improved readability
- Caption text maintains wide character spacing for visual prominence
- Monospace usage is reserved for technical data, timestamps, and stream metadata
- All text maintains a neutral tone, avoiding excessive bold weights

## Visual Elements

### Textures and Overlays
- **Noise Texture** - Subtle 3% opacity overlay applied to surfaces for authentic wear
- **Canvas Texture** - Handmade paper effect for specialized content areas
- **Grain Effect** - Fine granular pattern on image-heavy sections

### Shadows and Depth
- **Worn Shadow** - Soft 1-2px blur with low opacity for subtle elevation
- **Layered Shadow** - Multiple shadow layers (2px + 1px) for prominent cards and modals
- **Faded Edges** - Graduated opacity vignetting on images and containers

### Effects and Animations
- **Backdrop Blur** - Subtle background softening behind elevated elements
- **Stitching Details** - Decorative seam lines on hover states for crafted appearance
- **Smooth Transitions** - 200-300ms linear transitions for state changes
- **Pulsing Animations** - Gentle heartbeat effects for live status indicators

## Component Library

### Buttons

#### Variants
- **Primary** - Signal background, worn shadow, main call-to-actions
- **Secondary** - Concrete background, lighter text, secondary actions
- **Ghost** - Transparent with ash border, hover effects for tertiary actions
- **Worn** - Clay background, dust text, aged appearance for special contexts

#### States
- **Default** - Clean appearance with subtle wear textures
- **Hover** - Darker shade, lifted worn shadow effect
- **Active** - 95% scale transform, enhanced shadow depth
- **Disabled** - 50% opacity, desaturated colors
- **Loading** - Signal-colored spinner, disabled interaction

#### Usage Guidelines
- Primary buttons max 2 per page section for hierarchy
- Ghost buttons for cancel actions and secondary navigation
- Worn variant reserved for special features and archived content
- All buttons include 8px padding minimum, scaling with size variants

### Cards

#### Variants
- **Default** - Dust background, ash border, worn shadow (standard content)
- **Elevated** - Fog background, layered shadow (featured/highlighted content)
- **Flat** - Dust background, no border/shadow (minimal container)
- **Canvas** - Canvas texture overlay, dust base (artistic/special sections)

#### Content Structure
- **Thumbnail Section** (16:9 ratio) - Image/video previews with overlay gradients
- **Content Area** - Title, metadata, description with 16px padding
- **Action Section** - Buttons and status indicators at card bottom

#### Visual Features
- 3% opacity noise overlay on all variants
- Rounded corners from 4px (compact) to 12px (hero)
- Consistent 16-24px internal padding scaling
- Gradient overlays on images from shadow to transparent

### Badges

#### Variants
- **Live** - Warning background, pulsing dot, uppercase text (active streaming)
- **Upcoming** - Moss background, dust text (scheduled events)
- **Ended** - Concrete background, dust text (completed events)
- **Featured** - Signal background, shadow text (highlighted content)

#### Implementation
- Monospace font at small size (12px) with wide tracking
- Consistent 12px horizontal padding, 4px vertical padding
- 6px border radius for soft, worn appearance
- Live variant includes animation: 1.5px pulsing circle at 2-second intervals

### Forms and Inputs

#### Input Component
- Fog background (#D4D4D8) with ash border (30% opacity)
- Stone text color, ash placeholder text
- Signal colored focus state border
- Rust colored error state border
- Monospace font for technical data entry

#### Select Component
- Matching input styling for consistency
- Chevron-down arrow (20x20px) with transition
- Canvas background dropdown menu with subtle shadow
- Hover states for option rows (ash-colored underlines)

### Layout Components

#### Page Container
- Responsive max-width constraints (768px, 1024px, 1280px, full)
- Symmetric horizontal padding (16px mobile, 32px desktop)
- Consistent 32px vertical spacing between sections

#### Sidebar Layout
- Desktop: 4-column grid with 1/3 sidebar, 3/3 content
- Tablet: Stacked vertical layout
- Mobile: Single column stack
- 32px gap between sidebar and content areas

## Page Layouts

### Homepage Structure
The homepage combines three distinct content zones with progressive loading:

1. **Hero Stream Section** (conditional, full-width)
   - Video Player component with custom overlay controls
   - Stream metadata overlay with gradient background
   - Call-to-action button with live indicator

2. **Featured Events Zone** (3-4 column grid)
   - Curated priority events in EventCard components
   - Featured variant with enhanced visual prominence
   - "View All" navigation link for progression

3. **Upcoming Events Zone** (4 column grid)
   - Chronological event display using standard EventCard
   - Pagination or "Load More" functionality
   - Filter chips for category navigation

### Events Directory Layout
Advanced filtering interface with responsive grid system:

- **Filter Sidebar** (sticky, 250px width)
  - Status filters (All, Live, Upcoming, Ended)
  - Sports category filters with event counts
  - Date range filters for time-based discovery

- **Main Content Grid** (responsive flex)
  - 3-column grid system adapting to screen size
  - EventCard components with hover animations
  - Empty states and loading indicators

### Event Detail Layout
Comprehensive single-event presentation:

- **Hero Section** (16:9 aspect ratio)
  - Primary event image with status badge overlay
  - Gradient background from transparent to shadow

- **Metadata Row** (flex layout with icons)
  - Event details with monospace typography for timestamps
  - Venue and team information with visual hierarchy

- **Content Areas** (structured card sections)
  - Event description with relaxed line-height typography
  - Team section for competitive sport events
  - Statistics panels with monospace number displays

- **Sidebar Content** (sticky positioning)
  - Related event recommendations
  - Real-time stream statistics when applicable

## Responsive Design

### Breakpoints
- **Mobile**: < 768px - Single column stacks, touch-optimized interfaces
- **Tablet**: 768px - 1024px - 2-3 column grids, hybrid layouts
- **Desktop**: > 1024px - Full grid systems, multi-column layouts

### Responsive Patterns
- **Progressive Enhancement**: Mobile-first approach with desktop enhancement
- **Content Priority**: Critical content remains visible across all screen sizes
- **Touch Targets**: 44px minimum touch areas with appropriate spacing
- **Typography Scaling**: Consistent ratios maintained across breakpoints

## Animation and Motion

### Transition Patterns
- **Hover States**: 200ms linear transitions for color and transform changes
- **Page Transitions**: Fade and slide effects for navigation changes
- **Loading States**: Skeleton animations with 1.5-2s pulse cycles
- **Micro-interactions**: Icon rotations, button press feedback

### Performance Considerations
- **Reduced Motion**: Respects user accessibility preferences
- **GPU Acceleration**: Transform and opacity transitions for smooth performance
- **Lazy Loading**: Progressive content loading with placeholder animations
- **Debounced Updates**: Real-time data updates with minimized visual disruption

## Accessibility Standards

### Color Contrast
- Text combinations meet WCAG 2.1 AA standards (4.5:1 minimum ratio)
- Interactive elements maintain 3:1 contrast ratio for visibility
- Error states use rust (#A8826B) with sufficient contrast against backgrounds
- Focus indicators use signal color (#8FA87E) with 3px outline width

### Semantic Structure
- Proper heading hierarchy (h1-h6) throughout application
- ARIA labels for dynamic content and interactive elements
- Screen reader announcements for live content updates
- Keyboard navigation support with tab order optimization

### Interactive Design
- Touch targets exceed 44px on mobile interfaces
- Focus management for modal dialogs and form interactions
- Error messaging clearly associated with form fields
- Loading states prevent interaction with disabled components

## Implementation Guidelines

### CSS Architecture
- Utility-first approach using Tailwind CSS framework
- Component-specific styles encapsulated within component files
- Consistent spacing scale (4px increments: 4, 8, 12, 16, 24, 32, 48, 64px)
- Color variables mapped to design tokens for maintainability

### Component API Design
- Flexible prop interfaces with sensible defaults
- Variant-based styling for consistent application
- Size scales (sm, md, lg) for adaptability
- ClassName override support for edge cases

### Performance Optimization
- Critical CSS inlined for initial page loads
- Font loading strategy with swap display
- Image optimization with WebP/AVIF formats and lazy loading
- Bundle splitting for route-based code loading

This design system provides a comprehensive foundation for creating compelling, accessible, and brand-consistent user experiences across the sports streaming platform while maintaining the distinct soft dystopian aesthetic.
