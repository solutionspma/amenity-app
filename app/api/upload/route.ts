import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const type = formData.get('type') as string; // 'profile' or 'cover'

    if (!file || !userId || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large (max 5MB)' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // In a real application, you would:
    // 1. Upload to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Store the URL in your database
    // 3. Return the public URL
    
    // For this demo, we'll return a mock URL
    const mockUrl = `/api/images/${userId}/${type}/${file.name}`;
    
    return NextResponse.json({
      success: true,
      url: mockUrl,
      size: file.size,
      type: file.type,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const type = searchParams.get('type');

  if (!userId || !type) {
    return NextResponse.json(
      { success: false, error: 'Missing parameters' },
      { status: 400 }
    );
  }

  // In a real application, you would fetch from your database
  // For now, return a mock response
  return NextResponse.json({
    success: true,
    url: null, // No stored image
    message: 'No image found'
  });
}