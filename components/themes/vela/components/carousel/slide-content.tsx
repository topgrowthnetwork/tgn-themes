import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { Slider } from 'lib/api/types';
import { getFullPath } from 'lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

interface SlideContentProps {
  slider: Slider;
}

export function SlideContent({ slider }: SlideContentProps) {
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
            <a
              href={slider.link}
              className="inline-flex items-center rounded-md border border-white bg-transparent px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-gray-900"
            >
              {t('learnMore')}
              {isRTL ? (
                <ArrowLeftIcon className="ms-2 h-4 w-4" />
              ) : (
                <ArrowRightIcon className="ms-2 h-4 w-4" />
              )}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
