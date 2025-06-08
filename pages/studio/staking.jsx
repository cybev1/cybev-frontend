import React from 'react';
import StakeForm from '@/components/staking/StakeForm';
import StakeDashboard from '@/components/staking/StakeDashboard';
import StakeHistory from '@/components/staking/StakeHistory';
import RewardCard from '@/components/staking/RewardCard';
import StakeStats from '@/components/staking/StakeStats';

export default function StakingPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">CYBV Staking Center</h1>
      <StakeForm />
      <RewardCard />
      <StakeDashboard />
      <StakeStats />
      <StakeHistory />
    </div>
  );
}