export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { topic, words = 700 } = req.body;

  if (!topic) {
    return res.status(400).json({ success: false, message: 'Missing topic' });
  }

  const article = `This is a simulated ${words}-word article about "${topic}". Use this placeholder or connect to OpenAI to generate rich content.`;

  return res.status(200).json({ success: true, content: article });
}