// ============================================
// FILE: src/components/Web3/WalletButton.jsx
// Wallet Connect/Disconnect Button
// ============================================
import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { 
  Wallet, LogOut, Copy, ExternalLink, ChevronDown,
  Check, Loader2, AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function WalletButton({ compact = false }) {
  const {
    wallet,
    balance,
    tokenBalance,
    chainId,
    isConnecting,
    isConnected,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    getCurrentChain,
    formatAddress,
    SUPPORTED_CHAINS
  } = useWeb3();

  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleCopyAddress = async () => {
    if (wallet) {
      await navigator.clipboard.writeText(wallet);
      setCopied(true);
      toast.success('Address copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const chain = getCurrentChain();
  const isUnsupportedChain = chainId && !SUPPORTED_CHAINS[chainId];

  // Not connected state
  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 ${
          compact ? 'text-sm' : ''
        }`}
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            {!isMetaMaskInstalled ? 'Install MetaMask' : 'Connect Wallet'}
          </>
        )}
      </button>
    );
  }

  // Connected state - compact version
  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white hover:bg-gray-700/50 transition-colors"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm font-mono">{formatAddress(wallet)}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-purple-500/30 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Connected</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${isUnsupportedChain ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {chain.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono">{formatAddress(wallet)}</span>
                  <button onClick={handleCopyAddress} className="p-1 hover:bg-gray-700 rounded">
                    {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">{chain.symbol}</span>
                  <span className="text-white font-medium">{balance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">CYBEV</span>
                  <span className="text-purple-400 font-medium">{tokenBalance}</span>
                </div>
              </div>

              <div className="p-2 border-t border-gray-700">
                <button
                  onClick={() => { disconnectWallet(); setShowDropdown(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Connected state - full version
  return (
    <div className="bg-gray-800/30 border border-purple-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">{formatAddress(wallet)}</p>
            <p className={`text-xs ${isUnsupportedChain ? 'text-red-400' : 'text-gray-400'}`}>
              {isUnsupportedChain && <AlertCircle className="w-3 h-3 inline mr-1" />}
              {chain.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAddress}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy address"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
          <a
            href={`${chain.explorer}/address/${wallet}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="View on explorer"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-900/50 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">{chain.symbol} Balance</p>
          <p className="text-white font-bold text-lg">{balance}</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">CYBEV Balance</p>
          <p className="text-purple-400 font-bold text-lg">{tokenBalance}</p>
        </div>
      </div>

      <button
        onClick={disconnectWallet}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Disconnect Wallet
      </button>
    </div>
  );
}
