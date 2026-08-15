import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { LoginPage } from './pages/LoginPage';
import { MainLayout } from './components/layout/MainLayout';

import { DashboardPage } from './pages/DashboardPage';
import { EmployeeAttendancePage } from './pages/EmployeeAttendancePage';
import { EmployeesPage } from './pages/EmployeesPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { PositionsPage } from './pages/PositionsPage';
import { ContractsPage } from './pages/ContractsPage';
import { ShiftsPage } from './pages/ShiftsPage';
import { AttendanceAdminPage } from './pages/AttendanceAdminPage';
import { LeavePage } from './pages/LeavePage';
import { OvertimePage } from './pages/OvertimePage';
import { PayrollPage } from './pages/PayrollPage';
import { DevicesPage } from './pages/DevicesPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-slate-400">Authenticating HRMS Session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

import { RealtimeProvider } from './context/RealtimeContext';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RealtimeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="my-attendance" element={<EmployeeAttendancePage />} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="positions" element={<PositionsPage />} />
              <Route path="contracts" element={<ContractsPage />} />
              <Route path="shifts" element={<ShiftsPage />} />
              <Route path="attendance" element={<AttendanceAdminPage />} />
              <Route path="leave" element={<LeavePage />} />
              <Route path="overtime" element={<OvertimePage />} />
              <Route path="payroll" element={<PayrollPage />} />
              <Route path="devices" element={<DevicesPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="audit-logs" element={<AuditLogsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </RealtimeProvider>
    </AuthProvider>
  </ThemeProvider>
);
};

export default App;
