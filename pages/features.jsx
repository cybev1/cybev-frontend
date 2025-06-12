
import Head from 'next/head';

export default function Features() {
  return (
    <>
      <Head><title>Features – CYBEV</title></Head>
      <div className="min-h-screen p-10 bg-white dark:bg-black text-gray-800 dark:text-gray-100">
        <h1 className="text-4xl font-bold mb-4 text-center">Platform Features</h1>
        <ul className="max-w-3xl mx-auto space-y-4 text-lg">
          <li>✅ AI Blog & Content Generation</li>
          <li>✅ NFT Minting + Marketplace</li>
          <li>✅ Real-time Social Timeline</li>
          <li>✅ Ads Manager + Token Earnings</li>
          <li>✅ Domain + Hosting Integration</li>
          <li>✅ Web3 Wallet + Referral Rewards</li>
        </ul>
      </div>
    </>
  );
}
