import { employeeService } from '~/services/employee.service';

export const GET = async () => {
  try {
    const employees = await employeeService.getAllEmployees();
    return new Response(JSON.stringify(employees), { status: 200 });
  } catch (error: { code?: any; message?: string } | any) {
    return new Response(error.message || 'Failed to create employee', {
      status: error.code || 500,
    });
  }
};
