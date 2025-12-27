// ============================================
// FILE: src/context/Web3Context.jsx
// Web3 Wallet Connection & Integration
// ============================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const Web3Context = createContext(null);

// Contract addresses (update these with actual deployed addresses)
const CONTRACTS = {
  CYBEV_TOKEN: process.env.NEXT_PUBLIC_CYBEV_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
  STAKING: process.env.NEXT_PUBLIC_STAKING_ADDRESS || '0x0000000000000000000000000000000000000000',
  NFT: process.env.NEXT_PUBLIC_NFT_ADDRESS || '0x0000000000000000000000000000000000000000'
};

// Supported chains
const SUPPORTED_CHAINS = {
  1: { name: 'Ethereum Mainnet', symbol: 'ETH', explorer: 'https://etherscan.io' },
  137: { name: 'Polygon', symbol: 'MATIC', explorer: 'https://polygonscan.com' },
  56: { name: 'BSC', symbol: 'BNB', explorer: 'https://bscscan.com' },
  11155111: { name: 'Sepolia Testnet', symbol: 'ETH', explorer: 'https://sepolia.etherscan.io' },
  80001: { name: 'Mumbai Testnet', symbol: 'MATIC', explorer: 'https://mumbai.polygonscan.com' }
};

export function Web3Provider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window !== 'undefined') {
        setIsMetaMaskInstalled(!!window.ethereum);
      }
    };
    checkMetaMask();
  }, []);

  // Auto-connect if previously connected
  useEffect(() => {
    const savedWallet = localStorage.getItem('cybev_wallet_address');
    if (savedWallet && window.ethereum) {
      reconnectWallet();
    }
  }, []);

  // Listen for account and chain changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setWallet(accounts[0]);
      localStorage.setItem('cybev_wallet_address', accounts[0]);
      fetchBalances(accounts[0]);
    }
  };

  const handleChainChanged = (newChainId) => {
    const chainIdDecimal = parseInt(newChainId, 16);
    setChainId(chainIdDecimal);
    
    if (!SUPPORTED_CHAINS[chainIdDecimal]) {
      toast.warning('Please switch to a supported network');
    }
  };

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to connect your wallet');
      window.open('https://metamask.io/download/', '_blank');
      return null;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWallet(address);
        localStorage.setItem('cybev_wallet_address', address);

        // Get chain ID
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const chainIdDecimal = parseInt(chainIdHex, 16);
        setChainId(chainIdDecimal);

        // Fetch balances
        await fetchBalances(address);

        toast.success('Wallet connected successfully!');
        return address;
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      if (error.code === 4001) {
        toast.error('Connection rejected by user');
      } else {
        toast.error('Failed to connect wallet');
      }
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Reconnect wallet silently
  const reconnectWallet = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      if (accounts.length > 0) {
        setWallet(accounts[0]);
        
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(parseInt(chainIdHex, 16));
        
        await fetchBalances(accounts[0]);
      }
    } catch (error) {
      console.error('Reconnection error:', error);
    }
  };

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setChainId(null);
    setBalance('0');
    setTokenBalance('0');
    localStorage.removeItem('cybev_wallet_address');
    toast.info('Wallet disconnected');
  }, []);

  // Fetch balances
  const fetchBalances = async (address) => {
    if (!window.ethereum || !address) return;

    try {
      // Get ETH/native balance
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      const balanceWei = parseInt(balanceHex, 16);
      const balanceEth = (balanceWei / 1e18).toFixed(4);
      setBalance(balanceEth);

      // TODO: Get CYBEV token balance when contract is deployed
      // For now, fetch from backend
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/rewards/wallet', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (response.ok) {
          const data = await response.json();
          setTokenBalance(data.balance?.toString() || '0');
        }
      } catch (e) {
        console.log('Token balance fetch error:', e);
      }
    } catch (error) {
      console.error('Balance fetch error:', error);
    }
  };

  // Switch network
  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) return false;

    const chainIdHex = `0x${targetChainId.toString(16)}`;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }]
      });
      return true;
    } catch (error) {
      // Chain not added to MetaMask
      if (error.code === 4902) {
        toast.error('Please add this network to MetaMask');
      }
      return false;
    }
  };

  // Sign message
  const signMessage = async (message) => {
    if (!wallet || !window.ethereum) {
      toast.error('Please connect your wallet first');
      return null;
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, wallet]
      });
      return signature;
    } catch (error) {
      console.error('Signing error:', error);
      if (error.code === 4001) {
        toast.error('Signing rejected');
      }
      return null;
    }
  };

  // Send transaction
  const sendTransaction = async (to, value, data = '0x') => {
    if (!wallet || !window.ethereum) {
      toast.error('Please connect your wallet first');
      return null;
    }

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: wallet,
          to,
          value: `0x${(value * 1e18).toString(16)}`,
          data
        }]
      });
      
      toast.success('Transaction submitted!');
      return txHash;
    } catch (error) {
      console.error('Transaction error:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected');
      } else {
        toast.error('Transaction failed');
      }
      return null;
    }
  };

  // Get current chain info
  const getCurrentChain = () => {
    return SUPPORTED_CHAINS[chainId] || { name: 'Unknown Network', symbol: '?' };
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const value = {
    // State
    wallet,
    chainId,
    balance,
    tokenBalance,
    isConnecting,
    isMetaMaskInstalled,
    isConnected: !!wallet,
    
    // Methods
    connectWallet,
    disconnectWallet,
    switchNetwork,
    signMessage,
    sendTransaction,
    fetchBalances,
    
    // Helpers
    getCurrentChain,
    formatAddress,
    SUPPORTED_CHAINS,
    CONTRACTS
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    return {
      wallet: null,
      isConnected: false,
      isMetaMaskInstalled: false,
      connectWallet: () => {},
      disconnectWallet: () => {},
      formatAddress: () => ''
    };
  }
  return context;
}

export default Web3Context;
