import { createApi } from 'lib/api';
import { routing } from 'lib/i18n/routing';
import { MetadataRoute } from 'next';

type Route = {
  url: string;
  lastModified: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: Route[] = [];

  // Add static routes for each language
  const staticRoutes = [
    '', // Homepage
    '/search', // Search page
    '/theme-demo', // Theme demo page
    '/theme-example' // Theme example page
  ];

  for (const locale of routing.locales) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8
      });
    }
  }

  try {
    // Fetch categories for each language
    for (const locale of routing.locales) {
      const api = createApi({ language: locale });
      const categoriesResult = await api.getCategories();

      if (categoriesResult.isOk()) {
        const categories = categoriesResult.value.data.categories;
        categories.forEach((category) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/category/${category.id}`,
            lastModified: category.updated_at,
            changeFrequency: 'weekly',
            priority: 0.7
          });
        });
      }
    }

    // Fetch products for each language
    for (const locale of routing.locales) {
      const api = createApi({ language: locale });
      const productsResult = await api.getProducts({ per_page: '1000' }); // Get all products

      if (productsResult.isOk()) {
        const products = productsResult.value.data.products.data;
        products.forEach((product) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/product/${product.slug}`,
            lastModified: product.updated_at,
            changeFrequency: 'weekly',
            priority: 0.6
          });
        });
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static routes even if API calls fail
  }

  return sitemapEntries;
}
