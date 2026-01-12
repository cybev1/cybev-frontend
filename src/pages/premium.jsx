// ============================================
// FILE: src/pages/premium.jsx
// Premium Subscription Page
// ============================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '@/components/Layout/AppLayout';
import { 
  Crown, Check, Sparkles, Zap, Shield, Rocket,
  Star, Gift, Loader2, ArrowRight, X
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function PremiumPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchCurrentSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscriptions/plans');
      const data = await response.json();
      if (data.ok) {
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/subscriptions/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.ok && data.subscriptions.length > 0) {
        const activeSub = data.subscriptions.find(s => s.status === 'active' && s.plan?.type === 'platform');
        if (activeSub) {
          setCurrentPlan(activeSub.plan?.name);
        }
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  const handleSubscribe = async (planId) => {
    setSubscribing(planId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/subscriptions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });

      const data = await response.json();

      if (data.ok) {
        toast.success(`🎉 Welcome to ${data.subscription.plan}!`);
        setCurrentPlan(data.subscription.plan);
        setShowConfirm(null);
      } else {
        toast.error(data.error || 'Subscription failed');
      }
    } catch (error) {
      toast.error('Failed to subscribe');
    } finally {
      setSubscribing(null);
    }
  };

  const getPlanIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'basic': return Star;
      case 'pro': return Zap;
      case 'business': return Rocket;
      default: return Crown;
    }
  };

  const getPlanColor = (name) => {
    switch (name.toLowerCase()) {
      case 'basic': return 'from-gray-500 to-gray-400';
      case 'pro': return 'from-purple-500 to-pink-500';
      case 'business': return 'from-yellow-500 to-orange-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Premium Plans - CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/30">
              <Crown className="w-10 h-10 text-gray-900" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade Your Experience</h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Unlock powerful features to grow your audience and monetize your content
            </p>
          </div>

          {/* Plans */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {plans.map((plan) => {
                const Icon = getPlanIcon(plan.name);
                const isCurrentPlan = currentPlan === plan.name;
                const isPopular = plan.name.toLowerCase() === 'pro';

                return (
                  <div
                    key={plan._id}
                    className={`relative bg-white/50 rounded-2xl p-6 border transition-all ${
                      isPopular 
                        ? 'border-purple-500 shadow-lg shadow-purple-500/20 scale-105' 
                        : 'border-gray-200 hover:border-purple-500/50'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-gray-900 text-sm font-medium">
                        Most Popular
                      </div>
                    )}

                    {isCurrentPlan && (
                      <div className="absolute -top-4 right-4 px-4 py-1 bg-green-500 rounded-full text-gray-900 text-sm font-medium">
                        Current Plan
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${getPlanColor(plan.name)} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8 text-gray-900" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-500 text-sm">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-500">CYBEV/mo</span>
                      </div>
                      {plan.price > 0 && (
                        <p className="text-gray-500 text-sm mt-1">
                          ≈ ${(plan.price * 0.25).toFixed(2)} USD
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {plan.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => setShowConfirm(plan)}
                      disabled={isCurrentPlan || subscribing === plan._id}
                      className={`w-full py-3 rounded-lg font-medium transition-all ${
                        isCurrentPlan
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : isPopular
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      {subscribing === plan._id ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : isCurrentPlan ? (
                        'Current Plan'
                      ) : plan.price === 0 ? (
                        'Get Started'
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* FAQ */}
          <div className="bg-white/30 rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gray-900 font-medium mb-2">Can I cancel anytime?</h4>
                <p className="text-gray-500 text-sm">Yes! You can cancel your subscription at any time. You'll keep access until the end of your billing period.</p>
              </div>
              <div>
                <h4 className="text-gray-900 font-medium mb-2">How do I pay?</h4>
                <p className="text-gray-500 text-sm">Subscriptions are paid using CYBEV tokens from your wallet. Make sure you have enough balance!</p>
              </div>
              <div>
                <h4 className="text-gray-900 font-medium mb-2">Can I upgrade later?</h4>
                <p className="text-gray-500 text-sm">Absolutely! You can upgrade or downgrade your plan at any time from your account settings.</p>
              </div>
              <div>
                <h4 className="text-gray-900 font-medium mb-2">What's the creator revenue share?</h4>
                <p className="text-gray-500 text-sm">Pro and Business plans get boosted revenue share on tips and memberships - up to 95%!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Confirm Subscription</h3>
              <button onClick={() => setShowConfirm(null)} className="text-gray-500 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getPlanColor(showConfirm.name)} rounded-lg flex items-center justify-center`}>
                  {(() => { const Icon = getPlanIcon(showConfirm.name); return <Icon className="w-6 h-6 text-gray-900" />; })()}
                </div>
                <div>
                  <h4 className="text-gray-900 font-medium">{showConfirm.name}</h4>
                  <p className="text-gray-500 text-sm">{showConfirm.price} CYBEV/month</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Monthly charge</span>
                  <span className="text-gray-900">{showConfirm.price} CYBEV</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">First charge</span>
                  <span className="text-gray-900">Today</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-900 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubscribe(showConfirm._id)}
                disabled={subscribing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-gray-900 rounded-lg transition-colors disabled:opacity-50"
              >
                {subscribing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Subscribe
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
