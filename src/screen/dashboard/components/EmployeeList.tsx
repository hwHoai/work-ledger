'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '~/config/axios.config';
import { Employee } from '~/types/employee.type';
import EmployeeListSkeleton from './EmployeeListSkeleton';
import { Copy } from 'lucide-react';

export default function EmployeeList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // track last copied wallet to show feedback
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

  const skeletonRows = 8;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/employee/getAll');
        const employees: Employee[] = response.data.map((emp: any) => ({
          id: emp.id ?? emp._id ?? '',
          walletAddress: emp.walletAddress,
          name: emp.name,
          startWorkDate: emp.startWorkDate,
          isActive: emp.isActive,
          endWorkDate: emp.endWorkDate,
        }));
        setEmployees(employees);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = employees.filter((employee) => {
      return (
        (employee.id ?? '').toLowerCase().includes(lowercasedQuery) ||
        employee.walletAddress?.toLowerCase().includes(lowercasedQuery) ||
        (employee.name ?? '').toLowerCase().includes(lowercasedQuery) ||
        employee.startWorkDate?.toString().toLowerCase().includes(lowercasedQuery) ||
        (employee.isActive ? 'active' : 'inactive').includes(lowercasedQuery)
      );
    });
    setFilteredEmployees(filtered);
      console.warn('Rendering EmployeeList with employees:', employees);
  }, [searchQuery, employees]);

  // copy helper with fallback
  const handleCopy = async (address?: string) => {
    if (!address) {
      return;
    }
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
      } else {
        // fallback: textarea selection
        const ta = document.createElement('textarea');
        ta.value = address;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedWallet(address);
      setTimeout(() => setCopiedWallet(null), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Employee Management</h2>
        <div className="text-sm text-gray-600">
          Total:{' '}
          <span className="font-bold text-blue-600">
            {loading ? '...' : filteredEmployees.length}
          </span>{' '}
          employees
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex justify-end mx-16">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder={
              loading ? 'Loading...' : 'Search by id, name, wallet address, date, or status...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Employee Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                ID
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                Wallet Address
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                Start Work Date
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                End Work Date
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <EmployeeListSkeleton rows={skeletonRows} />
            ) : (
              filteredEmployees.map((employee, index) => (
                <tr
                  key={employee.id || index}
                  className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                  }`}
                >
                  <td className="py-4 px-4">
                    <span className="font-mono text-xs text-gray-700">{employee.id ?? '-'}</span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-700 select-all">
                        {employee.walletAddress?.slice(0, 6)}...{employee.walletAddress?.slice(-4)}
                      </span>

                      <button
                        onClick={() => handleCopy(employee.walletAddress)}
                        title="Copy wallet address"
                        aria-label="Copy wallet address"
                        className="p-1 rounded-md hover:bg-gray-100 hover:cursor-pointer transition-colors"
                      >
                        <Copy size="16px" />
                      </button>

                      {copiedWallet === employee.walletAddress && (
                        <span className="text-xs text-green-600 ml-1">Copied</span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{employee.name ?? '-'}</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">
                      {employee.startWorkDate?.toLocaleString?.() ?? employee.startWorkDate}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        employee.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {employee.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {employee.endWorkDate?.toLocaleString?.() || '-'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Empty State - No Results */}
        {!loading && filteredEmployees.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No employees found</h3>
            <p className="text-gray-500">Try adjusting your search query</p>
          </div>
        )}

        {/* Empty State - No Employees */}
        {!loading && employees.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No employees yet</h3>
            <p className="text-gray-500">Add your first employee using the form</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          All employee records are secured on the blockchain
        </p>
      </div>
    </div>
  );
}
