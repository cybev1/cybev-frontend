
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { domain } = req.body;

  try {
    const response = await fetch('https://domainnameapi.com/api/domain/Whois', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ApiKey: 'openHEAVEN2024$',
        Username: 'qubwebs',
        DomainName: domain
      })
    });

    const data = await response.json();

    if (data.IsAvailable) {
      res.status(200).json({ available: true });
    } else {
      res.status(200).json({ available: false, message: data.Message || "Domain not available" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error checking domain availability' });
  }
}
