import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee, TeaRecord, SalaryRecord, User, AuthState } from '../types';
import { api } from '../lib/api';

interface Store extends AuthState {
  employees: Employee[];
  teaRecords: TeaRecord[];
  salaryRecords: SalaryRecord[];
  minimumTeaWeight: number;
  dailyRate: number;
  setMinimumTeaWeight: (weight: number) => void;
  setDailyRate: (rate: number) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchEmployees: () => Promise<void>;
  addEmployee: (employee: Employee) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  addTeaRecord: (record: TeaRecord) => Promise<void>;
  fetchTeaRecords: () => Promise<void>;
  calculateSalaries: () => Promise<void>;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      employees: [],
      teaRecords: [],
      salaryRecords: [],
      minimumTeaWeight: 30,
      dailyRate: 1000,

      setMinimumTeaWeight: (weight) => set({ minimumTeaWeight: weight }),
      setDailyRate: (rate) => set({ dailyRate: rate }),

      login: async (username, password) => {
        const { user, token } = await api.auth.login(username, password);
        set({ user, token });
      },

      logout: () => set({ user: null, token: null }),

      fetchEmployees: async () => {
        const employees = await api.employees.list();
        set({ employees });
      },

      addEmployee: async (employee) => {
        await api.employees.create(employee);
        get().fetchEmployees();
      },

      updateEmployee: async (employee) => {
        await api.employees.update(employee.id, employee);
        get().fetchEmployees();
      },

      addTeaRecord: async (record) => {
        await api.teaRecords.create(record);
        get().fetchTeaRecords();
      },

      fetchTeaRecords: async () => {
        const teaRecords = await api.teaRecords.list();
        set({ teaRecords });
      },

      calculateSalaries: async () => {
        await api.salary.process();
        const salaryRecords = await api.salary.list();
        set({ salaryRecords });
      },
    }),
    {
      name: 'tea-estate-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        minimumTeaWeight: state.minimumTeaWeight,
        dailyRate: state.dailyRate,
      }),
    }
  )
);