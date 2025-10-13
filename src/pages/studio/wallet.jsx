import DashboardLayout from '../../components/DashboardLayout';
import WalletSummary from '../../components/WalletSummary';

export default function WalletPage() {
  const wallet = {
    balance: 248.76,
    earned: 582.30,
    staked: 120.00,
    lastUpdated: 'Today, 5:40 PM',
  };

  return (
    <DashboardLayout title="Wallet & Earnings">
      <WalletSummary data={wallet} />
    </DashboardLayout>
  );
}
