
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  console.log('📥 New Blog Setup Received:', req.body);

  // Simulate success response
  res.status(200).json({ message: 'Blog setup received', blog: req.body });
}
