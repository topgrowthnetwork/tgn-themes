'use client';

import clsx from 'clsx';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { Slider } from 'lib/api/types';
import { getFullPath } from 'lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SliderCarouselProps {
  sliders: Slider[];
}

interface SlideContentProps {
  slider: Slider;
}

interface CarouselDotsProps {
  scrollSnaps: number[];
  selectedIndex: number;
  onDotClick: (index: number) => void;
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
          className="object-cover md:hidden"
          priority
        />
      )}

      {/* Desktop Image */}
      <Image
        src={getFullPath(slider.img.path)}
        alt={slider.title}
        fill
        className={`object-cover ${slider.mob_img ? 'hidden md:block' : ''}`}
        priority
      />

      {/* Gradient overlay for better text readability */}
      {/* {!process.env.NEXT_PUBLIC_NO_SLIDER_SHADOW ? (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      ) : null} */}

      {/* text content positioned at bottom for better UX */}
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
            <a
              href={slider.link}
              className="inline-flex items-center rounded-theme bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:shadow-lg dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 md:text-base"
            >
              {slider.btn_text || t('learnMore')}
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

// Carousel Dots Component
function CarouselDots({ scrollSnaps, selectedIndex, onDotClick }: CarouselDotsProps) {
  if (scrollSnaps.length <= 1) return null;

  return (
    <div className="mt-4 flex justify-center gap-x-2">
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          className={clsx(
            'h-3 w-3 rounded-full transition-colors',
            index === selectedIndex ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
          )}
          onClick={() => onDotClick(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

// Main Slider Carousel Component
export function SliderCarousel({ sliders }: SliderCarouselProps) {
  // Configure autoplay if environment variable is set
  const autoplayInterval = process.env.NEXT_PUBLIC_CAROUSEL_AUTOPLAY_INTERVAL_SECONDS
    ? parseInt(process.env.NEXT_PUBLIC_CAROUSEL_AUTOPLAY_INTERVAL_SECONDS) * 1000
    : null;

  const autoplay = useRef(
    autoplayInterval ? Autoplay({ delay: autoplayInterval, stopOnInteraction: false }) : null
  );

  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: isRTL ? 'rtl' : 'ltr' },
    autoplayInterval ? [autoplay.current!] : []
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

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

  if (!sliders || sliders.length === 0 || sliders.some((slider) => !slider.img)) {
    return null;
  }

  return (
    <div className="w-full" dir="rtl">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {sliders.map((slider) => (
            <div key={slider.id} className="embla__slide min-w-0 flex-[0_0_100%]">
              <SlideContent slider={slider} />
            </div>
          ))}
        </div>
      </div>

      <CarouselDots scrollSnaps={scrollSnaps} selectedIndex={selectedIndex} onDotClick={scrollTo} />
    </div>
  );
}
