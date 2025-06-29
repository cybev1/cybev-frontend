import { connectToDatabase } from '../../../lib/mongodb';
export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { email } = req.query;
  await db.collection('users').updateOne({ email }, { $set: { verified: true } });
  res.redirect('/verify-email');
}