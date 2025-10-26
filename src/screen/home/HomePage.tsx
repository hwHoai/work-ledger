
import CheckInForm from './components/CheckInForm';
import CompanyIntro from './components/CompanyIntro';
import WalletConnectModal from '~/components/client/wallet_connect_model/WalletConnectModal';

export default function HomePage() {
  return (
    <div className="w-full h-full px-6 py-12">
      <div className="max-w-screen-xl mx-auto flex flex-col gap-8">
        {/* Check-in Form Section */}
        <CheckInForm />

        {/* Company Introduction Section */}
        <CompanyIntro />
      </div>

      <WalletConnectModal />
    </div>
  );
}
