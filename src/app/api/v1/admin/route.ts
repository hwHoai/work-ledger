import { employeeService } from '~/services/employee.service';
import { ROLE } from '~/types/employee.type';

export interface POSTAdminRequestBodyDTO extends Request {
    secretKey: string;
    adminAddress: string;
    adminName: string;
}

export const POST = async (request: POSTAdminRequestBodyDTO) => {
  const reqBody = await request.json();
  try {
    const newEmployee = await employeeService.addAdmin(reqBody);
    return new Response(JSON.stringify(newEmployee), { status: 201 });
  } catch (error: { code?: any; message?: string } | any) {
    return new Response(error.message || 'Failed to create admin', {
      status: error.code || 500,
    });
  }
};
