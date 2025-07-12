import { useCallback } from 'react';

interface UseCarouselControlsProps {
  emblaApi: any; // Simplified for now
  autoPlayInterval: number;
  isPlaying: boolean;
  resetAnimation: () => void;
}

export function useCarouselControls({
  emblaApi,
  autoPlayInterval,
  isPlaying,
  resetAnimation
}: UseCarouselControlsProps) {
  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    resetAnimation();
  }, [emblaApi, resetAnimation]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    resetAnimation();
  }, [emblaApi, resetAnimation]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return {
    scrollNext,
    scrollPrev,
    scrollTo
  };
}
