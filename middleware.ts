import { createApi } from 'lib/api';
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './lib/i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
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
