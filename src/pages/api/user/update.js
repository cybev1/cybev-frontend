export default async function handler(req, res) {
  try {
    const token = req.headers.authorization;

    const response = await fetch('https://api.cybev.io/api/user/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}
