import { NextResponse } from 'next/server';
import discogsClient from '@/lib/discogs/client';

/**
 * GET /api/discogs/release/[id]
 * Get release details by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Release ID is required' },
        { status: 400 }
      );
    }

    const data = await discogsClient.getRelease(id);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Release API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch release details', details: error.message },
      { status: 500 }
    );
  }
}
