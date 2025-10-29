# Tailwind CSS Implementation Guide

This document explains how the Soft Dystopian design system has been implemented using Tailwind CSS, and provides guidance for developers on using the design tokens and utility classes.

## Files Overview

### Configuration Files

**`frontend/tailwind.config.ts`**
- Complete Tailwind configuration with all design system colors, typography, spacing, and animations
- Custom Tailwind plugin for noise texture and component-specific utilities
- Extended theme configuration for design system tokens

**`frontend/postcss.config.mjs`**
- PostCSS configuration to process Tailwind directives
- Enables autoprefixing for cross-browser compatibility

**`frontend/app/globals.css`**
- Global base styles and typography definitions
- Font imports (Inter and JetBrains Mono)
- Utility classes for common patterns (buttons, cards, badges, forms)
- Accessibility and motion preferences support
- Dark mode and high contrast mode styles

**`frontend/app/lib/styles/design-system.ts`**
- TypeScript utility functions for creating consistent class names
- Preset combinations for common UI patterns
- Helper functions for styling components

**`frontend/app/layout.tsx`**
- Updated to import globals.css
- Proper metadata with viewport configuration

## Design Tokens

### Color Palette

All colors from the design system are available as Tailwind color utilities:

```typescript
// Base Neutrals
text-ash         // #A8A29E - Secondary text
text-concrete    // #78716C - Body text
text-stone       // #57534E - Primary text
text-shadow      // #292524 - High contrast text

// Earthy Accents
text-moss        // #7C8A6E - Status indicators
text-clay        // #9C8573 - Worn states
text-rust        // #A8826B - Special states

// Faded Pastels
text-fog         // #D4D4D8 - Light backgrounds
text-dust        // #E7E5E4 - Card backgrounds
text-faded-blue  // #B8C5D6 - Minimal accents
text-faded-rose  // #D4C4C0 - Delicate touches

// Interactive & Status
text-signal      // #8FA87E - Primary action
text-warning     // #B89968 - Alerts
```

### Typography

All typographic scales are available as Tailwind text size utilities:

```typescript
// Display
text-display-lg  // 48px, line-height 1.2, font-weight 500
text-display-sm  // 40px, line-height 1.2, font-weight 500

// Headline
text-headline-lg // 32px, line-height 1.3, font-weight 500
text-headline-sm // 24px, line-height 1.3, font-weight 500

// Title
text-title       // 20px, line-height 1.4, font-weight 400

// Body
text-body        // 16px, line-height 1.6, font-weight 400

// Label
text-label       // 14px, line-height 1.5, font-weight 400

// Caption
text-caption-lg  // 14px, uppercase, letter-spacing 0.08em
text-caption     // 12px, uppercase, letter-spacing 0.08em
```

Font families:
```typescript
font-sans   // Inter (default)
font-mono   // JetBrains Mono (for technical data)
```

### Spacing

4px increment spacing scale:
```typescript
p-0 (0px), p-1 (4px), p-2 (8px), p-3 (12px), p-4 (16px),
p-6 (24px), p-8 (32px), p-12 (48px), p-16 (64px)
```

### Shadows

```typescript
shadow-worn      // 0 1px 2px rgba(0, 0, 0, 0.05)
shadow-layered   // 0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)
shadow-depth-sm  // Subtle elevation
shadow-depth-md  // Medium elevation
shadow-depth-lg  // Prominent elevation
```

### Border Radius

```typescript
rounded-compact  // 4px
rounded-default  // 8px
rounded-soft     // 12px
rounded-round    // 24px
```

## Component Usage Examples

### Buttons

```typescript
import { buttonClassName } from '@/app/lib/styles/design-system';

// Using helper function
<button className={buttonClassName('primary')}>
  Primary Action
</button>

<button className={buttonClassName('secondary', 'lg')}>
  Secondary Action
</button>

// Using preset
<button className="btn-primary px-4 py-3">
  Submit
</button>

// Direct Tailwind classes
<button className="bg-signal text-dust hover:bg-moss shadow-worn rounded-default px-4 py-3 transition-smooth">
  Direct Classes
</button>
```

**Variants:** `primary`, `secondary`, `ghost`, `worn`
**Sizes:** `sm`, `md`, `lg`

### Cards

```typescript
import { cardClassName } from '@/app/lib/styles/design-system';

// Using helper
<div className={cardClassName('elevated')}>
  Content here
</div>

// Using preset
<div className="card elevated">
  Featured content
</div>

// Direct classes
<div className="bg-dust border border-ash border-opacity-30 rounded-default shadow-worn">
  Standard card
</div>
```

**Variants:** `base` (default), `elevated`, `flat`

### Badges

```typescript
import { badgeClassName } from '@/app/lib/styles/design-system';

// Live event indicator
<span className={badgeClassName('live')}>
  LIVE
</span>

// Status badges
<span className="badge-upcoming">UPCOMING</span>
<span className="badge-ended">ENDED</span>
<span className="badge-featured">FEATURED</span>
```

