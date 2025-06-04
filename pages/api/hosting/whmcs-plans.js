
export default async function handler(req, res) {
  const WHMCS_URL = 'https://allhosters.com/billing/includes/api.php';
  const IDENTIFIER = '5VBii5l48pBWptW76HzxHrS5kyl23a3d';
  const SECRET = 'muWQLKJER8n5utUKZ1QVluIiJTnjkblU';

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

    // Return raw or parsed result
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
