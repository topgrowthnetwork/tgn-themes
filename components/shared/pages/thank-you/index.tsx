import { createApi } from 'lib/api';
import { Link } from 'lib/i18n/navigation';
import { getLocale, getTranslations } from 'next-intl/server';

export default async function ThankYouPage() {
  const t = await getTranslations('ThankYou');
  const language = await getLocale();
  const api = createApi({ language });
  const categoriesResult = await api.getCategories();
  const firstCategoryId = (function getFirstCategoryId() {
    if (categoriesResult.isOk() && categoriesResult.value.data.categories.length > 0) {
      return categoriesResult.value.data.categories[0].id;
    }
    return null;
  })();

  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center"
      data-testid="thank-you-page"
    >
      <div className="max-w-md space-y-6">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <svg
            className="h-8 w-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('message')}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/products?category=${firstCategoryId}`}
            className="button !inline-flex !px-6 !py-3 !text-sm font-medium"
          >
            {t('continueShopping')}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-theme border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
          >
            {t('backToHome')}
          </Link>
        </div>

        {/* Additional Info */}
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('additionalInfo')}</p>
      </div>
    </div>
  );
}
