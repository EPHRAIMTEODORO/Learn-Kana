import { NextRequest, NextResponse } from 'next/server';
import { createSession, findUserByEmail, setSessionCookie, verifyPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };
    const email = body.email?.trim() ?? '';
    const password = body.password ?? '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const userDocument = await findUserByEmail(email);
    const isValidPassword = userDocument
      && userDocument.passwordHash
      && userDocument.passwordSalt
      ? await verifyPassword(password, userDocument.passwordHash, userDocument.passwordSalt)
      : false;

    if (!userDocument || !isValidPassword) {
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    }

    const session = await createSession(userDocument.id);
    const response = NextResponse.json({
      user: {
        id: userDocument.id,
        name: userDocument.name,
        email: userDocument.email,
        createdAt: userDocument.createdAt,
      },
    });
    setSessionCookie(response, session.token);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Could not log in.' }, { status: 500 });
  }
}
