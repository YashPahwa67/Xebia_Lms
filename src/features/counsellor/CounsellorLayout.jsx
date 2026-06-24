import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { navFor } from '@/config/access';
import { ROLES } from '@/constants';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Fees from './pages/Fees';
import Attendance from './pages/Attendance';

export default function CounsellorLayout() {
  return (
    <DashboardLayout navItems={navFor(ROLES.COUNSELLOR)} roleLabel="Counsellor">
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="fees" element={<Fees />} />
        <Route path="attendance" element={<Attendance />} />
      </Routes>
    </DashboardLayout>
  );
}
