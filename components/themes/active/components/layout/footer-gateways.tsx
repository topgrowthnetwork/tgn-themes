'use client';

import { getPaymentGateways, parseGatewayKeysFromEnv } from 'lib/payment-gateways';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function FooterGateways() {
  const t = useTranslations('Footer');

  // Get gateway keys from environment variable
  const gatewayKeys = parseGatewayKeysFromEnv(process.env.NEXT_PUBLIC_FOOTER_GATEWAYS);

  // If no gateways specified, don't render anything
  if (gatewayKeys.length === 0) {
    return null;
  }

  // Get gateway configurations
  const gateways = getPaymentGateways(gatewayKeys);

  // If no valid gateways found, don't render
  if (gateways.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-white">{t('supportedPaymentMethods')}</h3>
      <div className="flex flex-wrap items-center gap-3">
        {gateways.map((gateway) => (
          <div
            key={gateway.key}
            className="flex items-center gap-2 rounded-theme border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
          >
            {gateway.imagePath && (
              <div className="relative h-6 w-6 flex-shrink-0">
                <Image
                  src={gateway.imagePath}
                  alt={gateway.name}
                  fill
                  className="object-contain"
                  sizes="24px"
                />
              </div>
            )}
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              {gateway.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
