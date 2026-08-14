import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth status error:', error);
    return NextResponse.json({ user: null });
  }
}
