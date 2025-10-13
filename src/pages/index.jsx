import React from 'react';
import { useRouter } from 'next/router';
import TopNavbar from '../components/TopNavbar';

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <TopNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Your Voice, Amplified
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Create stunning blogs and social media content with AI-powered tools. 
            From voice to published post in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/choice')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Get Started Free
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg border-2 border-purple-200 hover:border-purple-400 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Everything You Need to Create
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎙️"
              title="Voice to Text"
              description="Speak naturally and watch your words transform into polished content instantly."
            />
            <FeatureCard
              icon="✨"
              title="AI Enhancement"
              description="Intelligent suggestions to improve tone, style, and engagement automatically."
            />
            <FeatureCard
              icon="📱"
              title="Multi-Platform"
              description="Optimize content for blogs, Twitter, LinkedIn, and Instagram in one click."
            />
            <FeatureCard
              icon="🎨"
              title="Beautiful Templates"
              description="Professional designs that make your content stand out from the crowd."
            />
            <FeatureCard
              icon="⚡"
              title="Instant Publishing"
              description="Schedule or publish directly to your platforms without switching apps."
            />
            <FeatureCard
              icon="📊"
              title="Analytics"
              description="Track performance and understand what resonates with your audience."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Create in 3 Simple Steps
          </h2>
          
          <div className="space-y-12">
            <StepCard
              number="1"
              title="Choose Your Format"
              description="Select blog post, social media, or both. Tell us your topic."
            />
            <StepCard
              number="2"
              title="Speak or Type"
              description="Use voice input or keyboard. AI structures your thoughts perfectly."
            />
            <StepCard
              number="3"
              title="Publish"
              description="Review, edit if needed, and publish to all your platforms instantly."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Content?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who've amplified their voice
          </p>
          <button
            onClick={() => router.push('/auth/choice')}
            className="px-10 py-5 bg-white text-purple-600 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Start Creating Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400 text-center">
        <p>&copy; 2025 CYBEV. Built for creators who speak their mind.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="flex items-start gap-6">
    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
      {number}
    </div>
    <div>
      <h3 className="text-2xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-lg">{description}</p>
    </div>
  </div>
);

export default LandingPage;
