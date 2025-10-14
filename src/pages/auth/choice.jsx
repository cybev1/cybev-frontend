import { useRouter } from 'next/router';

export default function AuthChoice() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <button 
          onClick={() => router.push('/')}
          className="mb-6 text-gray-600 hover:text-blue-600 transition flex items-center gap-2"
        >
          ← Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-3xl font-bold text-white">C</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Welcome to CYBEV</h1>
          <p className="text-gray-600">Choose how you want to get started</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/auth/signup')}
            className="w-full p-6 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 text-left group active:scale-95"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-2xl shadow-lg">
                📧
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">Sign Up with Email</h3>
                <p className="text-sm text-gray-600">Quick and easy setup</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </button>

          <button
            onClick={() => alert('Web3 wallet connection coming soon!')}
            className="w-full p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-2xl hover:shadow-blue-300 transition-all duration-300 text-left group active:scale-95"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                👛
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Connect Wallet (Web3)</h3>
                <p className="text-sm text-blue-100">MetaMask, WalletConnect & more</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button 
                onClick={() => router.push('/auth/login')} 
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
