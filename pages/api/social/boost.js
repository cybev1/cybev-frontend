
let boostedPosts = [];

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { postId, userId, budget, duration } = req.body;

  if (!postId || !userId || !budget) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const boostRecord = {
    boostId: boostedPosts.length + 1,
    postId,
    userId,
    budget: parseFloat(budget),
    duration: duration || '7 days',
    viewsBoosted: Math.floor(parseFloat(budget) * 50), // simulate reach
    startedAt: new Date().toISOString(),
    status: 'Active',
  };

  boostedPosts.push(boostRecord);
  console.log('Post Boosted:', boostRecord);

  return res.status(200).json({ message: 'Post boost successful', boost: boostRecord });
}
