import { NextRequest, NextResponse } from 'next/server';

// Cache access token to avoid re-authenticating on every request
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getAccessToken(): Promise<string | null> {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const email = process.env.DIRECTUS_EMAIL;
  const password = process.env.DIRECTUS_PASSWORD;

  if (!directusUrl || !email || !password) {
    return null;
  }

  // Return cached token if still valid (with 5 minute buffer)
  if (cachedToken && tokenExpiresAt > Date.now() + 300000) {
    return cachedToken;
  }

  try {
    const cleanUrl = directusUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      console.error('[Directus Asset Proxy] Login failed:', response.status);
      return null;
    }

    const data = await response.json();
    cachedToken = data.data.access_token;
    // Set expiration (default 15 minutes, minus 5 minute buffer)
    tokenExpiresAt = Date.now() + (data.data.expires || 900000) - 300000;

    return cachedToken;
  } catch (error) {
    console.error('[Directus Asset Proxy] Login error:', error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: fileId } = await params;
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

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
    // Get access token
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Failed to authenticate with Directus' },
        { status: 500 }
      );
    }

    // Fetch the image from Directus with authentication
    const cleanUrl = directusUrl.replace(/\/$/, '');
    const assetUrl = `${cleanUrl}/assets/${fileId}`;

    const response = await fetch(assetUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // If unauthorized, clear cached token and retry once
      if (response.status === 401) {
        cachedToken = null;
        tokenExpiresAt = 0;
        const retryToken = await getAccessToken();
        if (retryToken) {
          const retryResponse = await fetch(assetUrl, {
            headers: {
              'Authorization': `Bearer ${retryToken}`,
            },
          });
          if (retryResponse.ok) {
            const imageBuffer = await retryResponse.arrayBuffer();
            const contentType = retryResponse.headers.get('content-type') || 'image/jpeg';
            return new NextResponse(imageBuffer, {
              headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
              },
            });
          }
        }
      }
      return NextResponse.json(
        { error: 'Failed to fetch asset' },
        { status: response.status }
      );
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with proper headers
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
