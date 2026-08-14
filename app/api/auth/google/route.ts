import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { setGoogleOAuthStateCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

function getRedirectUri(request: NextRequest) {
  return new URL('/api/auth/google/callback', request.nextUrl.origin).toString();
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(new URL('/login?error=google_not_configured', request.url));
  }

  const state = randomBytes(24).toString('base64url');
  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', getRedirectUri(request));
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'select_account');

  const response = NextResponse.redirect(authUrl);
  setGoogleOAuthStateCookie(response, state);
  return response;
}
