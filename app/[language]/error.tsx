'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations('Error');

  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-theme border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12">
      <h2 className="text-xl font-bold">{t('title')}</h2>
      <p className="my-2">{t('description')}</p>
      <div className="mx-auto mt-4 flex w-full flex-col gap-2">
        <button className="button w-full" onClick={() => reset()}>
          {t('tryAgain')}
        </button>
        <Link href={'/'} className="button button-secondary w-full text-center">
          {t('goToHomepage')}
        </Link>
      </div>
    </div>
  );
}
