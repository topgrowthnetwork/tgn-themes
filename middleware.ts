import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createApi } from 'lib/api';
import { getProductIdBySlug } from 'lib/bigcommerce';

export async function middleware(request: NextRequest) {
  // Check if guest token exists
  const guestToken = request.cookies.get('guest_token');

  // If guest token doesn't exist, generate one and set it in cookies
  if (!guestToken) {
    try {
      // Use the createApi function to generate guest token
      const api = createApi({ language: 'en' });
      const apiResponse = await api.generateGuestToken();

      if (apiResponse.success && apiResponse.data.guest_token) {
        // Create response with the guest token cookie
        const response = NextResponse.next();

        // Set the guest token cookie
        response.cookies.set('guest_token', apiResponse.data.guest_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/'
        });

        // Handle product rewrite if needed
        const pageNode = await getProductIdBySlug(request.nextUrl.pathname);
        if (pageNode?.__typename === 'Product') {
          return NextResponse.rewrite(new URL(`/product/${pageNode.entityId}`, request.url));
        }

        return response;
      }
    } catch (error) {
      console.error('Failed to generate guest token:', error);
    }
  }

  // If guest token exists or generation failed, continue with normal flow
  const pageNode = await getProductIdBySlug(request.nextUrl.pathname);

  if (pageNode?.__typename === 'Product') {
    return NextResponse.rewrite(new URL(`/product/${pageNode.entityId}`, request.url));
  }

  return NextResponse.next();
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
