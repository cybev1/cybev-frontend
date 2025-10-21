import Link from 'next/link';
import { FileText, Sparkles, Search, Inbox } from 'lucide-react';

export default function EmptyState({ type = 'blogs', actionUrl, actionText }) {
  const configs = {
    blogs: {
      icon: FileText,
      title: 'No blogs found',
      description: 'Be the first to write about this topic!',
      actionText: 'Create Your First Blog',
      actionUrl: '/blog/create'
    },
    search: {
      icon: Search,
      title: 'No results found',
      description: 'Try adjusting your search or filters to find what you\'re looking for.',
      actionText: 'Clear Filters',
      actionUrl: null
    },
    myBlogs: {
      icon: Sparkles,
      title: 'You haven\'t written any blogs yet',
      description: 'Start sharing your thoughts and earn tokens!',
      actionText: 'Write Your First Blog',
      actionUrl: '/blog/create'
    },
    transactions: {
      icon: Inbox,
      title: 'No transactions yet',
      description: 'Start creating content to earn tokens and see your transactions here.',
      actionText: 'Create a Blog',
      actionUrl: '/blog/create'
    }
  };

  const config = configs[type] || configs.blogs;
  const Icon = config.icon;
  const finalActionText = actionText || config.actionText;
  const finalActionUrl = actionUrl || config.actionUrl;

  return (
    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-purple-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {config.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {config.description}
      </p>

      {finalActionUrl && (
        <Link href={finalActionUrl}>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all font-semibold shadow-md">
            {finalActionText}
          </button>
        </Link>
      )}
    </div>
  );
}
