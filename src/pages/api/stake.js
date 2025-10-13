import { ethers } from 'ethers';

const STAKING_CONTRACT = '0x84E98A08aBb7378d81b2DC1b0F591e0fe5172265';
const RPC_URL = process.env.MUMBAI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const abi = [
  "function stake(uint256 amount) public",
  "function getStaked(address user) public view returns (uint256)"
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { amount } = req.body;

  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(STAKING_CONTRACT, abi, wallet);

    const tx = await contract.stake(ethers.utils.parseUnits(amount.toString(), 18));
    const receipt = await tx.wait();

    return res.status(200).json({
      success: true,
      txHash: receipt.transactionHash,
      message: `Staked ${amount} CYBV successfully!`,
    });
  } catch (err) {
    console.error('Stake error:', err);
    return res.status(500).json({ error: 'Staking failed', details: err.message });
  }
}