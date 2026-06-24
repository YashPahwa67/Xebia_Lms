import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import { Confetti } from '@/components/Confetti';
import { cn } from '@/utils/cn';

const QUESTIONS = [
  { q: 'Which structure offers O(1) average lookup?', options: ['Array', 'Hash table', 'Linked list', 'Stack'], answer: 1 },
  { q: 'A process in waiting state is…', options: ['Running', 'Ready', 'Blocked', 'Terminated'], answer: 2 },
  { q: 'A primary key must be…', options: ['Nullable', 'Unique', 'Foreign', 'Indexed only'], answer: 1 },
  { q: 'Which OSI layer routes packets?', options: ['Transport', 'Network', 'Session', 'Physical'], answer: 1 },
];

const DURATION = 120; // seconds
const PASS_PCT = 40;

function Ring({ progress, label }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const danger = progress < 0.2;
  return (
    <div className="relative grid h-16 w-16 place-items-center">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#DADCEA" strokeWidth="5" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={danger ? '#FF6200' : '#01AC9F'} strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} />
      </svg>
      <span className={cn('absolute text-xs font-semibold tabular-nums', danger ? 'text-cta' : 'text-ink')}>{label}</span>
    </div>
  );
}

export function TakeAssessmentModal({ assessment, onClose, onSubmit }) {
  const [answers, setAnswers] = useState({});
  const [left, setLeft] = useState(DURATION);
  const [result, setResult] = useState(null);
  const submittedRef = useRef(false);

  const finish = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const correct = QUESTIONS.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
    const marks = Math.round((correct / QUESTIONS.length) * assessment.totalMarks);
    const pct = Math.round((marks / assessment.totalMarks) * 100);
    setResult({ marks, pct, passed: pct >= PASS_PCT });
    onSubmit(marks);
  }, [answers, assessment, onSubmit]);

  useEffect(() => {
    if (result) return undefined;
    if (left <= 0) { finish(); return undefined; }
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [left, result, finish]);

  const answered = Object.keys(answers).length;
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  return createPortal(
    <div className="fixed inset-0 z-[150] flex flex-col bg-paper">
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-1 items-center justify-center p-6">
            {result.passed && <Confetti />}
            <div className="w-full max-w-md rounded-3xl border border-line/70 bg-white p-10 text-center shadow-glow">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }} className={cn('mx-auto grid h-20 w-20 place-items-center rounded-full', result.passed ? 'bg-teal/10 text-teal-soft' : 'bg-cta/10 text-cta')}>
                {result.passed ? <Trophy className="h-9 w-9" /> : <RotateCcw className="h-9 w-9" />}
              </motion.span>
              <h2 className="mt-5 font-display text-2xl font-bold text-ink">{result.passed ? 'Well done! 🎉' : 'Keep going'}</h2>
              <p className="mt-1 text-sm text-slate/70">{assessment.title}</p>
              <p className="mt-6 font-display text-5xl font-bold text-gradient">{result.pct}%</p>
              <p className="mt-1 text-sm text-slate/60">{result.marks} / {assessment.totalMarks} marks</p>
              <button onClick={onClose} className="mt-8 inline-flex rounded-full bg-plum px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-plum-dark">Back to assessments</button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 flex-col">
            <header className="flex items-center justify-between border-b border-line/70 bg-white px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate/55">Focus mode</p>
                <h1 className="font-display text-lg font-semibold text-ink">{assessment.title}</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden items-center gap-1.5 text-sm text-slate/70 sm:flex"><Clock size={15} /> {answered}/{QUESTIONS.length} answered</span>
                <Ring progress={left / DURATION} label={`${mm}:${ss}`} />
                <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-slate/60 hover:bg-paper hover:text-ink" aria-label="Exit assessment"><X size={18} /></button>
              </div>
            </header>

            <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-6 py-8">
              {/* progress dots */}
              <div className="mb-6 flex gap-2">
                {QUESTIONS.map((_, i) => (
                  <span key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors', answers[i] != null ? 'bg-plum' : 'bg-mist')} />
                ))}
              </div>
              <div className="space-y-5">
                {QUESTIONS.map((q, i) => (
                  <div key={i} className="rounded-2xl border border-line/70 bg-white p-5">
                    <p className="text-sm font-medium text-ink">{i + 1}. {q.q}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {q.options.map((opt, oi) => (
                        <label key={oi} className={cn('flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors', answers[i] === oi ? 'border-plum bg-plum/[0.05] text-plum' : 'border-line text-slate hover:border-plum/40')}>
                          <input type="radio" name={`q${i}`} checked={answers[i] === oi} onChange={() => setAnswers((a) => ({ ...a, [i]: oi }))} className="text-plum focus:ring-plum" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <footer className="border-t border-line/70 bg-white px-6 py-4">
              <div className="mx-auto flex max-w-2xl items-center justify-between">
                <span className="text-sm text-slate/60">{answered === QUESTIONS.length ? 'All questions answered' : `${QUESTIONS.length - answered} remaining`}</span>
                <button onClick={finish} className="inline-flex items-center gap-2 rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-plum-dark">
                  Submit <ArrowRight size={16} />
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
