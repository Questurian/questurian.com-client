/**
 * API proxy route handler
 * Forwards all /api/* requests to the backend and handles cookie tunneling
 * This ensures cookies set by the backend are accessible to the frontend
 */

import { NextRequest, NextResponse } from 'next/server';

async function handleRequest(
  method: string,
  request: NextRequest,
  pathSegments: string[]
) {
  try {
    // Get the backend URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://9ffd2c7233e6.ngrok-free.app';

    // Reconstruct the API path from the catch-all route
    const apiPath = `/api/${pathSegments.join('/')}`;
    const targetUrl = new URL(apiPath, backendUrl).toString();

    // Preserve query parameters
    const queryString = request.nextUrl.search;
    const urlWithQuery = queryString ? `${targetUrl}${queryString}` : targetUrl;

    // Copy headers from the original request
    const headers = new Headers(request.headers);

    // Remove host header to avoid conflicts
    headers.delete('host');

    // Add ngrok skip browser warning if using ngrok
    if (backendUrl.includes('ngrok')) {
      headers.set('ngrok-skip-browser-warning', 'true');
    }

    // Get the request body if it exists
    let body: BodyInit | undefined = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await request.text();
    }

    // Make the request to the backend
    const response = await fetch(urlWithQuery, {
      method,
      headers,
      body,
      credentials: 'include',
    });

    // Get all headers from the backend response
    const responseHeaders = new Headers(response.headers);

    // Handle Set-Cookie headers - rewrite domain for cookie tunneling
    const setCookieHeaders = response.headers.getSetCookie();

    // Clear existing Set-Cookie headers
    responseHeaders.delete('set-cookie');

    // Rewrite and re-add Set-Cookie headers
    setCookieHeaders.forEach((setCookieHeader) => {
      let modifiedHeader = setCookieHeader;

      // If using ngrok in development, rewrite the domain to localhost
      // In production, rewrite ngrok domain to the actual domain
      if (backendUrl.includes('ngrok')) {
        // In production: rewrite ngrok domain to questurian.com
        if (process.env.NODE_ENV === 'production') {
          // Remove the ngrok domain and use the frontend domain
          modifiedHeader = modifiedHeader.replace(
            /Domain=[^;]*/i,
            `Domain=.questurian.com`
          );

          // Ensure SameSite is not Strict (should be Lax or None for cross-site)
          if (modifiedHeader.toLowerCase().includes('samesite=strict')) {
            modifiedHeader = modifiedHeader.replace(
              /SameSite=Strict/i,
              'SameSite=Lax'
            );
          }
        } else {
          // In development: use localhost
          modifiedHeader = modifiedHeader.replace(
            /Domain=[^;]*/i,
            `Domain=localhost`
          );
        }
      }

      responseHeaders.append('set-cookie', modifiedHeader);
    });

    // Return the response with modified headers
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[API Route Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest('GET', request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest('POST', request, path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest('PUT', request, path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest('PATCH', request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest('DELETE', request, path);
}
