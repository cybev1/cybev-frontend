import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// New Pages
import LandingPage from './pages/index';
import AuthChoice from './pages/auth/choice';
import Signup from './pages/auth/signup';
import Login from './pages/auth/login';
import Onboarding from './pages/onboarding';
import BlogBuilder from './pages/blog/builder';

// Existing Studio Pages
import StudioHome from './pages/studio/index';
import VoiceRecording from './pages/studio/voice-record';
import SocialMedia from './pages/studio/social';
import BlogPosts from './pages/studio/blog';
import Analytics from './pages/studio/analytics';
import Settings from './pages/studio/settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/choice" element={<AuthChoice />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        
        {/* Onboarding */}
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Blog Wizard */}
        <Route path="/blog/builder" element={<BlogBuilder />} />
        
        {/* Studio (Protected) */}
        <Route path="/studio" element={<StudioHome />} />
        <Route path="/studio/voice-record" element={<VoiceRecording />} />
        <Route path="/studio/social" element={<SocialMedia />} />
        <Route path="/studio/blog" element={<BlogPosts />} />
        <Route path="/studio/analytics" element={<Analytics />} />
        <Route path="/studio/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;