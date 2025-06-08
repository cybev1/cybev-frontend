export default function handler(req, res) {
  const leaderboard = [
    { username: 'kingwriter', views: 1942, shares: 122, earnings: 132.40 },
    { username: 'truthblogger', views: 1680, shares: 88, earnings: 110.15 },
    { username: 'faithniche', views: 1321, shares: 76, earnings: 98.22 },
    { username: 'techguru', views: 1200, shares: 90, earnings: 85.00 },
    { username: 'visionmedia', views: 1098, shares: 64, earnings: 74.35 }
  ];

  return res.status(200).json({ success: true, data: leaderboard });
}