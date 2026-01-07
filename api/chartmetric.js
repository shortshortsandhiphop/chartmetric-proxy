// Chartmetric API Proxy
// This file should be placed in: api/chartmetric.js

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { action, refreshToken, accessToken, artistId, query } = req.body || req.query;

    // Action 1: Get Access Token
    if (action === 'getToken') {
      const response = await fetch('https://api.chartmetric.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshtoken: refreshToken
        })
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // Action 2: Search Artists
    if (action === 'search') {
      const searchUrl = `https://api.chartmetric.com/api/search?q=${encodeURIComponent(query)}&type=artists&limit=10`;
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // Action 3: Get Artist Stats
    if (action === 'getArtistStats') {
      const response = await fetch(`https://api.chartmetric.com/api/artist/${artistId}/stat`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // Action 4: Get Spotify Listening Data
    if (action === 'getSpotifyListening') {
      const response = await fetch(`https://api.chartmetric.com/api/artist/${artistId}/listening/spotify?since=2024-01-01`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // Action 5: Get Spotify Followers
    if (action === 'getSpotifyFollowers') {
      const response = await fetch(`https://api.chartmetric.com/api/artist/${artistId}/stat/spotify/followers?since=2024-01-01`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // Action 6: Get Instagram Stats
    if (action === 'getInstagramFollowers') {
      const response = await fetch(`https://api.chartmetric.com/api/artist/${artistId}/stat/instagram/followers?since=2024-01-01`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // Action 7: Get TikTok Stats
    if (action === 'getTikTokFollowers') {
      const response = await fetch(`https://api.chartmetric.com/api/artist/${artistId}/stat/tiktok/followers?since=2024-01-01`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      stack: error.stack 
    });
  }
}
