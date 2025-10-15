'use client';

import { Link, usePathname } from 'lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const FooterMenuItem = ({
  href,
  children,
  isActive,
  onClick
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`block p-2 text-sm font-medium underline-offset-4 hover:text-black hover:underline dark:hover:text-neutral-300 md:inline-block ${
          isActive ? 'text-black dark:text-neutral-300' : 'text-neutral-500'
        }`}
      >
        {children}
      </Link>
    </li>
  );
};

export default function FooterMenu() {
  const t = useTranslations('Navigation');
  const tFooter = useTranslations('Footer');
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(pathname);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  return (
    <nav>
      <ul className="space-y-1">
        <FooterMenuItem href="/products" isActive={activePath === '/products'}>
          {t('shopAll')}
        </FooterMenuItem>
        {process.env.NEXT_PUBLIC_REPAIR_REQUEST ? (
          <FooterMenuItem href="/repair-request" isActive={activePath === '/repair-request'}>
            {t('repairRequest')}
          </FooterMenuItem>
        ) : (
          <FooterMenuItem href="/contact-us" isActive={activePath === '/contact-us'}>
            {t('contactUs')}
          </FooterMenuItem>
        )}
        {process.env.NEXT_PUBLIC_CLIENT === 'arkan' && (
          <FooterMenuItem href="/privacy-policy" isActive={activePath === '/privacy-policy'}>
            {tFooter('privacyPolicy')}
          </FooterMenuItem>
        )}
      </ul>
    </nav>
  );
}
