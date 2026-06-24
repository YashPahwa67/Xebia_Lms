import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Word-by-word mask reveal for editorial headings.
// `lines` is an array of arrays of tokens: [{ text, accent? }].
export function AnimatedHeading({ lines, className, as: Tag = 'h2', delay = 0 }) {
  const reduce = useReducedMotion();
  // Memoize so the motion component identity is stable across re-renders
  // (recreating it would remount the heading and cause a flash).
  const MotionTag = useMemo(() => motion(Tag), [Tag]);

  if (reduce) {
    return (
      <Tag className={className}>
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.map((t, ti) => (
              <span key={ti} className={t.accent ? 'text-gradient' : undefined}>
                {t.text}{' '}
              </span>
            ))}
          </span>
        ))}
      </Tag>
    );
  }

  let index = 0;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-[0.08em]">
          {line.map((token, ti) => {
            const i = index++;
            return (
              <span key={ti} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className={`inline-block ${token.accent ? 'text-gradient' : ''}`}
                  variants={{
                    hidden: { y: '110%' },
                    show: { y: '0%' },
                  }}
                  transition={{ duration: 0.8, delay: delay + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  {token.text}
                </motion.span>
                {ti < line.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </span>
      ))}
    </MotionTag>
  );
}
