// pages/api/domains/check.js
// Calls your existing Railway backend domain API

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ ok: false, error: 'Domain is required' });
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Clean domain input
    const cleanDomain = domain.toLowerCase().trim();
    
    // Check if it's a subdomain (no dots) or custom domain
    const isSubdomain = !cleanDomain.includes('.') || cleanDomain.endsWith('.cybev.io');
    
    if (isSubdomain) {
      // Extract subdomain name
      const subdomain = cleanDomain.replace('.cybev.io', '');
      
      // Call your backend subdomain check
      const response = await fetch(`${API_URL}/api/domain/check?domain=${subdomain}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization || ''
        }
      });

      const data = await response.json();
      
      return res.status(200).json({
        ok: true,
        available: data.available,
        domain: `${subdomain}.cybev.io`,
        type: 'subdomain',
        price: 0
      });
    } else {
      // Custom domain - call your backend domain API
      const response = await fetch(`${API_URL}/api/domain/check?domain=${cleanDomain}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization || ''
        }
      });

      const data = await response.json();
      
      return res.status(200).json({
        ok: true,
        available: data.available,
        domain: cleanDomain,
        type: 'custom',
        price: data.price || 12.99,
        currency: data.currency || 'USD',
        registrar: data.registrar || 'DomainNameAPI'
      });
    }

  } catch (error) {
    console.error('Domain check proxy error:', error);
    
    // Graceful fallback - assume available for development
    return res.status(200).json({
      ok: true,
      available: true,
      domain: req.body.domain,
      note: 'Backend unavailable, assuming available'
    });
  }
}
