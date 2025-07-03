'use client';

import { Link, usePathname } from 'lib/i18n/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'ar', name: 'AR' }
  ];

  return (
    <div className="flex items-center gap-2">
      {languages.map((language) => (
        <Link
          key={language.code}
          href={pathname}
          locale={language.code}
          className={`flex items-center gap-1 rounded-theme px-2 py-1 text-xs font-medium transition-colors ${
            locale === language.code
              ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-white'
              : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-300'
          }`}
          aria-label={`Switch to ${language.name}`}
        >
          <span>{language.name}</span>
        </Link>
      ))}
    </div>
  );
}
