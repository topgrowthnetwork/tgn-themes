'use client';

import Container from '@theme/components/container';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface EmptyCartMessageProps {
  language: string;
}

export default function EmptyCartMessage({ language }: EmptyCartMessageProps) {
  const t = useTranslations('Cart');

  return (
    <Container>
      <div className="mx-auto max-w-2xl py-16 text-center">
        {/* Empty Cart Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <ShoppingBag className="h-12 w-12 text-gray-400" />
        </div>

        {/* Message */}
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          {t('emptyCartTitle')}
        </h1>

        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">{t('emptyCartDescription')}</p>

        {/* Call to Action */}
        <Link
          href={`/${language}/products`}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <span>{t('startShopping')}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Additional Info */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>{t('emptyCartHelp')}</p>
        </div>
      </div>
    </Container>
  );
}
