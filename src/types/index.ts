export interface Employee {
  id: string;
  name: string;
  nic: string;
  dateOfBirth: string;
  joinDate: string;
  isResident: boolean;
  blockNumber?: string;
  contactNumber: string;
  emergencyContact: string;
  address: string;
  dependents: Dependent[];
}

export interface Dependent {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  nic?: string;
}

export interface TeaRecord {
  id: string;
  employeeId: string;
  date: string;
  weight: number;
  verifiedBy: string;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  weekStarting: string;
  weekEnding: string;
  daysWorked: number;
  averageWeight: number;
  totalAmount: number;
  status: 'pending' | 'paid';
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager';
}

export interface AuthState {
  user: User | null;
  token: string | null;
}</content>