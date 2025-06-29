import SocialMediaLinks from '@shared/components/social-media-links';
import { createApi } from 'lib/api';
import { Link } from 'lib/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import LogoSquare from '../logo-square';
import FooterMenu from './footer-menu';
import LanguageSwitcher from './language-switcher';

export default async function Footer() {
  const api = createApi({ language: 'en' });
  const [settingsResult, categoriesResult] = await Promise.all([
    api.getGlobalSettings(),
    api.getCategories()
  ]);
  if (settingsResult.isErr() || categoriesResult.isErr()) {
    throw new Error('Failed to get settings or categories');
  }
  const settings = settingsResult.value.data;
  const categories = categoriesResult.value.data.categories;
  const t = await getTranslations('Footer');

  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700';
  const copyrightName = settings.site_title;

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <div>
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            <LogoSquare size="sm" />
            <span className="uppercase">{settings.site_title}</span>
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-col gap-2">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={categories} />
        </Suspense>
        <div className="md:ms-auto">
          <div className="flex flex-col items-end gap-3">
            <SocialMediaLinks settings={settings} />
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 md:flex-row md:justify-between md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''}{' '}
            {t('allRightsReserved')}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
