import { employeeService } from '~/services/employee.service';

export const GET = async () => {
  try {
    const checkInRecords = await employeeService.getAllCheckInRecords();
    return new Response(JSON.stringify(checkInRecords), { status: 200 });
  } catch (error: { code?: any; message?: string } | any) {
    return new Response(error.message || 'Failed to fetch check-in records', {
      status: error.code || 500,
    });
  }
};

import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const reqBody = await request.json().catch(() => null);
  if (!reqBody) {
    return new Response(JSON.stringify({ message: 'Invalid JSON body' }), { status: 400 });
  }

  try {
    const newEmployee = await employeeService.checkIn(reqBody);
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
