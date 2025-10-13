import React from 'react';
import { useRouter } from 'next/router';

const AuthChoice = () => {
  const router = useRouter();

  const handleGoogleAuth = () => {
    // TODO: Implement Google OAuth
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo/Back */}
        <button
          onClick={() => router.push('/')}
          className="mb-8 text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          ← Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to CYBEV
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Choose how you'd like to continue
          </p>

          {/* Google Button */}
          <button
            onClick={handleGoogleAuth}
            className="w-full py-4 px-6 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center justify-center gap-3 mb-4"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Email Button */}
          <button
            onClick={() => router.push('/auth/signup')}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Continue with Email
          </button>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="text-purple-600 font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthChoice;