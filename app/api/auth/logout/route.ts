import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Successfully logged out.',
  });

  response.cookies.delete('aetheria_session_user');
  return response;
}
