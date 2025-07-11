import { createApi } from 'lib/api';
import { Link } from 'lib/i18n/navigation';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { useTranslations } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Suspense } from 'react';
import Cart from '../../cart';
import OpenCart from '../../cart/open-cart';
import LogoSquare from '../../logo-square';
import MobileMenu from './mobile-menu';
import Search from './search';

// Function to format phone number nicely
function formatPhoneNumberNicely(phoneNumber: string, countryCode: CountryCode = 'EG') {
  try {
    const parsed = parsePhoneNumber(phoneNumber, { defaultCountry: countryCode });
    if (parsed) {
      return parsed.formatInternational();
    }
  } catch (error) {
    // If parsing fails, return the original number
    console.warn('Failed to parse phone number:', phoneNumber, error);
  }
  return phoneNumber;
}

// Function to get clean phone number for tel: links
function getCleanPhoneNumber(phoneNumber: string, countryCode: CountryCode = 'EG') {
  try {
    const parsed = parsePhoneNumber(phoneNumber, { defaultCountry: countryCode });
    if (parsed) {
      return parsed.format('E.164'); // Returns +201010101010 format
    }
  } catch (error) {
    console.warn('Failed to parse phone number:', phoneNumber, error);
  }
  return phoneNumber;
}

function WhatsappButton({ phoneNumber }: { phoneNumber: string }) {
  const t = useTranslations('Navigation');

  return (
    <a
      href={`https://wa.me/${getCleanPhoneNumber(phoneNumber).replace(
        '+',
        ''
      )}?text=Hello! I need help.`}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden items-center gap-3 rounded-lg bg-gray-50 px-3 py-2 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 lg:flex"
    >
      <Image src="/image/icons/whatsapp.svg" alt="WhatsApp" width={24} height={24} />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-black dark:text-white">{t('howCanWeHelp')}</span>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-400">
          {formatPhoneNumberNicely(phoneNumber)}
        </span>
      </div>
    </a>
  );
}

export default async function Navbar() {
  const locale = await getLocale();
  const t = await getTranslations('Navigation');
  const api = createApi({ language: locale });
  const settingsResult = await api.getGlobalSettings();
  if (settingsResult.isErr()) {
    return null;
  }
  const settings = settingsResult.value.data;

  const categoriesResult = await api.getCategories();
  if (categoriesResult.isErr()) {
    return null;
  }
  const categories = categoriesResult.value.data.categories;

  // Fetch recommended products for the menu
  const productsResult = await api.getProducts({
    recomended: '1',
    per_page: '3',
    order_by: 'selling_count'
  });
  const products = productsResult.isOk() ? productsResult.value.data.products.data : [];

  return (
    <nav className="relative flex h-full items-center justify-between">
      <div className="flex items-center gap-2 md:hidden">
        <Suspense
          fallback={
            <div className="h-11 w-11 rounded-theme border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800" />
          }
        >
          <MobileMenu menu={categories} products={products} settings={settings} />
        </Suspense>
      </div>

      <div className="flex items-center justify-center md:hidden">
        <Link href="/" className="flex items-center">
          <LogoSquare />
        </Link>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <Suspense
          fallback={
            <div className="h-11 w-11 rounded-theme border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800" />
          }
        >
          <MobileMenu menu={categories} products={products} settings={settings} />
        </Suspense>
        <Link href="/" className="flex items-center">
          <LogoSquare />
        </Link>
      </div>

      <div className="hidden justify-center md:flex md:w-1/3">
        <Suspense
          fallback={
            <div className="h-10 w-80 rounded-theme border bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800" />
          }
        >
          <Search />
        </Suspense>
      </div>

      <div className="hidden items-center gap-2 md:flex lg:gap-4">
        {settings.contact_phone && <WhatsappButton phoneNumber={settings.contact_phone} />}
        <Suspense fallback={<OpenCart />}>
          <Cart />
        </Suspense>
      </div>

      <div className="flex items-center md:hidden">
        <Suspense fallback={<OpenCart />}>
          <Cart />
        </Suspense>
      </div>
    </nav>
  );
}
