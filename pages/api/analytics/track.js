import { parse } from 'useragent';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const { slug, host } = req.body;
  const userAgent = req.headers['user-agent'] || '';
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const location = {
    country: 'Ghana', // Placeholder — in production use IP geolocation
    city: 'Accra'
  };

  const agent = parse(userAgent);
  const device = {
    browser: agent.family,
    version: agent.major,
    os: agent.os.family,
    isMobile: agent.device.family !== 'Other'
  };

  // Log or save to MongoDB
  console.log('📊 Analytics Tracked:', {
    slug,
    host,
    location,
    device,
    timestamp: new Date().toISOString()
  });

  return res.status(200).json({ success: true, message: 'Enhanced analytics logged.' });
}