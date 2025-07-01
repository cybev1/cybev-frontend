
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { darkMode } = req.body;
    console.log('Dark mode saved:', darkMode);
    return res.status(200).json({ success: true });
  }
  return res.status(405).end(); // Method Not Allowed
}
