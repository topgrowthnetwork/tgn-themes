export const CAROUSEL_CONFIG = {
  DEFAULT_AUTO_PLAY_INTERVAL: 10000, // 10 seconds
  ANIMATION_DURATION: 10000, // 10 seconds (matches CSS animation)
  PROGRESS_UPDATE_INTERVAL: 50 // 50ms for smooth progress updates
} as const;

export const CAROUSEL_CLASSES = {
  CONTAINER: 'embla relative overflow-hidden rounded-xl',
  SLIDE_CONTAINER: 'embla__container flex',
  SLIDE: 'embla__slide min-w-0 flex-[0_0_100%]',
  CONTROLS_CONTAINER: 'absolute bottom-6 right-6 flex items-center gap-3'
} as const;
