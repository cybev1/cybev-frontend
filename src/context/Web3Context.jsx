// ============================================
// FILE: src/context/Web3Context.jsx
// REAL Blockchain Integration - No Mocks!
// ============================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

const Web3Context = createContext(null);

// Contract ABIs (simplified - deploy and get full ABIs from artifacts)
const CYBEV_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const CYBEV_NFT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalMinted() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function isBlogMinted(bytes32 blogId) view returns (bool)",
  "function getTokenIdForBlog(bytes32 blogId) view returns (uint256)",
  "function blogToToken(bytes32) view returns (uint256)",
  "function mintBlogWithPayment(bytes32 blogId, string uri) payable returns (uint256)",
  "event BlogMinted(uint256 indexed tokenId, address indexed author, bytes32 indexed blogId, string tokenURI)"
];

const CYBEV_STAKING_ABI = [
  "function totalStaked() view returns (uint256)",
  "function rewardPool() view returns (uint256)",
  "function tierConfigs(uint8) view returns (uint256 minStake, uint256 lockDays, uint256 apyBasisPoints)",
  "function stakes(address, uint256) view returns (uint256 amount, uint256 startTime, uint256 endTime, uint8 tier, uint256 rewardsClaimed, bool active)",
  "function stakeCount(address) view returns (uint256)",
  "function calculateRewards(address user, uint256 stakeId) view returns (uint256)",
  "function getUserStakes(address user) view returns (uint256[] stakeIds, uint256[] amounts, uint256[] endTimes, uint8[] tiers, uint256[] pendingRewards)",
  "function stake(uint256 amount, uint8 tier)",
  "function unstake(uint256 stakeId)",
  "function claimRewards(uint256 stakeId)",
  "event Staked(address indexed user, uint256 indexed stakeId, uint256 amount, uint8 tier, uint256 endTime)",
  "event Unstaked(address indexed user, uint256 indexed stakeId, uint256 amount, uint256 rewards, uint256 penalty)",
  "event RewardsClaimed(address indexed user, uint256 indexed stakeId, uint256 amount)"
];

// Contract addresses - UPDATE AFTER DEPLOYMENT
const CONTRACTS = {
  TOKEN: process.env.NEXT_PUBLIC_CYBEV_TOKEN_ADDRESS || '',
  NFT: process.env.NEXT_PUBLIC_CYBEV_NFT_ADDRESS || '',
  STAKING: process.env.NEXT_PUBLIC_CYBEV_STAKING_ADDRESS || ''
};

// Supported chains
const SUPPORTED_CHAINS = {
  137: { 
    name: 'Polygon', 
    symbol: 'MATIC', 
    explorer: 'https://polygonscan.com',
    rpcUrl: 'https://polygon-rpc.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
  },
  80001: { 
    name: 'Mumbai Testnet', 
    symbol: 'MATIC', 
    explorer: 'https://mumbai.polygonscan.com',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
  },
  8453: {
    name: 'Base',
    symbol: 'ETH',
    explorer: 'https://basescan.org',
    rpcUrl: 'https://mainnet.base.org',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 }
  },
  84532: {
    name: 'Base Sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.basescan.org',
    rpcUrl: 'https://sepolia.base.org',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 }
  }
};

