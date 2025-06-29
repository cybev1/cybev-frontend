import { connectToDatabase } from '../../../lib/mongodb';
export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const exists = await db.collection('users').findOne({ email });
    if (exists) return res.status(400).json({ error: 'User already exists' });
    await db.collection('users').insertOne({ email, password, verified: false });
    res.status(200).json({ message: 'Registered successfully. Check your email to verify.' });
  }
}