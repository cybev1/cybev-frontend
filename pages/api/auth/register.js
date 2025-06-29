export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  // Simulated DB operation
  console.log('Register:', { name, email });
  return res.status(200).json({ message: 'Registration successful (simulated)' });
}