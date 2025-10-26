import { employeeService } from '~/services/employee.service';

export interface POSTEmployeeRequestBodyDTO extends Request {
    senderAddress: string;
    employeeAddress: string;
    employeeName: string;
}

export const POST = async (request: POSTEmployeeRequestBodyDTO) => {
  const reqBody = await request.json();
  try {
    const newEmployee = await employeeService.addEmployee(reqBody);
    return new Response(JSON.stringify(newEmployee), { status: 201 });
  } catch (error: { code?: any; message?: string } | any) {
    return new Response(error.message || 'Failed to create employee', {
      status: error.code || 500,
    });
  }
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');
  if (!walletAddress) {
    return new Response('Missing walletAddress query parameter', { status: 400 });
  }

  try {
    const employee = await employeeService.getEmployeeByWalletAddress(walletAddress);
    if (!employee) {
      return new Response('Employee not found', { status: 404 });
    }
    return new Response(JSON.stringify(employee), { status: 200 });
  } catch (error: { code?: any; message?: string } | any) {
    return new Response(error.message || 'Failed to retrieve employees', {
      status: error.code || 500,
    });
  }
};
