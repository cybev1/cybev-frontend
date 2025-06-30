import dbConnect from '@/lib/mongodb';
import User from '@/models/user.model';
import sendVerificationEmail from '@/lib/sendVerificationEmail';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  await dbConnect();

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ message: 'Email already in use' });

  const newUser = new User({ email, password, username });
  await newUser.save();

  await sendVerificationEmail(email);

  res.status(201).json({ message: 'User created, verification email sent' });
}
