import { createApi } from 'lib/api';
import { getCheapestVariant } from 'lib/utils';
import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './lib/i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Helper function to add page parameter if missing
function addPageParameterIfMissing(url: URL): URL | null {
  if (!url.searchParams.has('page')) {
    url.searchParams.set('page', '1');
    return url;
  }
  return null;
}

// Helper function to handle products page routing
async function handleProductsPage(url: URL): Promise<URL | null> {
  const pathname = url.pathname;
  const productsMatch = pathname.match(/\/products$/);

  if (!productsMatch) return null;

  // If no category parameter, fetch categories and set first one
  if (!url.searchParams.has('category')) {
    try {
      const api = createApi({ language: 'en', timeout: 1000 });
      const categoriesResult = await api.getCategories();

      if (categoriesResult.isOk() && categoriesResult.value.data.categories.length > 0) {
        const firstCategoryId = categoriesResult.value.data.categories[0].id;
        url.searchParams.set('category', firstCategoryId.toString());
      }
    } catch (error) {
      console.error('Failed to fetch categories for products redirect:', error);
    }
  }

  // Add page parameter if missing
  return addPageParameterIfMissing(url);
}

// Helper function to handle product variant routing
async function handleProductPage(url: URL): Promise<URL | null> {
  const pathname = url.pathname;
  const productMatch = pathname.match(/\/product\/([^\/]+)$/);

  if (!productMatch) return null;

  // Skip if variant query parameter already exists
  if (url.searchParams.has('variant')) return null;

  try {
    const productSlug = productMatch[1];
    const api = createApi({ language: 'en', timeout: 1000 });
    const productResult = await api.getProduct(productSlug);

    if (productResult.isOk()) {
      const product = productResult.value.data.product;
      const cheapestVariant = getCheapestVariant(product);

      if (cheapestVariant) {
        const missingAttributes = cheapestVariant.attribute_values.filter((attrValue) => {
          const attributeName = attrValue.attribute.name.toLowerCase();
          return !url.searchParams.has(attributeName);
        });

        if (missingAttributes.length > 0) {
          const newUrl = new URL(url.toString());
          missingAttributes.forEach((attrValue) => {
            const attributeName = attrValue.attribute.name.toLowerCase();
            newUrl.searchParams.set(attributeName, attrValue.value);
          });
          return newUrl;
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch product for variant redirect:', error);
  }

  return null;
}

// Helper function to handle guest token
async function handleGuestToken(request: NextRequest, response: NextResponse): Promise<void> {
  const guestToken = request.cookies.get('guest_token');

  if (!guestToken) {
    try {
      const api = createApi({ language: 'en', timeout: 1000 });
      const apiResult = await api.generateGuestToken();

      if (apiResult.isOk() && apiResult.value.data.guest_token) {
        response.cookies.set('guest_token', apiResult.value.data.guest_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/'
        });
      }
    } catch (error) {
      console.error('Failed to generate guest token:', error);
    }
  }
}

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Handle page parameter for category and search pages
  const categoryMatch = pathname.match(/\/category\/(\d+)$/);
  const searchMatch = pathname.match(/\/search$/);

  if ((categoryMatch || searchMatch) && !url.searchParams.has('page')) {
    url.searchParams.set('page', '1');
    return NextResponse.redirect(url);
  }

  // Handle products page routing
  const productsRedirect = await handleProductsPage(url);
  if (productsRedirect) {
    return NextResponse.redirect(productsRedirect);
  }

  // Handle product page routing
  const productRedirect = await handleProductPage(url);
  if (productRedirect) {
    return NextResponse.redirect(productRedirect);
  }

  // Handle locale routing with next-intl
  const response = intlMiddleware(request);

  // // Handle guest token
  // await handleGuestToken(request, response);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
