export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { slug, host } = req.body;

  if (!slug || !host) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  console.log(`🔗 Share recorded for: ${slug} on ${host}`);

  // Simulate: db.posts.updateOne({slug, host}, {$inc: {shares: 1}})
  return res.status(200).json({ success: true, message: 'Share tracked' });
}