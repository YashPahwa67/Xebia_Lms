// Application-wide constants.
import { homeFor } from '@/config/access';

export const ROLES = {
  DIRECTOR: 'Director',
  COUNSELLOR: 'Counsellor',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  ROLE: 'role',
};

// landing route per role (kept in config/access.js)
export const ROLE_HOME = {
  [ROLES.DIRECTOR]: homeFor(ROLES.DIRECTOR),
  [ROLES.COUNSELLOR]: homeFor(ROLES.COUNSELLOR),
  [ROLES.TEACHER]: homeFor(ROLES.TEACHER),
  [ROLES.STUDENT]: homeFor(ROLES.STUDENT),
};

export const ASSESSMENT_DEFAULTS = {
  DURATION_MINUTES: 60,
  PASSING_SCORE: 40,
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
};
