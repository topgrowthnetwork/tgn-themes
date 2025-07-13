'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { Slider } from 'lib/api/types';
import { useCallback, useEffect, useState } from 'react';
import { NavigationControls } from './carousel/navigation-controls';
import { PlayPauseButton } from './carousel/play-pause-button';
import { SlideContent } from './carousel/slide-content';
import { useAutoPlay } from './carousel/use-auto-play';
import { useCarouselControls } from './carousel/use-carousel-controls';

interface SliderCarouselProps {
  sliders: Slider[];
  autoPlayInterval?: number;
}

export function SliderCarousel({ sliders, autoPlayInterval = 10000 }: SliderCarouselProps) {
  // State
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false); // Start with false
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
  const { resetAutoPlayTimer } = useAutoPlay({
    isPlaying,
    autoPlayInterval,
    onAdvance: scrollNext
  });

  // Navigation handlers with auto-play reset
  const handleNext = useCallback(() => {
    scrollNext();
    resetAutoPlayTimer();
  }, [scrollNext, resetAutoPlayTimer]);

  const handlePrev = useCallback(() => {
    scrollPrev();
    resetAutoPlayTimer();
  }, [scrollPrev, resetAutoPlayTimer]);

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

    // Start auto-play after carousel is initialized
    setIsPlaying(true);

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
      <div className="embla relative overflow-hidden sm:rounded-theme" ref={emblaRef}>
        <div className="embla__container flex">
          {sliders.map((slider) => (
            <div key={slider.id} className="embla__slide min-w-0 flex-[0_0_100%]">
              <SlideContent slider={slider} />
            </div>
          ))}
        </div>

        {/* Mobile: Centered controls at bottom */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0">
          <NavigationControls
            selectedIndex={selectedIndex}
            totalSlides={scrollSnaps.length}
            onPrev={handlePrev}
            onNext={handleNext}
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
