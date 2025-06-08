export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ success: false, message: 'Missing topic' });
  }

  const description = `This article explores the topic of "${topic}" in a clear, engaging, and concise way to inform and inspire readers.`;

  return res.status(200).json({ success: true, description });
}