/**
 * Design System Utility Classes
 * Provides consistent class name combinations based on the Soft Dystopian design system
 */

export const buttonStyles = {
  base: 'inline-flex items-center justify-center rounded-default font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  primary:
    'bg-signal text-dust hover:bg-moss shadow-worn active:scale-95 active:shadow-layered',
  secondary:
    'bg-concrete text-dust hover:bg-stone shadow-worn active:scale-95',
  ghost:
    'bg-transparent text-stone border border-ash border-opacity-50 hover:bg-dust hover:border-opacity-75 active:scale-95',
  worn: 'bg-clay text-dust hover:bg-rust shadow-worn active:scale-95',
};

export const cardStyles = {
  base: 'relative bg-dust border border-ash border-opacity-30 rounded-default shadow-worn overflow-hidden',
  elevated: 'bg-fog shadow-layered',
  flat: 'shadow-none border-none',
};

export const badgeStyles = {
  base: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-compact text-caption font-mono',
  live: 'bg-warning text-shadow animate-pulse',
  upcoming: 'bg-moss text-dust',
  ended: 'bg-concrete text-dust',
  featured: 'bg-signal text-shadow',
};

export const inputStyles = {
  base: 'w-full px-4 py-3 rounded-default bg-fog border border-ash border-opacity-30 text-stone placeholder-ash placeholder-opacity-50 transition-smooth focus:outline-none focus:border-signal focus:shadow-worn disabled:bg-dust disabled:opacity-50 disabled:cursor-not-allowed',
  error: 'border-rust focus:border-rust',
};

export const gridStyles = {
  'auto-fit': 'grid auto-cols-[minmax(250px,1fr)] gap-4 md:gap-6',
  'responsive-2': 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6',
  'responsive-3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
  'responsive-4':
    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6',
};

export const textStyles = {
  'display-lg': 'text-display-lg text-stone font-medium',
  'display-sm': 'text-display-sm text-stone font-medium',
  'headline-lg': 'text-headline-lg text-stone font-medium',
  'headline-sm': 'text-headline-sm text-stone font-medium',
  title: 'text-title text-stone font-medium',
  body: 'text-body text-stone',
  'body-secondary': 'text-body text-concrete',
  label: 'text-label text-stone',
  caption: 'text-caption text-ash uppercase tracking-widest',
  'caption-lg': 'text-caption-lg text-ash uppercase tracking-widest',
  mono: 'font-mono text-caption text-stone',
};

export const layoutStyles = {
  container:
    'mx-auto px-4 md:px-8 max-w-full md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px]',
  'section-spacing': 'py-8 md:py-12 lg:py-16',
  'page-padding': 'px-4 md:px-8 py-6 md:py-8',
};

export const shadowStyles = {
  worn: 'shadow-worn',
  layered: 'shadow-layered',
  'depth-sm': 'shadow-depth-sm',
  'depth-md': 'shadow-depth-md',
  'depth-lg': 'shadow-depth-lg',
};

export const colorStyles = {
  text: {
    primary: 'text-stone',
    secondary: 'text-concrete',
    tertiary: 'text-ash',
    muted: 'text-ash text-opacity-75',
    success: 'text-signal',
    warning: 'text-warning',
    error: 'text-rust',
  },
  background: {
    primary: 'bg-dust',
    secondary: 'bg-fog',
    accent: 'bg-signal',
    warning: 'bg-warning',
    error: 'bg-rust',
  },
  border: {
    light: 'border-ash border-opacity-30',
    medium: 'border-ash border-opacity-50',
    dark: 'border-ash border-opacity-75',
  },
};

/**
 * Combine multiple style definitions
 */
export const mergeStyles = (...styles: (string | undefined)[]) => {
  return styles.filter(Boolean).join(' ');
};

/**
 * Create button class name with variant
 */
export const buttonClassName = (
  variant: keyof typeof buttonStyles = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
  className?: string
) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-caption',
    md: 'px-4 py-3 text-body',
    lg: 'px-6 py-4 text-title',
  };

  return mergeStyles(
    buttonStyles.base,
    buttonStyles[variant],
    sizeClasses[size],
    className
  );
};

/**
 * Create card class name with variant
 */
export const cardClassName = (
  variant: keyof typeof cardStyles = 'base',
  className?: string
) => {
  return mergeStyles(cardStyles.base, cardStyles[variant], className);
};

/**
 * Create badge class name with variant
 */
export const badgeClassName = (
  variant: keyof typeof badgeStyles = 'live',
  className?: string
) => {
  return mergeStyles(badgeStyles.base, badgeStyles[variant], className);
};

/**
 * Create input class name with error state
 */
export const inputClassName = (error?: boolean, className?: string) => {
  return mergeStyles(inputStyles.base, error ? inputStyles.error : '', className);
};

/**
 * Preset combinations for common UI patterns
 */
export const presets = {
  'button-primary': buttonClassName('primary'),
  'button-secondary': buttonClassName('secondary'),
  'button-ghost': buttonClassName('ghost'),
  'button-worn': buttonClassName('worn'),
  'card-default': cardClassName('base'),
  'card-elevated': cardClassName('elevated'),
  'card-flat': cardClassName('flat'),
  'badge-live': badgeClassName('live'),
  'badge-upcoming': badgeClassName('upcoming'),
  'badge-ended': badgeClassName('ended'),
  'badge-featured': badgeClassName('featured'),
  'input-default': inputClassName(),
  'grid-3-col': gridStyles['responsive-3'],
  'grid-4-col': gridStyles['responsive-4'],
};
