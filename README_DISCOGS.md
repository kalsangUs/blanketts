# Discogs API Integration

This project integrates with the Discogs API to fetch music data.

## Setup

### 1. Get Discogs API Credentials

1. Go to [Discogs Developer Settings](https://www.discogs.com/settings/developers)
2. Create a new application
3. Get your Consumer Key and Consumer Secret
4. Generate a Personal Access Token (recommended for easier authentication)

### 2. Configure Environment Variables

Copy the credentials to your `.env.local` file:

```bash
DISCOGS_CONSUMER_KEY=your_consumer_key_here
DISCOGS_CONSUMER_SECRET=your_consumer_secret_here
DISCOGS_TOKEN=your_personal_access_token_here
```

**Note:** The `.env.local` file is already created. Just replace the placeholder values.

### 3. Restart Development Server

After adding your credentials, restart the dev server:

```bash
npm run dev
```

## API Routes

### Search

```
GET /api/discogs/search?q=query&type=release
```

Query parameters:

- `q` (required): Search query
- `type`: Filter by type (release, master, artist, label)
- `artist`: Filter by artist name
- `release_title`: Filter by release title
- `year`: Filter by year

### Get Release

```
GET /api/discogs/release/[id]
```

### Get Artist

```
GET /api/discogs/artist/[id]
```

## Usage Example

### From Client Component

```javascript
"use client";
import { useState } from "react";

export default function SearchComponent() {
  const [results, setResults] = useState([]);

  const searchDiscogs = async (query) => {
    const response = await fetch(
      `/api/discogs/search?q=${encodeURIComponent(query)}`,
    );
    const data = await response.json();
    setResults(data.results);
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => searchDiscogs(e.target.value)}
        placeholder="Search music..."
      />
      {/* Display results */}
    </div>
  );
}
```

### From Server Component

```javascript
import discogsClient from "@/lib/discogs/client";

export default async function ServerPage() {
  const results = await discogsClient.search("Pink Floyd");

  return <div>{/* Display results */}</div>;
}
```

## File Structure

```
/Users/kal/blankets/
├── .env.local                          # Environment variables (API credentials)
├── lib/
│   └── discogs/
│       └── client.js                   # Discogs API client
└── app/
    └── api/
        └── discogs/
            ├── search/
            │   └── route.js           # Search endpoint
            ├── release/
            │   └── [id]/
            │       └── route.js       # Get release by ID
            └── artist/
                └── [id]/
                    └── route.js       # Get artist by ID
```

## Rate Limiting

Discogs API has rate limits:

- **Authenticated requests**: 60 requests per minute
- **Unauthenticated requests**: 25 requests per minute

Using a Personal Access Token (recommended) gives you higher rate limits.

## Next Steps

1. Add your Discogs API credentials to `.env.local`
2. Test the API routes using the browser or a tool like Postman
3. Build your frontend components to consume these APIs
4. Consider adding caching to reduce API calls
5. Add more endpoints as needed (masters, labels, etc.)
