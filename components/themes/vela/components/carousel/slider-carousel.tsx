'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { Slider } from 'lib/api/types';
import { useCallback, useEffect, useState } from 'react';
import { NavigationControls } from './navigation-controls';
import { PlayPauseButton } from './play-pause-button';
import { SlideContent } from './slide-content';
import { useAutoPlay } from './use-auto-play';
import { useCarouselControls } from './use-carousel-controls';

interface SliderCarouselProps {
  sliders: Slider[];
  autoPlayInterval?: number;
}

export function SliderCarousel({ sliders, autoPlayInterval = 10000 }: SliderCarouselProps) {
  // State
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  // Animation reset function
  const resetAnimation = useCallback(() => {
    setAnimationKey((prev) => prev + 1);
  }, []);

  // Carousel controls
  const { scrollNext, scrollPrev } = useCarouselControls({
    emblaApi,
    autoPlayInterval,
    isPlaying,
    resetAnimation
  });

  // Auto-play functionality
  useAutoPlay({
    isPlaying,
    autoPlayInterval,
    onNext: scrollNext
  });

  // Play/pause toggle
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Handle slide selection
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Initialize carousel
  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Early return for invalid data
  if (!sliders || sliders.length === 0 || sliders.some((slider) => !slider.img)) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="embla relative overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="embla__container flex">
          {sliders.map((slider) => (
            <div key={slider.id} className="embla__slide min-w-0 flex-[0_0_100%]">
              <SlideContent slider={slider} />
            </div>
          ))}
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-3">
          <NavigationControls
            selectedIndex={selectedIndex}
            totalSlides={scrollSnaps.length}
            onPrev={scrollPrev}
            onNext={scrollNext}
          />

          <PlayPauseButton
            isPlaying={isPlaying}
            animationKey={animationKey}
            onTogglePlay={togglePlay}
          />
        </div>
      </div>
    </div>
  );
}
