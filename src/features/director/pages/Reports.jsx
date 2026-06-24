import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';
import { useData } from '@/features/data/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Panel } from '@/components/dash/Panel';
import { GradientStat } from '@/components/dash/GradientStat';
import { CHART_COLORS } from '@/constants/palette';
import { Trophy, CalendarCheck, ClipboardList } from 'lucide-react';

export default function DirectorReports() {
  const { db, studentsInSubject, studentAttendance, students } = useData();

  // avg score + attendance per subject
  const perSubject = db.subjects.map((s) => {
    const subA = db.assessments.filter((a) => a.subjectId === s.id);
    let total = 0; let count = 0;
    subA.forEach((a) => db.submissions.filter((x) => x.assessmentId === a.id).forEach((x) => { total += (x.marks / a.totalMarks) * 100; count += 1; }));
    const enrolled = studentsInSubject(s.id);
    const attAvg = enrolled.length
      ? Math.round(enrolled.reduce((n, st) => n + studentAttendance(st.id).percent, 0) / enrolled.length)
      : 0;
    return { name: s.code, score: count ? Math.round(total / count) : 0, attendance: attAvg };
  });

  const instAtt = Math.round(students().reduce((n, s) => n + studentAttendance(s.id).percent, 0) / students().length);
  const graded = db.submissions.length;
  const instScore = graded
    ? Math.round(db.submissions.reduce((n, x) => {
        const a = db.assessments.find((as) => as.id === x.assessmentId);
        return n + (a ? (x.marks / a.totalMarks) * 100 : 0);
      }, 0) / graded)
    : 0;

  return (
    <div>
      <PageHeader title="Reports" subtitle="Academic performance & attendance analytics" />
      <div className="grid gap-4 sm:grid-cols-3">
        <GradientStat label="Avg score" value={`${instScore}%`} icon={Trophy} tone="velvet" />
        <GradientStat label="Avg attendance" value={`${instAtt}%`} icon={CalendarCheck} tone="emerald" delay={0.05} />
        <GradientStat label="Assessments graded" value={graded} icon={ClipboardList} tone="plum" delay={0.1} />
      </div>

      <Panel title="Score vs attendance by subject" className="mt-5">
        <div className="h-80" role="img" aria-label={`Grouped bar chart comparing average score and attendance per subject. ${perSubject.map((d) => `${d.name}: ${d.score} percent score, ${d.attendance} percent attendance`).join('; ')}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perSubject} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDECF2" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5A5A5A' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#5A5A5A' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#F7F8FC' }} />
              <Legend iconType="circle" />
              <Bar dataKey="score" name="Avg score %" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
              <Bar dataKey="attendance" name="Attendance %" fill={CHART_COLORS[5]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
