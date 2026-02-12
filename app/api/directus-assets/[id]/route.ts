import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: fileId } = await params;
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const token = process.env.DIRECTUS_STATIC_TOKEN;

  if (!directusUrl) {
    return NextResponse.json(
      { error: 'Directus not configured' },
      { status: 500 }
    );
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(fileId)) {
    return NextResponse.json(
      { error: 'Invalid file ID format' },
      { status: 400 }
    );
  }

  try {
    const cleanUrl = directusUrl.replace(/\/$/, '');
    const assetUrl = `${cleanUrl}/assets/${fileId}`;

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(assetUrl, { headers });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch asset' },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('[Directus Asset Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
