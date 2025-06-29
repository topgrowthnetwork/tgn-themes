'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from '@theme/components/grid/tile';
import { ProductVariant } from 'lib/api/types';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { parseAsInteger, useQueryState } from 'nuqs';

export function Gallery({
  images,
  selectedVariant
}: {
  images: { src: string; altText: string }[];
  selectedVariant?: ProductVariant | null;
}) {
  const [imageIndex, setImageIndex] = useQueryState('image', parseAsInteger.withDefault(0));
  const t = useTranslations('Product');

  // Use variant images if available, otherwise fall back to product images
  const displayImages = selectedVariant?.images_url?.length
    ? selectedVariant.images_url.map((url, index) => ({
        src: url,
        altText: `Product image ${index + 1}`
      }))
    : images;

  const nextImageIndex = imageIndex + 1 < displayImages.length ? imageIndex + 1 : 0;
  const previousImageIndex = imageIndex === 0 ? displayImages.length - 1 : imageIndex - 1;

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';

  return (
    <>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {displayImages[imageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={displayImages[imageIndex]?.altText as string}
            src={displayImages[imageIndex]?.src as string}
            priority={true}
          />
        )}

        {displayImages.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
              <button
                aria-label={t('previousProductImage')}
                onClick={() => setImageIndex(previousImageIndex)}
                className={buttonClassName}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <button
                aria-label={t('nextProductImage')}
                onClick={() => setImageIndex(nextImageIndex)}
                className={buttonClassName}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {displayImages.length > 1 ? (
        <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {displayImages.map((image, index) => {
            const isActive = index === imageIndex;

            return (
              <li key={image.src} className="h-20 w-20">
                <button
                  aria-label={t('enlargeProductImage')}
                  onClick={() => setImageIndex(index)}
                  className="h-full w-full"
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </>
  );
}
