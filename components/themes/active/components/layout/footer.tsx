import SocialMediaLinks from '@shared/components/social-media-links';
import { createApi } from 'lib/api';
import { Link } from 'lib/i18n/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import LogoSquare from '../logo-square';
import FooterGateways from './footer-gateways';
import FooterMenu from './footer-menu';
import LanguageSwitcher from './language-switcher';

export default async function Footer() {
  const locale = await getLocale();
  const api = createApi({ language: locale });
  const settingsResult = await api.getGlobalSettings();
  if (settingsResult.isErr()) {
    throw new Error('Failed to get settings');
  }
  const settings = settingsResult.value.data;
  const t = await getTranslations('Footer');

  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700';
  const copyrightName = settings.site_title;

  return (
    <footer className="text-sm text-neutral-500">
      <div className="mx-auto flex w-full flex-col gap-6 border-t border-neutral-200 py-12 text-sm md:flex-row md:gap-12">
        <div>
          <Link className="flex items-center gap-2 text-black md:pt-1" href="/">
            <LogoSquare size="sm" />
            <span className="uppercase">{settings.site_title}</span>
          </Link>
        </div>

        <FooterMenu />

        <div className="md:ms-auto">
          <div className="flex flex-col gap-3">
            <SocialMediaLinks settings={settings} />
          </div>
        </div>
      </div>
      <div className="mx-auto pb-4 ">
        <FooterGateways />
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full flex-col items-center gap-4 md:flex-row md:justify-between md:gap-0 ">
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
