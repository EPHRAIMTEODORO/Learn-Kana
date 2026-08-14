import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, deleteCurrentSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await deleteCurrentSession(request);
    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);
    return response;
  }
}
