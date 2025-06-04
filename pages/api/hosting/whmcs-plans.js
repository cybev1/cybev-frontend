
export default async function handler(req, res) {
  const WHMCS_URL = 'https://allhosters.com/billing/admin/includes/api.php';
  const IDENTIFIER = 'UTQ8MmuugtJ9GwTrhEWX248hatg5Ln2S';
  const SECRET = ''; // You can set secret as env variable for security

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

    if (data.result === 'success') {
      res.status(200).json(data.products.product || []);
    } else {
      res.status(500).json({ error: data.message || 'WHMCS error' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
