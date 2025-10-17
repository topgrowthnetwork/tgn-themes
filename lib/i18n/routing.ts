import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'ar',

  // Disable automatic locale detection to always default to 'ar'
  localeDetection: process.env.DISABLE_LOCALE_DETECTION == 'true' ? false : true
});
