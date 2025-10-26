import { employeeService } from '~/services/employee.service';
import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const reqBody = await request.json().catch(() => null);
  if (!reqBody) {
    return new Response(JSON.stringify({ message: 'Invalid JSON body' }), { status: 400 });
  }

  try {
    const newEmployee = await employeeService.addAdmin(reqBody);
    return new Response(JSON.stringify(newEmployee), { status: 201 });
  } catch (error: any) {
    const status =
      typeof error?.status === 'number' && error.status >= 100 && error.status <= 599
        ? error.status
        : 500;
    const message = error?.message || 'Failed to create admin';
    return new Response(JSON.stringify({ message }), { status });
  }
};
