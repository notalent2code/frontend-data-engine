import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get('isLoggedIn')

  if (!isLoggedIn || isLoggedIn.value !== 'true') {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
