import { NextRequest, NextResponse } from 'next/server';
import { createSession, createUser, setSessionCookie, validateSignupInput } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };
    const name = body.name ?? '';
    const email = body.email ?? '';
    const password = body.password ?? '';
    const validationError = validateSignupInput(name, email, password);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const user = await createUser(name, email, password);
    const session = await createSession(user.id);
    const response = NextResponse.json({ user });
    setSessionCookie(response, session.token);
    return response;
  } catch (error) {
    const duplicateKeyCode = 11000;
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === duplicateKeyCode
    ) {
      return NextResponse.json({ error: 'An account already exists for that email.' }, { status: 409 });
    }

    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Could not create account.' }, { status: 500 });
  }
}
