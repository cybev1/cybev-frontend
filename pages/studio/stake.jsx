import dynamic from 'next/dynamic';

const StakeCard = dynamic(() => import('../../components/StakeCard'), { ssr: false });

export default function StakePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-6">
      <div className="max-w-xl mx-auto">
        <StakeCard />
      </div>
    </div>
  );
}
