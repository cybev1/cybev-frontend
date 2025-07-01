import DashboardLayout from '@/components/DashboardLayout';
import TimelineCard from '@/components/TimelineCard';

export default function FeedPage() {
  const demoPosts = [
    {
      id: 1,
      author: 'Jane Doe',
      content: 'Excited to launch my first NFT on CYBEV! 🚀',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      author: 'Prince',
      content: 'Just published a blog post on AI-powered Web3 tools. Check it out!',
      timestamp: '4 hours ago',
    },
  ];

  return (
    <DashboardLayout title="Timeline Feed">
      <div className="space-y-4">
        {demoPosts.map(post => (
          <TimelineCard key={post.id} post={post} />
        ))}
      </div>
    </DashboardLayout>
  );
}