import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_DELAY = 5000;

export function usePendingAction(delay = DEFAULT_DELAY) {
  const [progress, setProgress] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const stop = useCallback((resetProgress = true) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
    setIsPending(false);
    if (resetProgress) setProgress(0);
  }, []);

  const start = useCallback(
    (onConfirm: () => void) => {
      stop(true);
      setIsPending(true);
      setProgress(0);
      startTimeRef.current = performance.now();

      const tick = (now: number) => {
        const elapsed = now - (startTimeRef.current ?? now);
        const p = Math.min(100, (elapsed / delay) * 100);
        setProgress(p);
        if (p < 100) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);

      timerRef.current = setTimeout(() => {
        stop(true);
        onConfirm();
      }, delay);
    },
    [delay, stop],
  );

  const cancel = useCallback(() => stop(true), [stop]);

  useEffect(() => () => stop(false), [stop]);

  return { isPending, progress, start, cancel };
}
