
export default async function handler(req, res) {
  // Simulated log data
  const logs = [
    { type: 'Stake', amount: 100, date: '2025-06-05T10:00:00Z' },
    { type: 'Claim', amount: 47.5, date: '2025-06-07T08:00:00Z' },
    { type: 'Reward Unlock', amount: 12.5, date: '2025-06-10T09:30:00Z' },
    { type: 'Stake', amount: 50, date: '2025-06-11T12:15:00Z' }
  ];

  return res.status(200).json({
    success: true,
    logs
  });
}
