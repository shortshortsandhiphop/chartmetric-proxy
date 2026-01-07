module.exports = async function handler(req, res) {  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.status(200).end();
  return;
}

  // Handle GET request to root - just for testing
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Chartmetric proxy is running',
      timestamp: new Date().toISOString()
    });
  }

  // All other requests should be POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { action, refreshToken, accessToken, artistId, query } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'Missing action parameter' });
    }

    // Action 1: Get Access Token
    if (action === 'getToken') {
      if (!refreshToken) {
        return res.status(400).json({ error: 'Missing refreshToken' });
      }

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

    // All other actions require accessToken
    if (!accessToken) {
      return res.status(400).json({ error: 'Missing accessToken' });
    }

    // Action 2: Search Artists
    if (action === 'search') {
      if (!query) {
        return res.status(400).json({ error: 'Missing query parameter' });
      }

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
      if (!artistId) {
        return res.status(400).json({ error: 'Missing artistId' });
      }

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
      if (!artistId) {
        return res.status(400).json({ error: 'Missing artistId' });
      }

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
      if (!artistId) {
        return res.status(400).json({ error: 'Missing artistId' });
      }

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
      if (!artistId) {
        return res.status(400).json({ error: 'Missing artistId' });
      }

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
      if (!artistId) {
        return res.status(400).json({ error: 'Missing artistId' });
      }

      const response = await fetch(`https://api.chartmetric.com/api/artist/${artistId}/stat/tiktok/followers?since=2024-01-01`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    return res.status(400).json({ error: 'Invalid action specified' });
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal proxy error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
