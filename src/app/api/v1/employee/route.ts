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
