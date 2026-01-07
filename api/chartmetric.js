module.exports = async function handler(req, res) {
  // CRITICAL: Set CORS headers FIRST, before anything else
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Chartmetric proxy is running',
      timestamp: new Date().toISOString()
    });
  }

  // Handle POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, refreshToken, accessToken, artistId, query } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'Missing action parameter' });
    }

    if (action === 'getToken') {
      if (!refreshToken) {
        return res.status(400).json({ error: 'Missing refreshToken' });
      }

      const response = await fetch('https://api.chartmetric.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshtoken: refreshToken })
      });

      const data = await response.json();
      return res.status(re
