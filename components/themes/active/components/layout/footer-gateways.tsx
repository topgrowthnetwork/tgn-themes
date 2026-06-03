'use client';

import { FOOTER_PAYMENT_LOGOS } from 'lib/footer-payment-logos';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function FooterGateways() {
  const t = useTranslations('Footer');

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-white">{t('supportedPaymentMethods')}</h3>
      <ul
        className="flex flex-wrap items-center gap-2"
        role="list"
        aria-label={t('supportedPaymentMethods')}
      >
        {FOOTER_PAYMENT_LOGOS.map((logo) => (
          <li key={logo.key}>
            <div
              className="flex h-10 items-center justify-center rounded-theme border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
              title={logo.name}
            >
              <Image
                src={logo.imagePath}
                alt={logo.name}
                width={72}
                height={28}
                className="h-7 w-auto max-w-[4.5rem] object-contain object-center"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
