import { NextRequest, NextResponse } from 'next/server';
import { authenticateMasterAdmin, initializeMasterAdmin } from '@/lib/auth/master-admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Ensure master admin exists
    await initializeMasterAdmin();

    // Authenticate
    const result = await authenticateMasterAdmin(email, password);

    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: 'Authentication successful',
      user: result.user
    });

    response.cookies.set('admin-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

// Initialize admin endpoint
export async function GET() {
  try {
    await initializeMasterAdmin();
    return NextResponse.json({ message: 'Master admin initialized' });
  } catch (error) {
    console.error('Initialization error:', error);
    return NextResponse.json(
      { error: 'Initialization failed' }, 
      { status: 500 }
    );
  }
}