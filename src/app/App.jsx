import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROLES } from '@/constants';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { FullScreenLoader } from '@/components/ui/Spinner';
import { UnauthorizedPage, NotFoundPage } from '@/features/misc/ErrorPages';

const LandingPage = lazy(() => import('@/features/landing/LandingPage'));
const Login = lazy(() => import('@/features/auth/pages/Login'));
const RoleLogin = lazy(() => import('@/features/auth/pages/RoleLogin'));
const ForgotPassword = lazy(() => import('@/features/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/features/auth/pages/ResetPassword'));
const OAuthSuccess = lazy(() => import('@/features/auth/pages/OAuthSuccess'));

const DirectorLayout = lazy(() => import('@/features/director/DirectorLayout'));
const CounsellorLayout = lazy(() => import('@/features/counsellor/CounsellorLayout'));
const TeacherLayout = lazy(() => import('@/features/teacher/TeacherLayout'));
const StudentLayout = lazy(() => import('@/features/student/StudentLayout'));

export default function App() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/:role" element={<RoleLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/success" element={<OAuthSuccess />} />

        <Route
          path="/director/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.DIRECTOR]}>
              <DirectorLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/counsellor/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.COUNSELLOR]}>
              <CounsellorLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
              <TeacherLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
