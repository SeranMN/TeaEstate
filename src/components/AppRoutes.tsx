import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { EmployeeList } from './EmployeeList';
import { TeaRecords } from './TeaRecords';
import { SalaryManagement } from './SalaryManagement';
import { Settings } from './Settings';
import { Login } from './Login';
import { useStore } from '../store/useStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  const user = useStore((state) => state.user);

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <PrivateRoute>
            <EmployeeList />
          </PrivateRoute>
        }
      />

      <Route
        path="/tea-records"
        element={
          <PrivateRoute>
            <TeaRecords />
          </PrivateRoute>
        }
      />

      <Route
        path="/salary"
        element={
          <PrivateRoute>
            <SalaryManagement />
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
