import { NextResponse } from 'next/server';
import discogsClient from '@/lib/discogs/client';

/**
 * GET /api/discogs/artist/[id]
 * Get artist details by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Artist ID is required' },
        { status: 400 }
      );
    }

    const data = await discogsClient.getArtist(id);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Artist API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist details', details: error.message },
      { status: 500 }
    );
  }
}
