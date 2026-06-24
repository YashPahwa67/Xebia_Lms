import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { navFor } from '@/config/access';
import { ROLES } from '@/constants';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail';
import Assessments from './pages/Assessments';
import Attendance from './pages/Attendance';
import Students from './pages/Students';

export default function TeacherLayout() {
  return (
    <DashboardLayout navItems={navFor(ROLES.TEACHER)} roleLabel="Teacher">
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="subjects/:id" element={<SubjectDetail />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="students" element={<Students />} />
      </Routes>
    </DashboardLayout>
  );
}
