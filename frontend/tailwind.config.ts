import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base Neutrals - Muted and Worn
        ash: '#A8A29E',
        concrete: '#78716C',
        stone: '#57534E',
        shadow: '#292524',

        // Earthy Accents
        moss: '#7C8A6E',
        clay: '#9C8573',
        rust: '#A8826B',

        // Faded Pastels
        fog: '#D4D4D8',
        dust: '#E7E5E4',
        'faded-blue': '#B8C5D6',
        'faded-rose': '#D4C4C0',

        // Interactive and Status
        signal: '#8FA87E',
        warning: '#B89968',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Display: 40-48px
        'display-lg': ['48px', { lineHeight: '1.2', fontWeight: '500' }],
        'display-sm': ['40px', { lineHeight: '1.2', fontWeight: '500' }],
        // Headline: 24-32px
        'headline-lg': ['32px', { lineHeight: '1.3', fontWeight: '500' }],
        'headline-sm': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        // Title: 20px
        'title': ['20px', { lineHeight: '1.4', fontWeight: '400' }],
        // Body: 16px
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        // Label: 14px
        'label': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        // Caption: 12-14px uppercase with wide tracking
        'caption-lg': ['14px', { lineHeight: '1.4', fontWeight: '400', letterSpacing: '0.08em' }],
        'caption': ['12px', { lineHeight: '1.3', fontWeight: '400', letterSpacing: '0.08em' }],
      },
      spacing: {
        // 4px increments
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
      },
      boxShadow: {
        // Worn Shadow - Soft 1-2px blur with low opacity
        worn: '0 1px 2px rgba(0, 0, 0, 0.05)',
        // Layered Shadow - Multiple shadow layers for prominent cards
        layered: '0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        // Additional depth
        'depth-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'depth-md': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'depth-lg': '0 8px 12px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'compact': '4px',
        'default': '8px',
        'soft': '12px',
        'round': '24px',
      },
      backdropBlur: {
        'subtle': '4px',
        'soft': '8px',
      },
      borderWidth: {
        'thin': '1px',
      },
      opacity: {
        'noise': '0.03',
        'worn': '0.05',
      },
      animation: {
        // Pulsing animation for live status indicators
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // Smooth fade
        'fade-in': 'fadeIn 300ms ease-in-out',
        // Number transitions
        'number-change': 'numberChange 300ms ease-in-out',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        numberChange: {
          '0%': { opacity: '0.6', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionDuration: {
        'fast': '200ms',
        'base': '300ms',
      },
      gap: {
        // Consistent gap spacing
        'sidebar': '32px',
      },
      minHeight: {
        'touch-target': '44px', // Minimum touch target size
      },
      minWidth: {
        'touch-target': '44px',
      },
      aspectRatio: {
        'video': '16 / 9',
        'thumbnail': '4 / 3',
      },
      blur: {
        'vignette': '40px', // For faded edges
      },
      outline: {
        'focus': '3px solid #8FA87E', // Signal color for focus
      },
    },
  },
  plugins: [
    // Custom plugin for noise texture
    function ({ addBase, addComponents }: any) {
      // Base styles
      addBase({
        '@keyframes noise': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        'html': {
          scrollBehavior: 'smooth',
        },
        'body': {
          backgroundColor: '#FEFBF7',
          color: '#57534E',
          fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
          fontFeatureSettings: '"kern" 1',
        },
      });

      // Noise texture utility
      addComponents({
        '.noise-texture': {
          'position': 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0',
            opacity: '0.03',
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'400\' height=\'400\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
            backgroundSize: '200% 200%',
            pointerEvents: 'none',
          },
        },

        // Worn shadow with texture
        '.shadow-worn': {
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        },

        // Layered shadow
        '.shadow-layered': {
          boxShadow:
            '0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        },

        // Stitching detail (decorative seam lines)
        '.stitch-h': {
          borderTop: '2px dashed rgba(168, 162, 158, 0.3)',
          paddingTop: '8px',
        },

        '.stitch-v': {
          borderLeft: '2px dashed rgba(168, 162, 158, 0.3)',
          paddingLeft: '8px',
        },

        // Focus ring for accessibility
        '.focus-ring': {
          '@apply outline outline-3 outline-offset-2 outline-signal': {},
        },

        // Smooth transition
        '.transition-smooth': {
          '@apply transition-all duration-300 ease-linear': {},
        },

        // Reduce motion support
        '@media (prefers-reduced-motion: reduce)': {
          '.motion-reduce': {
            animation: 'none !important',
            transition: 'none !important',
          },
        },
      });
    },
  ],
};

export default config;
