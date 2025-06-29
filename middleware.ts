import { createApi } from 'lib/api';
import { getCheapestVariant } from 'lib/utils';
import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './lib/i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Check if this is a category page without page parameter
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Check if it's a category page (matches pattern like /category/123 or /en/category/123)
  const categoryMatch = pathname.match(/\/category\/(\d+)$/);

  if (categoryMatch && !url.searchParams.has('page')) {
    // Add page=1 parameter and redirect
    url.searchParams.set('page', '1');
    return NextResponse.redirect(url);
  }

  // Check if it's a search page without page parameter
  const searchMatch = pathname.match(/\/search$/);

  if (searchMatch && !url.searchParams.has('page')) {
    // Add page=1 parameter and redirect
    url.searchParams.set('page', '1');
    return NextResponse.redirect(url);
  }

  // Check if it's a product page
  const productMatch = pathname.match(/\/product\/([^\/]+)$/);

  if (productMatch) {
    try {
      const productSlug = productMatch[1];
      const api = createApi({ language: 'en' });
      const productResult = await api.getProduct(productSlug);

      if (productResult.isOk()) {
        const product = productResult.value.data.product;
        const cheapestVariant = getCheapestVariant(product);

        if (cheapestVariant) {
          // Check if any variant attributes are missing from the URL
          const missingAttributes = cheapestVariant.attribute_values.filter((attrValue) => {
            const attributeName = attrValue.attribute.name.toLowerCase();
            return !url.searchParams.has(attributeName);
          });

          // If any attributes are missing, add them
          if (missingAttributes.length > 0) {
            const newUrl = new URL(request.url);

            // Add missing attributes
            missingAttributes.forEach((attrValue) => {
              const attributeName = attrValue.attribute.name.toLowerCase();
              newUrl.searchParams.set(attributeName, attrValue.value);
            });

            return NextResponse.redirect(newUrl);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch product for variant redirect:', error);
    }
  }

  // First, handle locale routing with next-intl
  const response = intlMiddleware(request);

  // Check if guest token exists
  const guestToken = request.cookies.get('guest_token');

  // If guest token doesn't exist, generate one and set it in cookies
  if (!guestToken) {
    try {
      // Use the createApi function to generate guest token
      const api = createApi({ language: 'en' });
      const apiResult = await api.generateGuestToken();

      if (apiResult.isOk() && apiResult.value.data.guest_token) {
        // Set the guest token cookie on the response
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
