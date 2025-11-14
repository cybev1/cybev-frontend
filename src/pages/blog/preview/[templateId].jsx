// src/pages/blog/preview/[templateId].jsx
// Template preview route for CYBEV

import { useRouter } from 'next/router';
import CNNNewsTemplate from '@/components/templates/CNNNewsTemplate';
import BloombergTVTemplate from '@/components/templates/BloombergTVTemplate';

export default function TemplatePreview() {
  const router = useRouter();
  const { templateId } = router.query;
  
  // Template component mapping
  const templates = {
    'cnn-news': CNNNewsTemplate,
    'bloomberg-tv': BloombergTVTemplate,
    // Future templates:
    // 'church': ChurchTemplate,
    // 'ministry': MinistryTemplate,
    // 'podcast': PodcastTemplate,
    // etc.
  };
  
  const TemplateComponent = templates[templateId];
  
  // If template not found or preview not available yet
  if (!TemplateComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">👁️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Template Preview
          </h1>
          <p className="text-gray-600 mb-6">
            Preview for this template is coming soon! In the meantime, you can select this template and customize it after creation.
          </p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => router.back()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-xl font-semibold transition-all"
            >
              ← Go Back
            </button>
            <button 
              onClick={() => router.push({
                pathname: '/blog/setup',
                query: { template: templateId }
              })}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Select This Template →
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {/* Floating action bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-all"
              >
                ← Back
              </button>
              <div className="border-l border-gray-300 pl-4">
                <p className="text-sm text-gray-600">Preview Mode</p>
                <p className="font-bold text-gray-900">
                  {templateId === 'cnn-news' && '📰 News Network'}
                  {templateId === 'bloomberg-tv' && '📺 Streaming TV'}
                  {!['cnn-news', 'bloomberg-tv'].includes(templateId) && `Template: ${templateId}`}
                </p>
              </div>
            </div>
            <button 
              onClick={() => router.push({
                pathname: '/blog/setup',
                query: { template: templateId }
              })}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg"
            >
              Use This Template →
            </button>
          </div>
        </div>
      </div>

      {/* Add top padding to prevent content from hiding under fixed bar */}
      <div className="pt-20">
        {/* Render the actual template */}
        <TemplateComponent />
      </div>

      {/* Bottom CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 shadow-2xl">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">Like what you see?</p>
            <p className="text-sm opacity-90">Customize this template and make it yours!</p>
          </div>
          <button 
            onClick={() => router.push({
              pathname: '/blog/setup',
              query: { template: templateId }
            })}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all"
          >
            Get Started →
          </button>
        </div>
      </div>
    </div>
  );
}