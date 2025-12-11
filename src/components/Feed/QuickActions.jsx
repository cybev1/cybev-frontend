import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Video, Sparkles, Image, FileText, Radio, Edit } from 'lucide-react';
import { useRouter } from 'next/router';

export default function QuickActions() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const actions = [
    {
      id: 'ai-blog',
      icon: Sparkles,
      label: 'AI Blog',
      description: 'Generate with AI',
      color: 'from-purple-600 to-pink-600',
      action: () => router.push('/studio/ai-blog')
    },
    {
      id: 'live',
      icon: Radio,
      label: 'Go Live',
      description: 'Start streaming',
      color: 'from-red-600 to-orange-600',
      action: () => alert('🔴 Live streaming coming soon!')
    },
    {
      id: 'post',
      icon: FileText,
      label: 'Create Post',
      description: 'Quick social post',
      color: 'from-blue-600 to-cyan-600',
      action: () => alert('📝 Quick social posts coming soon! Think Facebook/Twitter style posts.')
    },
    {
      id: 'article',
      icon: Edit,
      label: 'Create Article',
      description: 'Write long-form blog',
      color: 'from-green-600 to-emerald-600',
      action: () => router.push('/blog/create')
    },
    {
      id: 'image',
      icon: Image,
      label: 'Upload Image',
      description: 'Share photos',
      color: 'from-pink-600 to-rose-600',
      action: () => alert('🖼️ Image posts coming soon!')
    },
    {
      id: 'video',
      icon: Video,
      label: 'Upload Video',
      description: 'Share videos',
      color: 'from-indigo-600 to-purple-600',
      action: () => alert('🎥 Video posts coming soon!')
    }
  ];

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg">
      <div className="px-4 py-4 md:px-6 lg:px-8">
        {/* Desktop View - white theme */}
        <div className="hidden md:flex items-center gap-3 flex-wrap">
          {actions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.action}
              className={`flex items-center gap-2 px-5 py-3 bg-gradient-to-r ${action.color} rounded-2xl font-bold text-white hover:scale-105 transition-transform shadow-lg hover:shadow-xl`}
            >
              <action.icon className="w-5 h-5" />
              <span>{action.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex items-center justify-between">
          <h2 className="text-xl font-black">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Feed
            </span>
          </h2>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl"
          >
            <Plus className={`w-5 h-5 transition-transform ${showMenu ? 'rotate-45' : ''}`} />
            <span>Create</span>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  action.action();
                  setShowMenu(false);
                }}
                className={`w-full flex items-center justify-between p-4 bg-gradient-to-r ${action.color} rounded-2xl text-white shadow-lg`}
              >
                <div className="flex items-center gap-3">
                  <action.icon className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold text-base">{action.label}</div>
                    <div className="text-sm opacity-90">{action.description}</div>
                  </div>
                </div>
                <span className="text-2xl">→</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
