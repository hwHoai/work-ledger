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

export const POST = async (request: Request) => {
  const reqBody = await request.json();
  try {
    const newEmployee = await employeeService.checkIn(reqBody);
    return new Response(JSON.stringify(newEmployee), { status: 201 });
  } catch (error: { code?: any; message?: string } | any) {
    return new Response(error.message || 'Failed to create employee', {
      status: error.code <= 500 ? error.code : 500,
    });
  }
};
