import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Wallet, 
  ArrowRight, 
  Sparkles,
  Zap,
  Shield,
  Globe,
  Star
} from 'lucide-react';

export default function AuthChoice() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
      />

      <div className="max-w-lg w-full relative z-10">
        {/* Back Button */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => router.push('/')} 
          className="mb-6 text-gray-600 hover:text-purple-600 transition flex items-center gap-2 font-semibold"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Home
        </motion.button>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-purple-100"
        >
          {/* Header */}
          <div className="text-center mb-10">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2
              }}
              className="relative inline-block mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-bold text-gray-900">C</span>
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl"
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black mb-3"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome to CYBEV! 
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-lg"
            >
              Choose how you want to get started
            </motion.p>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 mt-4"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-600">100% AI-Powered Platform</span>
              <Zap className="w-4 h-4 text-orange-500" />
            </motion.div>
          </div>

          {/* Auth Options */}
          <div className="space-y-4">
            {/* Email Signup */}
            <motion.button
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/auth/signup')}
              className="w-full p-6 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-100 transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                >
                  <Mail className="w-7 h-7 text-gray-900" strokeWidth={2.5} />
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800 group-hover:text-purple-600 transition mb-1">
                    Sign Up with Email
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quick and easy • Takes less than 30 seconds
                  </p>
                </div>

                {/* Arrow */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                </motion.div>
              </div>

              {/* Features */}
              <div className="flex items-center gap-3 mt-4 pl-[72px]">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Zap className="w-3 h-3" />
                  <span>Instant</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  <span>Recommended</span>
                </div>
              </div>
            </motion.button>

            {/* Web3 Wallet */}
            <motion.button
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => alert('🚀 Web3 wallet connection coming soon! Connect with MetaMask, WalletConnect, and more!')}
              className="w-full p-6 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-gray-900 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-purple-300 transition-all duration-300 text-left group relative overflow-hidden"
            >
              {/* Animated Background */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"
              />

              <div className="flex items-center gap-4 relative z-10">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30"
                >
                  <Wallet className="w-7 h-7 text-gray-900" strokeWidth={2.5} />
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-xl">
                      Connect Wallet
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold">
                      WEB3
                    </span>
                  </div>
                  <p className="text-sm text-blue-100">
                    MetaMask, WalletConnect & more • True ownership
                  </p>
                </div>

                {/* Arrow */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className="w-6 h-6 text-gray-900" />
                </motion.div>
              </div>

              {/* Features */}
              <div className="flex items-center gap-3 mt-4 pl-[72px] relative z-10">
                <div className="flex items-center gap-1 text-xs text-blue-100">
                  <Globe className="w-3 h-3" />
                  <span>Decentralized</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-100">
                  <Shield className="w-3 h-3" />
                  <span>Your Keys</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-100">
                  <Sparkles className="w-3 h-3" />
                  <span>Future</span>
                </div>
              </div>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-purple-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm font-semibold text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/auth/login')} 
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 text-purple-700 font-bold hover:border-purple-400 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Sign In to Your Account
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 pt-6 border-t-2 border-purple-100"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-xs text-gray-600 font-semibold">Creators</div>
              </div>
              <div>
                <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-xs text-gray-600 font-semibold">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-black bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  1M+
                </div>
                <div className="text-xs text-gray-600 font-semibold">Coins Earned</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-sm text-gray-600 mt-6"
        >
          By continuing, you agree to our{' '}
          <a href="#" className="text-purple-600 font-semibold hover:underline">Terms</a>
          {' '}&{' '}
          <a href="#" className="text-purple-600 font-semibold hover:underline">Privacy Policy</a>
        </motion.p>
      </div>
    </div>
  );
}
