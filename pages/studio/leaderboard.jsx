import DashboardLayout from '@/components/DashboardLayout';
import LeaderboardCard from '@/components/LeaderboardCard';

export default function LeaderboardPage() {
  const topUsers = [
    { username: 'prince', earnings: 523.50, minted: 12, rank: 1 },
    { username: 'jane_doe', earnings: 420.75, minted: 9, rank: 2 },
    { username: 'soulwinner', earnings: 318.00, minted: 7, rank: 3 },
  ];

  return (
    <DashboardLayout title="Leaderboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topUsers.map(user => (
          <LeaderboardCard key={user.username} user={user} />
        ))}
      </div>
    </DashboardLayout>
  );
}