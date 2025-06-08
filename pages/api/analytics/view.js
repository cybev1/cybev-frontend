export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { slug, host } = req.body;

  if (!slug || !host) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  console.log(`🔍 View recorded for: ${slug} on ${host}`);

  // Simulated database increment logic
  // Replace with MongoDB: db.posts.updateOne({slug, host}, {$inc: {views: 1}})
  return res.status(200).json({ success: true, message: 'View tracked' });
}