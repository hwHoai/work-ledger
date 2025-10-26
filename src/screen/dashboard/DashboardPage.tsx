import WalletConnectModal from '~/components/client/wallet_connect_model/WalletConnectModal';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import { useState } from 'react';

export default function DashboardPage() {
  const [AddEmployeeFn, setAddEmployeeFn] = useState(null);
  return (
    <div className="w-full h-full px-6 py-12">
      <div className="mx-auto">
        <div className="mb-8 w-full flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-200">Manage employee records on the blockchain</p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Add Employee Form */}
          <EmployeeForm />

          {/* Employee List */}
          <EmployeeList />

          {/* Wallet Connect Modal */}
          <WalletConnectModal />
        </div>
      </div>
    </div>
  );
}
