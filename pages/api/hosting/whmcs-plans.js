
export default async function handler(req, res) {
  const WHMCS_URL = 'https://allhosters.com/billing/admin/includes/api.php';
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

    const raw = await response.text(); // use text for debug visibility
    res.status(200).send(raw);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