// Target chain for CYBEV (change as needed)
const TARGET_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '137');

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  
  // Contract instances
  const [tokenContract, setTokenContract] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);

  // Check MetaMask
  useEffect(() => {
    setIsMetaMaskInstalled(typeof window !== 'undefined' && !!window.ethereum);
  }, []);

  // Auto-reconnect
  useEffect(() => {
    const savedWallet = localStorage.getItem('cybev_wallet_address');
    if (savedWallet && window.ethereum) {
      reconnectWallet();
    }
  }, []);

  // Event listeners
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWallet(accounts[0]);
          localStorage.setItem('cybev_wallet_address', accounts[0]);
          initializeContracts(accounts[0]);
        }
      };

      const handleChainChanged = (newChainId) => {
        const chainIdDecimal = parseInt(newChainId, 16);
        setChainId(chainIdDecimal);
        if (chainIdDecimal !== TARGET_CHAIN_ID) {
          toast.warning(`Please switch to ${SUPPORTED_CHAINS[TARGET_CHAIN_ID]?.name || 'the correct network'}`);
        } else {
          // Reinitialize contracts on correct chain
          if (wallet) initializeContracts(wallet);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [wallet]);

  // Initialize contract instances
  const initializeContracts = async (address) => {
    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      
      setProvider(web3Provider);
      setSigner(web3Signer);

      // Only initialize if contracts are deployed
      if (CONTRACTS.TOKEN) {
        const token = new ethers.Contract(CONTRACTS.TOKEN, CYBEV_TOKEN_ABI, web3Signer);
        setTokenContract(token);
        
        // Get token balance
        const bal = await token.balanceOf(address);
        setTokenBalance(ethers.formatEther(bal));
      }

      if (CONTRACTS.NFT) {
        const nft = new ethers.Contract(CONTRACTS.NFT, CYBEV_NFT_ABI, web3Signer);
        setNftContract(nft);
      }

      if (CONTRACTS.STAKING) {
        const staking = new ethers.Contract(CONTRACTS.STAKING, CYBEV_STAKING_ABI, web3Signer);
        setStakingContract(staking);
      }

      // Get native balance
      const nativeBalance = await web3Provider.getBalance(address);
      setBalance(ethers.formatEther(nativeBalance));
      
    } catch (error) {
      console.error('Contract initialization error:', error);
    }
  };

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask');
      window.open('https://metamask.io/download/', '_blank');
      return null;
    }

    setIsConnecting(true);
    try {
      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWallet(address);
        localStorage.setItem('cybev_wallet_address', address);

        // Get chain ID
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const currentChainId = parseInt(chainIdHex, 16);
        setChainId(currentChainId);

        // Switch to target chain if needed
        if (currentChainId !== TARGET_CHAIN_ID) {
          await switchNetwork(TARGET_CHAIN_ID);
        }

        // Initialize contracts
        await initializeContracts(address);

        toast.success('Wallet connected!');
        return address;
      }
    } catch (error) {
      console.error('Connect error:', error);
      if (error.code === 4001) {
        toast.error('Connection rejected');
      } else {
        toast.error('Failed to connect wallet');
      }
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Reconnect silently
  const reconnectWallet = async () => {
    if (!window.ethereum) return;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setWallet(accounts[0]);
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(parseInt(chainIdHex, 16));
        await initializeContracts(accounts[0]);
      }
    } catch (error) {
      console.error('Reconnect error:', error);
    }
  };

  // Disconnect
  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setBalance('0');
    setTokenBalance('0');
    setTokenContract(null);
    setNftContract(null);
    setStakingContract(null);
    localStorage.removeItem('cybev_wallet_address');
    toast.info('Wallet disconnected');
  }, []);

  // Switch network
  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) return false;

    const chainConfig = SUPPORTED_CHAINS[targetChainId];
    if (!chainConfig) {
      toast.error('Unsupported network');
      return false;
    }

    const chainIdHex = `0x${targetChainId.toString(16)}`;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }]
      });
      return true;
    } catch (error) {
      // Chain not added - try to add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: chainConfig.name,
              nativeCurrency: chainConfig.nativeCurrency,
              rpcUrls: [chainConfig.rpcUrl],
              blockExplorerUrls: [chainConfig.explorer]
            }]
          });
          return true;
        } catch (addError) {
          toast.error('Failed to add network');
          return false;
        }
      }
      return false;
    }
  };

  // ==========================================
  // TOKEN FUNCTIONS
  // ==========================================
  
  const getTokenBalance = async (address = wallet) => {
    if (!tokenContract || !address) return '0';
    try {
      const bal = await tokenContract.balanceOf(address);
      return ethers.formatEther(bal);
    } catch (error) {
      console.error('Get balance error:', error);
      return '0';
    }
  };

  const transferTokens = async (to, amount) => {
    if (!tokenContract) throw new Error('Token contract not initialized');
    const tx = await tokenContract.transfer(to, ethers.parseEther(amount.toString()));
    const receipt = await tx.wait();
    return receipt;
  };

  const approveTokens = async (spender, amount) => {
    if (!tokenContract) throw new Error('Token contract not initialized');
    const tx = await tokenContract.approve(spender, ethers.parseEther(amount.toString()));
    const receipt = await tx.wait();
    return receipt;
  };

  // ==========================================
  // NFT FUNCTIONS
  // ==========================================

  const mintBlogNFT = async (blogId, metadataUri) => {
    if (!nftContract) throw new Error('NFT contract not initialized');
    
    // Convert MongoDB ObjectId to bytes32
    const blogIdBytes = ethers.zeroPadValue(ethers.toBeHex(blogId), 32);
    
    // Check if already minted
    const isMinted = await nftContract.isBlogMinted(blogIdBytes);
    if (isMinted) {
      throw new Error('Blog already minted as NFT');
    }

    // Mint (this version uses mintBlogWithPayment for user-initiated mints)
    const tx = await nftContract.mintBlogWithPayment(blogIdBytes, metadataUri);
    const receipt = await tx.wait();
    
    // Get token ID from event
    const event = receipt.logs.find(log => {
      try {
        const parsed = nftContract.interface.parseLog(log);
        return parsed?.name === 'BlogMinted';
      } catch { return false; }
    });

    if (event) {
      const parsed = nftContract.interface.parseLog(event);
      return {
        tokenId: parsed.args.tokenId.toString(),
        txHash: receipt.hash
      };
    }

    return { txHash: receipt.hash };
  };

  const isBlogMinted = async (blogId) => {
    if (!nftContract) return false;
    try {
      const blogIdBytes = ethers.zeroPadValue(ethers.toBeHex(blogId), 32);
      return await nftContract.isBlogMinted(blogIdBytes);
    } catch {
      return false;
    }
  };

  const getTokenIdForBlog = async (blogId) => {
    if (!nftContract) return null;
    try {
      const blogIdBytes = ethers.zeroPadValue(ethers.toBeHex(blogId), 32);
      const tokenId = await nftContract.getTokenIdForBlog(blogIdBytes);
      return tokenId.toString();
    } catch {
      return null;
    }
  };

  const getNFTMetadata = async (tokenId) => {
    if (!nftContract) return null;
    try {
      const uri = await nftContract.tokenURI(tokenId);
      const response = await fetch(uri);
      return await response.json();
    } catch {
      return null;
    }
  };

  // ==========================================
  // STAKING FUNCTIONS
  // ==========================================

  const stakeTokens = async (amount, tier) => {
    if (!stakingContract || !tokenContract) {
      throw new Error('Contracts not initialized');
    }

    const amountWei = ethers.parseEther(amount.toString());
    
    // Approve staking contract
    const allowance = await tokenContract.allowance(wallet, CONTRACTS.STAKING);
    if (allowance < amountWei) {
      const approveTx = await tokenContract.approve(CONTRACTS.STAKING, amountWei);
      await approveTx.wait();
    }

    // Stake
    const tx = await stakingContract.stake(amountWei, tier);
    const receipt = await tx.wait();
    
    // Get stake ID from event
    const event = receipt.logs.find(log => {
      try {
        const parsed = stakingContract.interface.parseLog(log);
        return parsed?.name === 'Staked';
      } catch { return false; }
    });

    if (event) {
      const parsed = stakingContract.interface.parseLog(event);
      return {
        stakeId: parsed.args.stakeId.toString(),
        endTime: new Date(Number(parsed.args.endTime) * 1000),
        txHash: receipt.hash
      };
    }

    return { txHash: receipt.hash };
  };

  const unstakeTokens = async (stakeId) => {
    if (!stakingContract) throw new Error('Staking contract not initialized');
    const tx = await stakingContract.unstake(stakeId);
    const receipt = await tx.wait();
    return receipt;
  };

  const claimStakingRewards = async (stakeId) => {
    if (!stakingContract) throw new Error('Staking contract not initialized');
    const tx = await stakingContract.claimRewards(stakeId);
    const receipt = await tx.wait();
    return receipt;
  };

  const getUserStakes = async (address = wallet) => {
    if (!stakingContract || !address) return [];
    try {
      const result = await stakingContract.getUserStakes(address);
      const stakes = [];
      
      for (let i = 0; i < result.stakeIds.length; i++) {
        stakes.push({
          stakeId: result.stakeIds[i].toString(),
          amount: ethers.formatEther(result.amounts[i]),
          endTime: new Date(Number(result.endTimes[i]) * 1000),
          tier: ['Bronze', 'Silver', 'Gold', 'Diamond'][result.tiers[i]],
          pendingRewards: ethers.formatEther(result.pendingRewards[i])
        });
      }
      
      return stakes;
    } catch (error) {
      console.error('Get stakes error:', error);
      return [];
    }
  };

  const getStakingStats = async () => {
    if (!stakingContract) return null;
    try {
      const [totalStaked, rewardPool] = await Promise.all([
        stakingContract.totalStaked(),
        stakingContract.rewardPool()
      ]);
      
      return {
        totalStaked: ethers.formatEther(totalStaked),
        rewardPool: ethers.formatEther(rewardPool)
      };
    } catch {
      return null;
    }
  };

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  const getCurrentChain = () => {
    return SUPPORTED_CHAINS[chainId] || { name: 'Unknown', symbol: '?' };
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const refreshBalances = async () => {
    if (!wallet || !provider) return;
    
    try {
      const nativeBalance = await provider.getBalance(wallet);
      setBalance(ethers.formatEther(nativeBalance));
      
      if (tokenContract) {
        const tokenBal = await tokenContract.balanceOf(wallet);
        setTokenBalance(ethers.formatEther(tokenBal));
      }
    } catch (error) {
      console.error('Refresh balances error:', error);
    }
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
    isCorrectChain: chainId === TARGET_CHAIN_ID,
    
    // Wallet functions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalances,
    
    // Token functions
    getTokenBalance,
    transferTokens,
    approveTokens,
    
    // NFT functions
    mintBlogNFT,
    isBlogMinted,
    getTokenIdForBlog,
    getNFTMetadata,
    
    // Staking functions
    stakeTokens,
    unstakeTokens,
    claimStakingRewards,
    getUserStakes,
    getStakingStats,
    
    // Utilities
    getCurrentChain,
    formatAddress,
    SUPPORTED_CHAINS,
    CONTRACTS,
    TARGET_CHAIN_ID
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
