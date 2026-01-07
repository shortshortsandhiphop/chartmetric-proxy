// Root index page
// This file should be placed in: api/index.js

export default function handler(req, res) {
  res.status(200).json({
    status: 'online',
    message: 'Chartmetric Proxy API',
    endpoints: {
      '/api/chartmetric': 'Main proxy endpoint (POST requests only)',
    },
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}
