import { useCallback } from 'react';

interface UseCarouselControlsProps {
  emblaApi: any; // Simplified for now
  autoPlayInterval: number;
  isPlaying: boolean;
  resetAnimation: () => void;
  resetAutoPlayTimer?: () => void;
}

export function useCarouselControls({
  emblaApi,
  autoPlayInterval,
  isPlaying,
  resetAnimation,
  resetAutoPlayTimer
}: UseCarouselControlsProps) {
  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    resetAnimation();
    resetAutoPlayTimer?.();
  }, [emblaApi, resetAnimation, resetAutoPlayTimer]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    resetAnimation();
    resetAutoPlayTimer?.();
  }, [emblaApi, resetAnimation, resetAutoPlayTimer]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      resetAutoPlayTimer?.();
    },
    [emblaApi, resetAutoPlayTimer]
  );

  return {
    scrollNext,
    scrollPrev,
    scrollTo
  };
}
