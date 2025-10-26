import mongoose, { Schema, model } from 'mongoose';
import { Employee, ROLE } from '~/types/employee.type';

const DOCUMENT_NAME = 'Employee';
const COLLECTION_NAME = 'employees';

const EmployeeSchema = new Schema<Employee>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, required: true },
    role: { type: String, enum: ROLE, required: true },
    walletAddress: { type: String, required: true, unique: true, index: true },
    isActive: { type: Boolean, default: true },
    startWorkDate: { type: Date, required: true },
    endWorkDate: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { collection: COLLECTION_NAME },
);

// Use mongoose.models safely (works when models may be undefined in certain envs)
const EmployeeModel = mongoose.models?.[DOCUMENT_NAME] || model(DOCUMENT_NAME, EmployeeSchema);

export default EmployeeModel;
