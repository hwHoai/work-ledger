'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '~/config/axios.config';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { RootState } from '~/store/store';
import { openWalletModal } from '~/store/walletModalSlice';
import { Employee, ROLE } from '~/types/employee.type';

export default function EmployeeForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const dispatch = useAppDispatch();
  const connectedWallet = useAppSelector((state: RootState) => state.walletModal.connectedWallet);
  const isWalletModalOpen = useAppSelector((state: RootState) => state.walletModal.isOpen);

  // form fields
  const [role, setRole] = useState<ROLE>(ROLE.EMPLOYEE);
  const [adminSecret, setAdminSecret] = useState<string>('');
  const [empAddress, setEmpAddress] = useState<string>('');
  const [employeeName, setEmployeeName] = useState<string>('');
  const [formData, setFormData] = useState<any>({});

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!empAddress) throw new Error('Employee wallet address is required');
      if (!employeeName) throw new Error('Employee name is required');
      if (role === ROLE.ADMIN && !adminSecret) throw new Error('Admin secret is required');

      setFormData(()=> {
        if( role === ROLE.ADMIN ) {
          return {
              secretKey: adminSecret,
              adminAddress: empAddress,
              adminName: employeeName,
          };
        }
        return {
          senderAddress: connectedWallet,
          employeeAddress: empAddress,
          employeeName: employeeName,
        };
      })

      dispatch(openWalletModal());
    } catch (err: any) {
      console.error('Error adding employee:', err);
      setError(err.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  // when wallet becomes connected and empAddress is set, call contract
  useEffect(() => {
    if (isWalletModalOpen) {
      return;
    }

    if (!connectedWallet || !formData) return;

    const execute = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Form data to submit:', formData);
        const newEmployee = await axiosInstance
          .post<Employee>(`${role}`, formData)
          .then((res) => res.data);
        setSuccess(
          `Employee ${newEmployee.walletAddress} name ${newEmployee.name} added successfully!`,
        );
        setEmpAddress('');
        setEmployeeName('');
        setFormData({});
      } catch (err: any) {
        console.error('Contract write failed:', err);
        setError('Contract write failed: ' + (err?.message ?? String(err)));
      } finally {
        setLoading(false);
      }
    };

    execute();
  }, [isWalletModalOpen]);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>

      <form className="space-y-6" onSubmit={handleAddEmployee}>
        <div className="flex w-full gap-4 flex-row">
          <div className="flex-1">
            <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Wallet Address
            </label>
            <input
              type="text"
              id="walletAddress"
              value={empAddress}
              onChange={(e) => setEmpAddress(e.target.value)}
              name="walletAddress"
              placeholder="0x..."
              disabled={loading}
              className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-2">
              Employee Name
            </label>
            <input
              type="text"
              id="employeeName"
              name="employeeName"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="John Doe"
              disabled={loading}
              className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as ROLE)}
              disabled={loading}
              className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            >
              <option value={ROLE.EMPLOYEE}>Employee</option>
              <option value={ROLE.ADMIN}>Admin</option>
            </select>
          </div>
        </div>

        {/* admin secret only visible when role === ADMIN */}
        {role === ROLE.ADMIN && (
          <div className="flex-1">
            <label htmlFor="adminSecret" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Secret Key
            </label>
            <input
              type="password"
              id="adminSecret"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              name="adminSecret"
              placeholder="Create admin secret key"
              disabled={loading}
              className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              This secret will be required to validate admin creation (UI-only).
            </p>
          </div>
        )}

        <div className="flex gap-4 items-end justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none min-w-[140px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding...
              </span>
            ) : (
              'Add Employee'
            )}
          </button>
          <button
            type="reset"
            disabled={loading}
            onClick={() => {
              setError('');
              setSuccess('');
            }}
            className="px-4 py-3 rounded-lg border-2 h-12 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fadeIn">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-fadeIn">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-800 mb-1">Success</h3>
              <p className="text-sm text-green-700">{success}</p>
            </div>
            <button
              onClick={() => setSuccess('')}
              className="text-green-500 hover:text-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center">
          Employee wallet address will be securely stored on the blockchain
        </p>
      </form>
      {/* Wallet Connect Modal Triggered */}
    </div>
  );
}
