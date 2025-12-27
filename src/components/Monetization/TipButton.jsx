// ============================================
// FILE: src/components/Monetization/TipButton.jsx
// Tip Creator Button Component
// ============================================
import { useState } from 'react';
import { 
  Heart, Coins, Send, Loader2, Gift, 
  MessageCircle, Eye, EyeOff, CheckCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const TIP_AMOUNTS = [5, 10, 25, 50, 100];

export default function TipButton({ 
  creatorId, 
  creatorName, 
  blogId = null,
  size = 'default', // 'small', 'default', 'large'
  variant = 'default' // 'default', 'outline', 'minimal'
}) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTip = async () => {
    const tipAmount = customAmount ? parseInt(customAmount) : amount;
    
    if (!tipAmount || tipAmount < 1) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tips/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: creatorId,
          blogId,
          amount: tipAmount,
          message,
          anonymous
        })
      });

      const data = await response.json();

      if (data.ok) {
        setSuccess(true);
        toast.success(`💰 Sent ${tipAmount} CYBEV to ${creatorName}!`);
        setTimeout(() => {
          setShowModal(false);
          setSuccess(false);
          setMessage('');
          setCustomAmount('');
        }, 2000);
      } else {
        toast.error(data.error || 'Failed to send tip');
      }
    } catch (error) {
      toast.error('Failed to send tip');
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    default: 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white',
    outline: 'bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500/10',
    minimal: 'bg-gray-800/50 hover:bg-gray-700/50 text-pink-400'
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 rounded-lg font-medium transition-all ${sizeClasses[size]} ${variantClasses[variant]}`}
      >
        <Gift className={size === 'small' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        {size !== 'small' && 'Tip'}
      </button>

      {/* Tip Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-purple-500/30">
            {success ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Tip Sent!</h3>
                <p className="text-gray-400">Your support means a lot to {creatorName}!</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Support {creatorName}</h3>
                  <p className="text-gray-400">Send CYBEV tokens to show your appreciation</p>
                </div>

                {/* Preset Amounts */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {TIP_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => { setAmount(preset); setCustomAmount(''); }}
                      className={`p-3 rounded-lg text-center transition-all ${
                        amount === preset && !customAmount
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-2">Custom Amount</label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-10 pr-16 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">CYBEV</span>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    Add a message (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Say something nice..."
                    maxLength={200}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    rows={2}
                  />
                  <p className="text-gray-500 text-xs mt-1">{message.length}/200</p>
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg mb-6">
                  <div className="flex items-center gap-2">
                    {anonymous ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-gray-300 text-sm">Send anonymously</span>
                  </div>
                  <button
                    onClick={() => setAnonymous(!anonymous)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      anonymous ? 'bg-pink-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      anonymous ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500/20 to-orange-500/20 border border-pink-500/30 rounded-lg mb-6">
                  <span className="text-gray-300">Total</span>
                  <span className="text-2xl font-bold text-white">
                    {customAmount || amount} CYBEV
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTip}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-lg transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Tip
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}