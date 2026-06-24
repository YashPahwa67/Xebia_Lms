import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { navFor } from '@/config/access';
import { ROLES } from '@/constants';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail';
import Assessments from './pages/Assessments';
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import Announcements from '@/features/announcements/AnnouncementsPage';

export default function StudentLayout() {
  return (
    <DashboardLayout navItems={navFor(ROLES.STUDENT)} roleLabel="Student">
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="subjects/:id" element={<SubjectDetail />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="fees" element={<Fees />} />
        <Route path="announcements" element={<Announcements />} />
      </Routes>
    </DashboardLayout>
  );
}
