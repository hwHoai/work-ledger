'use client';

import { useState } from 'react';

export default function EmployeeList() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample employee data - you'll replace this with real data later
  const employees = [
    {
      wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      name: 'John Doe',
      startWorkDate: '2023-01-15',
      isActive: true,
      endWorkDate: null,
    },
    {
      wallet: '0x8ba1f109551bd432803012645ac136ddd64dba72',
      name: 'Jane Smith',
      startWorkDate: '2023-03-20',
      isActive: true,
      endWorkDate: null,
    },
    {
      wallet: '0x5aeda56215b167893e80b4fe645ba6d5bab767de',
      name: 'Mike Johnson',
      startWorkDate: '2022-11-10',
      isActive: false,
      endWorkDate: '2024-12-31',
    },
    {
      wallet: '0x2546bcd3c84621e976d8185a91a922ae77ecec30',
      name: 'Sarah Williams',
      startWorkDate: '2024-02-01',
      isActive: true,
      endWorkDate: null,
    },
  ];

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase();
    return (
      employee.name.toLowerCase().includes(query) ||
      employee.wallet.toLowerCase().includes(query) ||
      employee.startWorkDate.includes(query) ||
      (employee.isActive ? 'active' : 'inactive').includes(query)
    );
  });

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Employee Management</h2>
        <div className="text-sm text-gray-600">
          Total: <span className="font-bold text-blue-600">{filteredEmployees.length}</span>{' '}
          employees
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex justify-end mx-16">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search by name, wallet address, date, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            {filteredEmployees.map((employee, index) => (
              <tr
                key={employee.wallet}
                className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                  index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                }`}
              >
                <td className="py-4 px-4">
                  <span className="font-mono text-xs text-gray-700">
                    {employee.wallet.slice(0, 6)}...{employee.wallet.slice(-4)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="font-medium text-gray-900">{employee.name}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-700">{employee.startWorkDate}</span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      employee.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-600">{employee.endWorkDate || '-'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State - No Results */}
        {filteredEmployees.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No employees found</h3>
            <p className="text-gray-500">Try adjusting your search query</p>
          </div>
        )}

        {/* Empty State - No Employees */}
        {employees.length === 0 && (
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
