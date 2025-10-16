import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';

export default function DashboardPage() {
  return (
    <div className="w-full h-full px-6 py-12">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-200">Manage employee records on the blockchain</p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Add Employee Form */}
          <EmployeeForm />

          {/* Employee List */}
          <EmployeeList />
        </div>
      </div>
    </div>
  );
}
