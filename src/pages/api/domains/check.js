// pages/api/domains/check.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ ok: false, error: 'Domain is required' });
    }

    // For subdomains (*.cybev.io)
    if (domain.endsWith('.cybev.io')) {
      const subdomain = domain.replace('.cybev.io', '');
      
      // Check subdomain availability
      // TODO: Replace with actual database check
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      try {
        const response = await fetch(`${API_URL}/api/domains/check-subdomain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subdomain })
        });
        
        const data = await response.json();
        return res.status(200).json({
          ok: true,
          available: data.available,
          domain: domain
        });
      } catch (error) {
        // If backend check fails, assume available for now
        console.log('Backend check failed, assuming available');
        return res.status(200).json({
          ok: true,
          available: true,
          domain: domain
        });
      }
    }

    // For custom domains
    // Check with domain registrar API (optional)
    // For now, we'll assume custom domains need to be owned/connected
    return res.status(200).json({
      ok: true,
      available: true, // Custom domains are "available" to connect
      domain: domain,
      isCustom: true
    });

  } catch (error) {
    console.error('Domain check error:', error);
    return res.status(500).json({
      ok: false,
      error: 'Failed to check domain availability'
    });
  }
}