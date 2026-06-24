// What each role can see and do. Layouts read `nav` from here and routes are
// still guarded by ProtectedRoute. Keeping it in one place so it's easy to tweak.
import {
  LayoutDashboard, Users, BookOpen, BarChart3, Wallet, CalendarCheck, ClipboardList,
} from 'lucide-react';

export const ACCESS = {
  Director: {
    home: '/director/dashboard',
    accent: 'plum',
    nav: [
      { to: '/director/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/director/users', label: 'Users', icon: Users },
      { to: '/director/subjects', label: 'Subjects', icon: BookOpen },
      { to: '/director/reports', label: 'Reports', icon: BarChart3 },
    ],
    can: ['viewAllUsers', 'viewAllSubjects', 'viewReports', 'viewFinanceSummary', 'viewAttendanceAll'],
  },

  Counsellor: {
    home: '/counsellor/dashboard',
    accent: 'magenta',
    nav: [
      { to: '/counsellor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/counsellor/students', label: 'Students', icon: Users },
      { to: '/counsellor/fees', label: 'Fees', icon: Wallet },
      { to: '/counsellor/attendance', label: 'Attendance', icon: CalendarCheck },
    ],
    can: ['viewAllStudents', 'manageFees', 'recordPayment', 'viewAttendanceAll'],
  },

  Teacher: {
    home: '/teacher/dashboard',
    accent: 'teal',
    nav: [
      { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/teacher/subjects', label: 'My Subjects', icon: BookOpen },
      { to: '/teacher/assessments', label: 'Assessments', icon: ClipboardList },
      { to: '/teacher/attendance', label: 'Attendance', icon: CalendarCheck },
      { to: '/teacher/students', label: 'Students', icon: Users },
    ],
    can: ['manageOwnSubjects', 'uploadNotes', 'createAssessment', 'markAttendance', 'viewOwnStudents'],
  },

  Student: {
    home: '/student/dashboard',
    accent: 'plum',
    nav: [
      { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/student/subjects', label: 'My Subjects', icon: BookOpen },
      { to: '/student/assessments', label: 'Assessments', icon: ClipboardList },
      { to: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
      { to: '/student/fees', label: 'Fees', icon: Wallet },
    ],
    can: ['viewEnrolledSubjects', 'viewNotes', 'takeAssessment', 'viewOwnAttendance', 'viewOwnFees'],
  },
};

// helpers
export const navFor = (role) => ACCESS[role]?.nav ?? [];
export const homeFor = (role) => ACCESS[role]?.home ?? '/';
export const accentFor = (role) => ACCESS[role]?.accent ?? 'plum';
export const can = (role, capability) => ACCESS[role]?.can.includes(capability) ?? false;
