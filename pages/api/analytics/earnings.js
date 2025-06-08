export default function handler(req, res) {
  const { blogId } = req.query;

  if (!blogId) {
    return res.status(400).json({ success: false, message: 'Missing blogId' });
  }

  // Simulated summary
  const earnings = {
    blogId,
    totalPosts: 12,
    totalViews: 2450,
    totalShares: 122,
    estEarnings: 178.35 // USD or token equivalent
  };

  return res.status(200).json({ success: true, earnings });
}