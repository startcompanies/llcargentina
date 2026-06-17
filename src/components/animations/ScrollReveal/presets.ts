export type ScrollRevealEffect =
  | 'fade-up'
  | 'fade-in'
  | 'fade-down'
  | 'scale-up'
  | 'slide-left'
  | 'slide-right';

export type ScrollRevealPreset = {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
};

export const presets: Record<ScrollRevealEffect, ScrollRevealPreset> = {
  'fade-up': {
    from: { opacity: 0, y: 28 },
    to: { opacity: 1, y: 0 },
  },
  'fade-in': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  'fade-down': {
    from: { opacity: 0, y: -28 },
    to: { opacity: 1, y: 0 },
  },
  'scale-up': {
    from: { opacity: 0, y: 28, scale: 0.96 },
    to: { opacity: 1, y: 0, scale: 1 },
  },
  'slide-left': {
    from: { opacity: 0, x: 40 },
    to: { opacity: 1, x: 0 },
  },
  'slide-right': {
    from: { opacity: 0, x: -40 },
    to: { opacity: 1, x: 0 },
  },
};
