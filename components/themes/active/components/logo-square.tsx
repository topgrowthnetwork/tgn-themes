'use client';

import clsx from 'clsx';
import { useGlobalSettings } from 'lib/hooks/api';
import { getFullPath } from 'lib/utils';
import Image from 'next/image';

// TODO: Add size prop
export default function LogoSquare({ size = 'sm' }: { size?: string }) {
  const { data: settings, isLoading } = useGlobalSettings();

  const [logoPath, logoTitle] = (function getLogoData() {
    if (settings?.site_logo) {
      return [getFullPath(settings.site_logo.path), settings.site_title];
    }

    return ['https://placehold.co/600x400.png', 'Logo'];
  })();

  if (isLoading) {
    return (
      <div className="h-16 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    );
  }

  return (
    <div>
      <Image
        src={logoPath}
        alt={logoTitle}
        width={0}
        height={0}
        className={clsx('h-16 w-auto object-contain')}
        sizes="7rem"
        priority
      />
    </div>
  );
}
