export type Employee = {
  id: string | null;
  name: string;
  role: ROLE;
  walletAddress: string;
  isActive: boolean;
  isDeleted?: boolean;
  startWorkDate: Date;
  endWorkDate?: Date | null;
};

export enum ROLE {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}
