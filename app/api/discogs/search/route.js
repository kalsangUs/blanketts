import { NextResponse } from 'next/server';
import discogsClient from '@/lib/discogs/client';

/**
 * GET /api/discogs/search
 * Search the Discogs database
 * Query params: q (query), type, artist, release_title, etc.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Extract all search parameters
    const options = {};
    searchParams.forEach((value, key) => {
      if (key !== 'q') {
        options[key] = value;
      }
    });

    const data = await discogsClient.search(query, options);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search Discogs database', details: error.message },
      { status: 500 }
    );
  }
}
