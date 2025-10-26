// (Don't import route DTO types here) Use local/any types for incoming request bodies from API routes.
import CheckInRecordsModel from '~/model/schema/checkInRecords.schema';
import EmployeeModel from '~/model/schema/employee.schema';
import { Employee, ROLE } from '~/types/employee.type';

class EmployeeService {
  async checkIn(reqBody: any): Promise<any> {
    const {
      employeeWallet,
      contractAddress,
      blockTimestamp,
      blockHash,
      blockNumber,
      logIndex,
      transactionHash,
      transactionIndex,
      createdAt,
    } = reqBody;

    const employeeInstance = await EmployeeModel.findOne({ walletAddress: employeeWallet }).exec();
    if (!employeeInstance) {
      throw new Error({
        code: 404,
        message: 'Employee not found for the given wallet address',
      } as any);
    }
    const newCheckInRecord = await CheckInRecordsModel.create({
      employee: employeeInstance._id,
      contractAddress,
      blockTimestamp,
      blockHash,
      blockNumber,
      logIndex,
      transactionHash,
      transactionIndex,
      createdAt,
    });
    if (!newCheckInRecord) {
      throw new Error({
        code: 500,
        message: 'Failed to create check-in record',
      } as any);
    }
    await newCheckInRecord.save();
    return { newCheckInRecord, employeeInstance };
  }

  async getEmployeeByWalletAddress(walletAddress: string): Promise<Employee | null> {
    try {
      const employee = await EmployeeModel.findOne({ walletAddress }).exec();
      return employee;
    } catch (error) {
      throw new Error({
        code: 500,
        message: 'Failed to fetch employee by wallet address',
      } as any);
    }
  }

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

  async addEmployee(reqBody: any): Promise<Employee> {
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

    // Generate employee id in the format EMPYYxxxx
    // - YY: last two digits of current year
    // - xxxx: zero-padded sequence number (count of existing employees + 1)
    try {
      const year = new Date().getFullYear();
      const yy = String(year).slice(-2);
      // Count all non-deleted employees (admins included) to derive next sequence
      const existingCount = await EmployeeModel.countDocuments({ isDeleted: { $ne: true } }).exec();
      const seq = existingCount + 1;
      const seqPadded = String(seq).padStart(4, '0');
      employeeData.id = `EMP${yy}${seqPadded}`;
    } catch (err) {
      // If counting fails, fall back to timestamp-based id to avoid blocking creation
      const fallback = Date.now().toString().slice(-8);
      employeeData.id = `EMP${String(new Date().getFullYear()).slice(-2)}${fallback}`;
    }

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

  async addAdmin(reqBody: any): Promise<Employee> {
    const { secretKey, adminAddress, adminName } = reqBody;

    // validate creation key from env
    const expected = process.env.CREATE_ADMIN_KEY;
    if (!expected || expected.length === 0) {
      throw new Error({ message: 'Admin creation key not configured on server', code: 500 } as any);
    }
    if (secretKey !== expected) {
      throw new Error({ message: 'Invalid admin creation key', code: 401 } as any);
    }

    const isAdminExist = await EmployeeModel.findOne({ walletAddress: adminAddress }).exec();
    if (isAdminExist) {
      throw new Error({
        message: 'Admin with this wallet address already exists',
        code: 400,
      } as any);
    }

    const adminData: Employee = {
      id: '',
      name: adminName,
      role: ROLE.ADMIN,
      walletAddress: adminAddress,
      startWorkDate: new Date(),
      isActive: true,
      endWorkDate: null,
    };

    // generate id similar to addEmployee
    try {
      const year = new Date().getFullYear();
      const yy = String(year).slice(-2);
      const existingCount = await EmployeeModel.countDocuments({ isDeleted: { $ne: true } }).exec();
      const seq = existingCount + 1;
      const seqPadded = String(seq).padStart(4, '0');
      adminData.id = `EMP${yy}${seqPadded}`;
    } catch (err) {
      const fallback = Date.now().toString().slice(-8);
      adminData.id = `EMP${String(new Date().getFullYear()).slice(-2)}${fallback}`;
    }

    const newAdmin = new EmployeeModel(adminData);
    await newAdmin.save();
    if (!newAdmin) {
      throw new Error({ message: 'Failed to create admin', code: 500 } as any);
    }

    return newAdmin;
  }

  async getAllCheckInRecords(): Promise<any[]> {
    const checkInRecords = await CheckInRecordsModel.find().populate('employee').exec();
    if (!checkInRecords) {
      throw new Error({
        code: 500,
        message: 'Failed to fetch check-in records',
      } as any);
    }
    return checkInRecords;
  }
}

export const employeeService = new EmployeeService();
