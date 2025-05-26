export default function getUserTier(totalStaked) {
  if (totalStaked >= 1000) return '💎 Diamond';
  if (totalStaked >= 500) return '🥇 Gold';
  if (totalStaked >= 100) return '🥈 Silver';
  return '🥉 Bronze';
}