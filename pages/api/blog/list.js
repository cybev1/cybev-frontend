export default async function handler(req, res) {
  // This should ideally check the logged-in user's session
  // For now, we simulate with static blog entries
  const blogs = [
    {
      _id: 'blog123',
      title: 'Christian Growth',
      subdomain: 'growth',
      domain: '',
    },
    {
      _id: 'blog456',
      title: 'Tech Trends',
      subdomain: '',
      domain: 'techtalks.io',
    }
  ];

  return res.status(200).json({ success: true, blogs });
}