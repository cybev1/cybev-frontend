import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import axios from 'axios';
import { 
  Sparkles, 
  Target, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Star,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

const OnboardingFlow = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    goals: [],
    experience: ''
  });
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 4;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

  // Celebrate completion with confetti
  const celebrateCompletion = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleComplete = async () => {
    setIsComplete(true);
    celebrateCompletion();
    
    console.log('🎉 Onboarding completed! Saving data...');
    console.log('📋 Form data:', formData);

    // Mark as completed locally (backup)
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Save to backend
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('❌ No token found!');
        // Still redirect if no token (shouldn't happen)
        setTimeout(() => {
          router.push('/studio');
        }, 3500);
        return;
      }

      console.log('💾 Sending onboarding data to backend...');
      
      const response = await axios.put(
        `${API_URL}/api/auth/complete-onboarding`,
        {
          fullName: formData.fullName,
          role: formData.role,
          goals: formData.goals,
          experience: formData.experience
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Onboarding data saved successfully:', response.data);
      
    } catch (error) {
      console.error('❌ Failed to save onboarding data:', error.response?.data || error.message);
      // Don't block user even if save fails - they can update profile later
    } finally {
      setIsSaving(false);
    }
    
    // Redirect after celebration (even if save failed)
    setTimeout(() => {
      console.log('→ Redirecting to studio...');
      router.push('/studio');
    }, 3500);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  // Steps configuration
  const steps = [
    {
      title: "Welcome aboard! ✨",
      subtitle: "Let's personalize your experience",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Tell us about yourself",
      subtitle: "Help us understand your role",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "What are your goals?",
      subtitle: "Select all that apply",
      icon: Target,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Your experience level",
      subtitle: "This helps us customize your journey",
      icon: Award,
      color: "from-orange-500 to-red-500"
    }
  ];

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((_, index) => (
        <motion.div
          key={index}
          className="relative"
          initial={false}
          animate={{
            scale: currentStep === index ? 1.2 : 1,
          }}
        >
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              index <= currentStep
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-12'
                : 'bg-gray-700 w-8'
            }`}
          />
          {index === currentStep && (
            <motion.div
              className="absolute inset-0 rounded-full bg-white"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );

  const StepContent = () => {
    const CurrentIcon = steps[currentStep].icon;
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="text-center mb-8"
        >
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1
            }}
            className="mb-6 inline-block"
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${steps[currentStep].color} p-4 shadow-2xl`}>
              <CurrentIcon className="w-full h-full text-white" strokeWidth={2} />
            </div>
          </motion.div>

          {/* Title with gradient */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-4xl font-bold mb-3 bg-gradient-to-r ${steps[currentStep].color} bg-clip-text text-transparent`}
          >
            {steps[currentStep].title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg"
          >
            {steps[currentStep].subtitle}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderStepForm = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 text-gray-300">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-lg">Get ready for something amazing</span>
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-gray-400 max-w-md mx-auto">
                We're excited to have you here! This quick setup will help us create a personalized experience just for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[
                { icon: Zap, text: "Fast Setup", color: "purple" },
                { icon: TrendingUp, text: "Personalized", color: "blue" },
                { icon: CheckCircle2, text: "Ready in 2min", color: "green" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`p-4 rounded-xl bg-gradient-to-br from-${item.color}-500/10 to-${item.color}-500/5 border border-${item.color}-500/20`}
                >
                  <item.icon className={`w-8 h-8 text-${item.color}-500 mb-2 mx-auto`} />
                  <p className="text-sm text-gray-300 text-center">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Full Name *
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border-2 border-gray-700 focus:border-purple-500 text-white placeholder-gray-500 transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Developer', 'Designer', 'Product Manager', 'Marketer', 'Founder', 'Other'].map((role) => (
                  <motion.button
                    key={role}
                    type="button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleInputChange('role', role)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      formData.role === role
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-gray-800/50 text-gray-300 border-2 border-gray-700 hover:border-purple-500/50'
                    }`}
                  >
                    {role}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        const goals = [
          { id: 'grow', label: 'Grow my business', icon: TrendingUp },
          { id: 'automate', label: 'Automate workflows', icon: Zap },
          { id: 'collaborate', label: 'Collaborate better', icon: Users },
          { id: 'learn', label: 'Learn new skills', icon: Award },
          { id: 'build', label: 'Build products', icon: Sparkles },
          { id: 'scale', label: 'Scale operations', icon: Target }
        ];

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <p className="text-center text-gray-400 mb-6">Select as many as you'd like</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goals.map((goal) => {
                const GoalIcon = goal.icon;
                const isSelected = formData.goals.includes(goal.id);
                
                return (
                  <motion.button
                    key={goal.id}
                    type="button"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-xl transition-all duration-300 text-left flex items-center gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                        : 'bg-gray-800/50 text-gray-300 border-2 border-gray-700 hover:border-green-500/50'
                    }`}
                  >
                    <GoalIcon className="w-6 h-6" />
                    <span className="font-medium">{goal.label}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );

      case 3:
        const experiences = [
          { id: 'beginner', label: 'Just Starting Out', desc: 'New to this' },
          { id: 'intermediate', label: 'Some Experience', desc: '1-3 years' },
          { id: 'advanced', label: 'Very Experienced', desc: '3+ years' },
          { id: 'expert', label: 'Expert Level', desc: '5+ years' }
        ];

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {experiences.map((exp, index) => (
              <motion.button
                key={exp.id}
                type="button"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.03, x: 10 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleInputChange('experience', exp.id)}
                className={`w-full p-5 rounded-xl transition-all duration-300 text-left ${
                  formData.experience === exp.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gray-800/50 text-gray-300 border-2 border-gray-700 hover:border-orange-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">{exp.label}</div>
                    <div className={`text-sm ${formData.experience === exp.id ? 'text-white/80' : 'text-gray-500'}`}>
                      {exp.desc}
                    </div>
                  </div>
                  {formData.experience === exp.id && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return formData.fullName && formData.role;
      case 2:
        return formData.goals.length > 0;
      case 3:
        return formData.experience;
      default:
        return false;
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl"
          >
            <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={3} />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-white mb-4"
          >
            You're All Set! 🎉
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-300 mb-2"
          >
            {isSaving ? 'Saving your preferences...' : 'Redirecting to your studio...'}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 3.5 }}
            className="w-64 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mt-8"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
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
          className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl bg-gray-800/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8 md:p-12"
      >
        <StepIndicator />
        <StepContent />
        
        <div className="mt-8">
          {renderStepForm()}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4 mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              currentStep === 0
                ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: canProceed() ? 1.05 : 1 }}
            whileTap={{ scale: canProceed() ? 0.95 : 1 }}
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              canProceed()
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40'
                : 'bg-gray-700/30 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentStep === totalSteps - 1 ? 'Complete' : 'Continue'}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Progress text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 text-sm mt-6"
        >
          Step {currentStep + 1} of {totalSteps}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default OnboardingFlow;
