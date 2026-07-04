import { NextRequest, NextResponse } from 'next/server';
import { getObjectStream } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const key = resolvedParams.slug.join('/');
    
    // Attempt to fetch from storage
    const obj = await getObjectStream(key);
    
    if (!obj || !obj.stream) {
      return new NextResponse('Media not found', { status: 404 });
    }

    // Set standard cache control headers for media assets
    const headers = new Headers();
    if (obj.contentType) headers.set('Content-Type', obj.contentType);
    if (obj.contentLength) headers.set('Content-Length', obj.contentLength.toString());
    
    // Cache heavily since media is immutable
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    
    if (obj.eTag) headers.set('ETag', obj.eTag);
    if (obj.lastModified) headers.set('Last-Modified', obj.lastModified.toUTCString());

    return new NextResponse(obj.stream, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('API /api/media error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
