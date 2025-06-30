import dbConnect from '@/lib/mongodb';
import User from '@/models/user.model';
import sendVerificationEmail from '@/lib/sendVerificationEmail';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();
  const { email, password, username } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const newUser = new User({ email, password, username, verified: false });
  await newUser.save();

  await sendVerificationEmail(newUser.email, newUser._id);

  res.status(201).json({ message: 'User created, please check your email to verify' });
}
