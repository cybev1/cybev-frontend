
export default async function handler(req, res) {
  const mockHistory = [
    { type: 'Referral Claim', amount: 25 },
    { type: 'Boost Earn', amount: 12.5 },
    { type: 'Mint Reward', amount: 10 },
    { type: 'Withdrawal', amount: -20 },
    { type: 'Staking Bonus', amount: 8 },
  ];

  return res.status(200).json({
    success: true,
    transactions: mockHistory
  });
}
