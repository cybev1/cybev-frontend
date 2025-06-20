import FollowButton from '@/components/social/FollowButton';

export default function SuggestedFollowers({ users = [] }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 mt-6">
      <h3 className="font-semibold text-sm mb-3">👥 People You May Know</h3>
      <ul className="space-y-3 text-sm">
        {users.map((user, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <span>@{user.username}</span>
            </div>
            <FollowButton targetUsername={user.username} />
          </li>
        ))}
      </ul>
    </div>
  );
}