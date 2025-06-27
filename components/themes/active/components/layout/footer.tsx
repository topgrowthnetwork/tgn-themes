import Link from 'next/link';

import { createApi } from 'lib/api';
import { getLocale, getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import GitHubIcon from '../icons/github';
import LogoSquare from '../logo-square';
import FooterMenu from './footer-menu';
import LanguageSwitcher from './language-switcher';

export default async function Footer() {
  const t = await getTranslations('Footer');
  const locale = await getLocale();
  const api = createApi({ language: locale });
  const settingsResult = await api.getGlobalSettings();
  if (settingsResult.isErr()) {
    throw new Error('Failed to get global settings');
  }
  const settings = settingsResult.value.data;

  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700';
  const categoriesResult = await api.getCategories();
  if (categoriesResult.isErr()) {
    throw new Error('Failed to get categories');
  }
  const categories = categoriesResult.value.data.categories;
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
          <a
            aria-label={t('githubRepository')}
            href="https://github.com/bigcommerce/nextjs-commerce"
          >
            <GitHubIcon className="h-6" />
          </a>
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
