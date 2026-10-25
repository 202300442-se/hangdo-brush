"use client";

import { useEffect } from "react";

/**
 * 마이크로 인터랙션 (마우스를 쓰는 기기에서만)
 * 1) 자석 버튼: [data-magnetic] 또는 주요 버튼이 커서 쪽으로 살짝 끌려옴 (최대 6px)
 * 2) 빛 반사: 카드 위에서 커서를 따라 은은한 빛이 비침 (--sx, --sy 좌표만 갱신)
 * - 문서 전체에 포인터 이벤트 1개만 걸고, requestAnimationFrame으로 묶어서 처리한다.
 * - '동작 줄이기' 설정이면 자석 효과는 끈다. 터치 기기에서는 둘 다 끈다.
 */
const MAGNETIC = ".btn--primary, .btn--light, .btn--kakao, .circle-link, .hero-media__toggle";
const SPOTLIGHT = ".type-tile__link, .app-item, .inquiry-option, .contact-card, .res-card, .result-card, .tech-card, .type-row";
const PULL = 0.18;
const MAX = 6;

export function Interactions() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let last: PointerEvent | null = null;
    let magnetEl: HTMLElement | null = null;

    const resetMagnet = () => {
      if (magnetEl) {
        magnetEl.style.removeProperty("--mx");
        magnetEl.style.removeProperty("--my");
        magnetEl = null;
      }
    };

    const frame = () => {
      raf = 0;
      const e = last;
      if (!e) return;
      const target = e.target as Element | null;

      const spot = target?.closest<HTMLElement>(SPOTLIGHT);
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--sx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }

      if (reduced) return;
      const mag = target?.closest<HTMLElement>(MAGNETIC);
      if (mag !== magnetEl) resetMagnet();
      if (mag) {
        const r = mag.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * PULL;
        const dy = (e.clientY - (r.top + r.height / 2)) * PULL;
        mag.style.setProperty("--mx", `${Math.max(-MAX, Math.min(MAX, dx)).toFixed(1)}px`);
        mag.style.setProperty("--my", `${Math.max(-MAX, Math.min(MAX, dy)).toFixed(1)}px`);
        magnetEl = mag;
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => resetMagnet();

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
