'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '../../lib/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'ar', name: 'AR' }
  ];

  const handleLanguageChange = (newLocale: string) => {
    // Navigate to the same path with the new locale
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            locale === language.code
              ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-white'
              : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-300'
          }`}
          aria-label={`Switch to ${language.name}`}
        >
          <span>{language.name}</span>
        </button>
      ))}
    </div>
  );
}
