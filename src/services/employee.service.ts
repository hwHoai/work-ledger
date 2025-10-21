import { POSTAdminRequestBodyDTO } from '~/app/api/v1/admin/route';
import { POSTEmployeeRequestBodyDTO } from '~/app/api/v1/employee/route';
import EmployeeModel from '~/model/schema/employee.schema';
import { Employee, ROLE } from '~/types/employee.type';

class EmployeeService {
  async getAllEmployees(): Promise<Employee[]> {
    const employees = await EmployeeModel.find().exec();
    if (!employees) {
      throw new Error({
        code: 500,
        message: 'Failed to fetch employees',
      } as any);
    }
    return employees;
  }

  async addEmployee(reqBody: POSTEmployeeRequestBodyDTO): Promise<Employee> {
    const { senderAddress, employeeAddress, employeeName } = reqBody;

    const isEmployeeExist = await EmployeeModel.findOne({
      walletAddress: employeeAddress,
    }).exec();
    if (isEmployeeExist) {
      throw new Error({
        message: 'Employee with this wallet address already exists',
        code: 400,
      } as any);
    }

    const isAdminRequest = await EmployeeModel.findOne({
      walletAddress: senderAddress,
    }).exec();
    if (!isAdminRequest || isAdminRequest.role !== 'admin') {
      throw new Error({
        message: 'Only admins can add new employees',
        code: 403,
      } as any);
    }

    const employeeData: Employee = {
      id: '',
      name: employeeName,
      role: ROLE.EMPLOYEE,
      walletAddress: employeeAddress,
      startWorkDate: new Date(),
      isActive: true,
      endWorkDate: null,
    };

    const newEmployee = new EmployeeModel(employeeData);
    await newEmployee.save();
    if (!newEmployee) {
      throw new Error({
        message: 'Failed to create employee',
        code: 500,
      } as any);
    }

    return newEmployee;
  }

  async addAdmin(reqBody: POSTAdminRequestBodyDTO): Promise<Employee> {
    const { secretKey, adminAddress, adminName } = reqBody;

    const isSecretKeyMatching =
      secretKey.toLowerCase() === process.env.CREATE_ADMIN_KEY?.toLowerCase();
    if (!isSecretKeyMatching) {
      throw new Error({
        message: 'Invalid secret key for creating admin',
        code: 403,
      } as any);
    }

    const isEmployeeExist = await EmployeeModel.findOne({
      walletAddress: adminAddress,
    }).exec();
    if (isEmployeeExist) {
      const updatedAdmin = await EmployeeModel.findOneAndUpdate(
        { role: ROLE.ADMIN, name: adminName },
        { new: true },
      ).exec();
      if (!updatedAdmin) {
        throw new Error({
          message: 'Failed to update existing employee to admin',
          code: 500,
        } as any);
      }
      return updatedAdmin;
    }

    const years = new Date().getFullYear().toString().slice(-2);
    const count = await EmployeeModel.countDocuments();
    const employeeCount = (count + 1).toString().padStart(4, '0');

    const adminData: Employee = {
      id: `EMP${years}${employeeCount}`,
      name: adminName,
      role: ROLE.ADMIN,
      walletAddress: adminAddress,
      startWorkDate: new Date(),
      isActive: true,
      endWorkDate: null,
    };
    const newAdmin = new EmployeeModel(adminData);
    await newAdmin.save();
    if (!newAdmin) {
      throw new Error({
        message: 'Failed to create admin',
        code: 500,
      } as any);
    }
    return newAdmin;
  }
}

export const employeeService = new EmployeeService();
