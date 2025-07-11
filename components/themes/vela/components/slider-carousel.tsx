'use client';

import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import { Slider } from 'lib/api/types';
import { getFullPath } from 'lib/utils';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SliderCarouselProps {
  sliders: Slider[];
  autoPlayInterval?: number; // in milliseconds, default 5000ms
}

interface SlideContentProps {
  slider: Slider;
}

interface CarouselControlsProps {
  scrollSnaps: number[];
  selectedIndex: number;
  onDotClick: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  progress: number; // 0 to 1
}

// Slide Content Component
function SlideContent({ slider }: SlideContentProps) {
  const t = useTranslations('Common');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  if (!slider.img) {
    return null;
  }

  return (
    <div className="relative h-64 w-full md:h-96 lg:h-[500px]">
      {/* Mobile Image */}
      {slider.mob_img && (
        <Image
          src={getFullPath(slider.mob_img.path)}
          alt={slider.title}
          fill
          className="rounded-xl object-cover md:hidden"
          priority
        />
      )}

      {/* Desktop Image */}
      <Image
        src={getFullPath(slider.img.path)}
        alt={slider.title}
        fill
        className={clsx('rounded-xl object-cover', slider.mob_img ? 'hidden md:block' : '')}
        priority
      />

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Text content positioned at bottom for better UX */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
        <div className="max-w-4xl">
          <h2 className="mb-3 text-xl font-bold leading-tight text-white drop-shadow-lg md:text-3xl lg:text-4xl">
            {slider.title}
          </h2>
          {slider.description && (
            <div
              className="mb-4 max-w-2xl text-sm leading-relaxed text-gray-100 drop-shadow-md md:text-base lg:text-lg"
              dangerouslySetInnerHTML={{ __html: slider.description }}
            />
          )}
          {slider.link && (
            <a href={slider.link} className="button !inline-flex">
              {t('learnMore')}
              {isRTL ? (
                <ChevronLeft className="ms-2 h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <ChevronRight className="ms-2 h-4 w-4 md:h-5 md:w-5" />
              )}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Carousel Controls Component
function CarouselControls({
  scrollSnaps,
  selectedIndex,
  onDotClick,
  onNext,
  onPrev,
  isPlaying,
  onTogglePlay,
  progress
}: CarouselControlsProps) {
  if (scrollSnaps.length <= 1) return null;

  return (
    <div className="absolute bottom-6 right-6 flex items-center gap-3">
      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition-colors hover:bg-black/30"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>

        <div className="flex items-center gap-1 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm">
          <span className="text-sm font-medium text-white">{selectedIndex + 1}</span>
          <span className="text-sm text-white/60">/</span>
          <span className="text-sm text-white/60">{scrollSnaps.length}</span>
        </div>

        <button
          onClick={onNext}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition-colors hover:bg-black/30"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Play/Pause Button with Circular Progress */}
      <div className="relative">
        <button
          onClick={onTogglePlay}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition-colors hover:bg-black/30"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {/* Circular Progress using CSS */}
          <div className="absolute inset-0 rounded-full border-2 border-white/20" />
          <div
            className="absolute inset-0 rounded-full border-2 border-white border-t-transparent transition-all duration-100 ease-linear"
            style={{
              transform: `rotate(${progress * 360}deg)`
            }}
          />

          {/* Play/Pause Icon */}
          <div className="relative z-10">
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white" />
            ) : (
              <Play className="ml-0.5 h-5 w-5 text-white" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

// Main Slider Carousel Component
export function SliderCarousel({ sliders, autoPlayInterval = 5000 }: SliderCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setProgress(0); // Reset progress when slide changes
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
      return;
    }

    // Auto-play timer
    autoPlayRef.current = setInterval(() => {
      scrollNext();
    }, autoPlayInterval);

    // Progress timer (update every 50ms for smooth animation)
    const progressStep = 50 / autoPlayInterval;
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + progressStep;
        return newProgress >= 1 ? 0 : newProgress;
      });
    }, 50);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [isPlaying, scrollNext, autoPlayInterval]);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, []);

  if (!sliders || sliders.length === 0 || sliders.some((slider) => !slider.img)) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="embla relative overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {sliders.map((slider) => (
            <div key={slider.id} className="embla__slide min-w-0 flex-[0_0_100%]">
              <SlideContent slider={slider} />
            </div>
          ))}
        </div>

        <CarouselControls
          scrollSnaps={scrollSnaps}
          selectedIndex={selectedIndex}
          onDotClick={scrollTo}
          onNext={scrollNext}
          onPrev={scrollPrev}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          progress={progress}
        />
      </div>
    </div>
  );
}
