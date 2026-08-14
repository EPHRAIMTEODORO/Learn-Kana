import { NextRequest, NextResponse } from 'next/server';
import {
  GOOGLE_OAUTH_STATE_COOKIE,
  clearGoogleOAuthStateCookie,
  createOrUpdateGoogleUser,
  createSession,
  setSessionCookie,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleUserInfo = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

function redirectWithError(request: NextRequest, error: string) {
  const response = NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  clearGoogleOAuthStateCookie(response);
  return response;
}

function getRedirectUri(request: NextRequest) {
  return new URL('/api/auth/google/callback', request.nextUrl.origin).toString();
}

async function exchangeCodeForAccessToken(request: NextRequest, code: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth is not configured.');
  }

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: getRedirectUri(request),
    }),
  });
  const payload = (await response.json()) as GoogleTokenResponse;

  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error ?? 'Google token exchange failed.');
  }

  return payload.access_token;
}

async function getGoogleUserInfo(accessToken: string) {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = (await response.json()) as GoogleUserInfo;

  if (!response.ok || !payload.sub || !payload.email || !payload.email_verified) {
    throw new Error('Could not verify Google account.');
  }

  return payload;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const expectedState = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectWithError(request, 'google_state_mismatch');
  }

  try {
    const accessToken = await exchangeCodeForAccessToken(request, code);
    const googleUser = await getGoogleUserInfo(accessToken);
    const user = await createOrUpdateGoogleUser({
      googleId: googleUser.sub ?? '',
      email: googleUser.email ?? '',
      name: googleUser.name ?? googleUser.email ?? 'Google User',
      image: googleUser.picture,
    });
    const session = await createSession(user.id);
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    setSessionCookie(response, session.token);
    clearGoogleOAuthStateCookie(response);
    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return redirectWithError(request, 'google_auth_failed');
  }
}
