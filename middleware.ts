import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createApi } from 'lib/api';

export async function middleware(request: NextRequest) {
  // Check if guest token exists
  const guestToken = request.cookies.get('guest_token');

  // If guest token doesn't exist, generate one and set it in cookies
  if (!guestToken) {
    try {
      // Use the createApi function to generate guest token
      const api = createApi({ language: 'en' });
      const apiResult = await api.generateGuestToken();

      if (apiResult.isOk() && apiResult.value.data.guest_token) {
        // Create response with the guest token cookie
        const response = NextResponse.next();

        // Set the guest token cookie
        response.cookies.set('guest_token', apiResult.value.data.guest_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/'
        });

        return response;
      }
    } catch (error) {
      console.error('Failed to generate guest token:', error);
    }
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
