import SocialMediaLinks from '@shared/components/social-media-links';
import { createApi } from 'lib/api';
import { Link } from 'lib/i18n/navigation';
import { getFullPath } from 'lib/utils';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import LogoSquare from '../logo-square';
import FooterGateways from './footer-gateways';
import FooterMenu from './footer-menu';
import LanguageSwitcher from './language-switcher';

export default async function Footer() {
  const locale = await getLocale();
  const api = createApi({ language: locale });
  const [settingsResult, partnersResult] = await Promise.all([
    api.getGlobalSettings(),
    api.getPartners()
  ]);
  if (settingsResult.isErr() || partnersResult.isErr()) {
    return null;
  }
  const settings = settingsResult.value.data;
  const partners = partnersResult.value.data.partners;
  const t = await getTranslations('Footer');

  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700';
  const copyrightName = settings.site_title;

  return (
    <footer className="text-sm text-white">
      <div className="mx-auto flex w-full flex-col gap-6 pb-12 text-sm md:flex-row md:gap-12">
        <div>
          <Link className="flex items-center gap-2 text-white md:pt-1" href="/">
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

      <div className="flex flex-col gap-4 pb-4 xl:flex-row xl:gap-10">
        <FooterGateways />

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white">{t('outPartners')}</h3>
          <div className="flex flex-wrap items-center gap-3">
            {partners.map((partner: any) => (
              <div
                key={partner.id}
                className="flex items-center gap-2 rounded-theme border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-800"
              >
                {partner.logo && (
                  <div className="relative h-6 w-20 flex-shrink-0">
                    <Image
                      src={getFullPath(partner.logo.path)}
                      alt={''}
                      fill
                      className="object-contain"
                      sizes="20rem"
                    />
                  </div>
                )}
                {/* <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  {partner.name}
                </span> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-500 py-6 text-sm">
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
