
export default async function handler(req, res) {
  const API_URL = 'https://hosterocean.com/secure/modules/addons/ProductsReseller/api/index.php';
  const API_EMAIL = 'udezedike@gmail.com';
  const API_KEY = 'x0WutCoD6b7u0VkulcC8ecAf5ASn23aS';

  const payload = {
    action: 'get_products',
    api_email: API_EMAIL,
    api_key: API_KEY
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.success) {
      res.status(200).json(data.products || []);
    } else {
      res.status(500).json({ error: data.message || "Failed to fetch plans" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}
