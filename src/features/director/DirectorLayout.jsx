import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { navFor } from '@/config/access';
import { ROLES } from '@/constants';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import Subjects from './pages/Subjects';
import Reports from './pages/Reports';

export default function DirectorLayout() {
  return (
    <DashboardLayout navItems={navFor(ROLES.DIRECTOR)} roleLabel="Director">
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="reports" element={<Reports />} />
      </Routes>
    </DashboardLayout>
  );
}
