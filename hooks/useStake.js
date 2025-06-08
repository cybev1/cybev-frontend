import API from '@/lib/api';

export const stakeTokens = async (amount, lockPeriod) => {
  const res = await API.post('/stake', { amount, lockPeriod });
  return res.data;
};

export const unstakeTokens = async (stakeId) => {
  const res = await API.post('/unstake', { stakeId });
  return res.data;
};

export const getStakeStatus = async () => {
  const res = await API.get('/stake/status');
  return res.data;
};

export const getStakeHistory = async () => {
  const res = await API.get('/stake/history');
  return res.data;
};