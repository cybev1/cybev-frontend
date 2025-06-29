export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

  // Simulated DB login check
  console.log('Login:', { email });
  return res.status(200).json({ message: 'Login successful (simulated)' });
}