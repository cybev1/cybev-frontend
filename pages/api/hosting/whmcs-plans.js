
export default async function handler(req, res) {
  const WHMCS_URL = 'https://allhosters.com/billing/admin/includes/api.php';
  const IDENTIFIER = '0J98hOT9ympVknxAeyGaJF251dohUKkP';
  const SECRET = ''; // Can be added later if needed

  const formData = new URLSearchParams();
  formData.append('action', 'GetProducts');
  formData.append('identifier', IDENTIFIER);
  formData.append('secret', SECRET);
  formData.append('responsetype', 'json');

  try {
    const response = await fetch(WHMCS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const data = await response.json();

    // Return full raw response for debugging
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
