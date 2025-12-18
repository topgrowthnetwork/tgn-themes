'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ProductVariant } from 'lib/api/types';
import { getFullPath } from 'lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

interface QuickViewGalleryProps {
  images: { src: string; altText: string }[];
  selectedVariant?: ProductVariant | null;
}

export function QuickViewGallery({ images, selectedVariant }: QuickViewGalleryProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const t = useTranslations('Product');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Use variant images if available, otherwise fall back to product images
  const displayImages = selectedVariant?.images_url?.length
    ? selectedVariant.images_url.map((url, index) => ({
        src: url,
        altText: `Product image ${index + 1}`
      }))
    : images;

  const nextImageIndex = imageIndex + 1 < displayImages.length ? imageIndex + 1 : 0;
  const previousImageIndex = imageIndex === 0 ? displayImages.length - 1 : imageIndex - 1;

  const goToNext = () => setImageIndex(nextImageIndex);
  const goToPrevious = () => setImageIndex(previousImageIndex);

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white dark:bg-white">
        {displayImages[imageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            alt={displayImages[imageIndex]?.altText || 'Product image'}
            src={getFullPath(displayImages[imageIndex]?.src) || ''}
            priority
          />
        )}

        {/* Navigation arrows - only show if more than 1 image */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className={clsx(
                'absolute top-1/2 -translate-y-1/2 p-2',
                'bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm',
                'rounded-full shadow-md',
                'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white',
                'transition-all duration-200 hover:scale-110',
                'border border-neutral-200 dark:border-neutral-700',
                isRTL ? 'right-2' : 'left-2'
              )}
              aria-label={t('previousProductImage')}
            >
              {isRTL ? <ArrowRightIcon className="h-4 w-4" /> : <ArrowLeftIcon className="h-4 w-4" />}
            </button>
            <button
              onClick={goToNext}
              className={clsx(
                'absolute top-1/2 -translate-y-1/2 p-2',
                'bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm',
                'rounded-full shadow-md',
                'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white',
                'transition-all duration-200 hover:scale-110',
                'border border-neutral-200 dark:border-neutral-700',
                isRTL ? 'left-2' : 'right-2'
              )}
              aria-label={t('nextProductImage')}
            >
              {isRTL ? <ArrowLeftIcon className="h-4 w-4" /> : <ArrowRightIcon className="h-4 w-4" />}
            </button>
          </>
        )}
      </div>

      {/* Bullet indicators - only show if more than 1 image */}
      {displayImages.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setImageIndex(index)}
              className={clsx(
                'w-2.5 h-2.5 rounded-full transition-all duration-200',
                index === imageIndex
                  ? 'bg-primary-600 scale-110'
                  : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500'
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

