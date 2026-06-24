// Compute lesson counts and estimated duration from a course's modules.

export function calculateLessonCount(course) {
  if (!Array.isArray(course?.modules)) return 0;
  return course.modules.reduce((total, m) => {
    const videos = m.videos?.length || 0;
    const pdfs = m.pdfs?.length || 0;
    const assignments = m.assignments?.length || 0;
    return total + videos + pdfs + assignments;
  }, 0);
}

// Rough estimate: ~10 minutes per lesson, formatted as "Xh Ym".
export function calculateCourseDuration(course) {
  const minutes = calculateLessonCount(course) * 10;
  if (minutes <= 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h ? `${h}h` : null, m ? `${m}m` : null].filter(Boolean).join(' ') || '0m';
}
