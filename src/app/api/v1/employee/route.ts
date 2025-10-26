import { employeeService } from '~/services/employee.service';
import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const reqBody = await request.json().catch(() => null);
  if (!reqBody) {
    return new Response(JSON.stringify({ message: 'Invalid JSON body' }), { status: 400 });
  }

  try {
    const newEmployee = await employeeService.addEmployee(reqBody);
    return new Response(JSON.stringify(newEmployee), { status: 201 });
  } catch (error: any) {
    const status =
      typeof error?.status === 'number' && error.status >= 100 && error.status <= 599
        ? error.status
        : 500;
    const message = error?.message || 'Failed to create employee';
    return new Response(JSON.stringify({ message }), { status });
  }
};

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');
  if (!walletAddress) {
    return new Response(JSON.stringify({ message: 'Missing walletAddress query parameter' }), {
      status: 400,
    });
  }

  try {
    const employee = await employeeService.getEmployeeByWalletAddress(walletAddress);
    if (!employee) {
      return new Response(JSON.stringify({ message: 'Employee not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(employee), { status: 200 });
  } catch (error: any) {
    const status =
      typeof error?.status === 'number' && error.status >= 100 && error.status <= 599
        ? error.status
        : 500;
    const message = error?.message || 'Failed to retrieve employees';
    return new Response(JSON.stringify({ message }), { status });
  }
};
