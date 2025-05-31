
let adCampaigns = [];

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { title, type, targetAudience, budget } = req.body;

  if (!title || !type || !targetAudience || !budget) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newAd = {
    id: adCampaigns.length + 1,
    title,
    type,
    targetAudience,
    budget: parseFloat(budget),
    views: 0,
    clicks: 0,
    status: 'Active',
    createdAt: new Date().toISOString(),
  };

  adCampaigns.push(newAd);
  console.log('Ad Created:', newAd);

  return res.status(200).json({ message: 'Ad created successfully', ad: newAd });
}