### Form Inputs

```typescript
import { inputClassName } from '@/app/lib/styles/design-system';

<input
  type="text"
  className={inputClassName()}
  placeholder="Enter text"
/>

// With error state
<input
  type="email"
  className={inputClassName(true)}
  aria-invalid={true}
  placeholder="Invalid input"
/>
```

### Grid Layouts

```typescript
import { gridStyles } from '@/app/lib/styles/design-system';

// 3-column responsive grid
<div className={gridStyles['responsive-3']}>
  {items.map(item => <div key={item.id}>{item.name}</div>)}
</div>

// Or using preset
<div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* items */}
</div>
```

## Accessibility Features

### Focus States

All interactive elements have built-in focus states:

```typescript
// Automatically applied
focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2

// Or use utility class
.focus-ring  // 3px signal outline with offset
```

### Motion Preferences

Respect user motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  /* No animations */
}
```

Use the `motion-reduce` class to disable animations for specific elements:

```typescript
<div className="animate-pulse motion-reduce">
  This won't animate for users with reduced motion enabled
</div>
```

### Color Contrast

All text combinations meet WCAG 2.1 AA standards (4.5:1 ratio):

- Dark text on light backgrounds: stone/concrete on dust/fog
- Light text on dark backgrounds: dust on signal/concrete/clay
- Interactive elements: signal (#8FA87E) with 3:1 contrast

### Keyboard Navigation

All form elements and buttons support full keyboard navigation:

```typescript
<input autoFocus required aria-label="Email" />
<button type="submit">Submit</button>
```

## Common Patterns

### Text Combinations

Primary text with secondary color:
```typescript
<p className="text-stone">
  Primary content with{' '}
  <span className="text-concrete">secondary emphasis</span>
</p>
```

Monospace metadata:
```typescript
<span className="font-mono text-caption text-ash">
  2024-10-29T14:23:45Z
</span>
```

### Interactive States

Button with all states:
```typescript
<button className={buttonClassName('primary')}>
  Click me
  {/* Automatically handles:
      - hover: darker shade
      - active: scale-95 with layered shadow
      - focus: ring-signal
      - disabled: opacity-50
  */}
</button>
```

### Card Sections

Structured card with all elements:
```typescript
<div className={cardClassName('elevated')}>
  {/* Thumbnail section - 16:9 aspect ratio */}
  <div className="aspect-video overflow-hidden">
    <img src="..." alt="..." className="w-full h-full object-cover" />
  </div>

  {/* Content area */}
  <div className="p-4 md:p-6">
    <h3 className="text-title text-stone mb-2">Card Title</h3>
    <p className="text-body text-concrete mb-4">Description</p>

    {/* Action section */}
    <div className="flex gap-2">
      <button className={buttonClassName('primary', 'sm')}>Action</button>
      <button className={buttonClassName('ghost', 'sm')}>Cancel</button>
    </div>
  </div>
</div>
```

## Customization

### Adding New Colors

Edit `frontend/tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      'custom-color': '#ABC123',
    },
  },
},
```

### Adding New Typography Scales

```typescript
fontSize: {
  'custom': ['18px', { lineHeight: '1.5', fontWeight: '600' }],
},
```

### Creating Component Classes

In `frontend/app/globals.css`:

```css
@layer components {
  .custom-component {
    @apply bg-signal text-dust px-4 py-3 rounded-default;
  }
}
```

## Dark Mode Support

The system includes basic dark mode support. To enable:

```typescript
// tailwind.config.ts
darkMode: 'media', // or 'class'
```

Then add dark mode styles in globals.css (already included):

```css
@media (prefers-color-scheme: dark) {
  body {
    @apply bg-[#1a1817] text-fog;
  }
  /* ... more dark styles ... */
}
```

## Performance Optimization

### Purging Unused CSS

Tailwind automatically purges unused styles based on the content globs in `tailwind.config.ts`. Ensure you include all template paths:

```typescript
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
],
```

### Using CSS Layers

Take advantage of CSS layers for specificity management:

```css
@layer components {
  .component-class {
    /* Higher specificity than utilities */
  }
}
```

## Migration Guide

### From Inline Styles

Before:
```typescript
<div style={{ padding: '16px', backgroundColor: '#E7E5E4' }}>
```

After:
```typescript
<div className="p-4 bg-dust">
```

### From Custom CSS

Before:
```css
.my-button {
  background-color: #8fa87e;
  color: #e7e5e4;
  padding: 12px 16px;
  border-radius: 8px;
}
```

After:
```typescript
<button className="bg-signal text-dust px-4 py-3 rounded-default">
```

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Soft Dystopian Design System](./design-system.md)
- [Stream Statistics Implementation](./stream-statistics-implementation.md)
