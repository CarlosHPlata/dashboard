import type { APIRoute } from 'astro';

// Bing Image API endpoint
const BING_API_URL = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Fetch the daily image from Bing
    const response = await fetch(BING_API_URL);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch from Bing API' }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await response.json();

    // Return the Bing image data as-is
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error fetching Bing wallpaper:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
