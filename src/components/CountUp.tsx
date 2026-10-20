"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 화면에 들어오면 숫자가 from → to 로 올라간다.
 * - 처음 HTML에는 최종 숫자가 들어 있다 (검색엔진·JS 없는 환경·스크린리더는 최종값만 본다).
 * - '동작 줄이기' 설정이면 애니메이션 없이 최종값만 보여 준다.
 */
export function CountUp({ to, from = 0, duration = 1600 }: { to: number; from?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    setValue(from);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          setValue(Math.round(from + (to - from) * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [from, to, duration]);

  return (
    <>
      <span className="sr-only">{to}</span>
      <span ref={ref} className="tnum" aria-hidden="true">
        {value}
      </span>
    </>
  );
}
