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
              ? 'bg-white text-[#0f2f3d]'
              : 'text-neutral-300 hover:bg-neutral-600 hover:text-white'
          }`}
          aria-label={`Switch to ${language.name}`}
        >
          <span>{language.name}</span>
        </Link>
      ))}
    </div>
  );
}
