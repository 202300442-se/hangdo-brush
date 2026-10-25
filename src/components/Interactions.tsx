"use client";

import { useEffect } from "react";

/**
 * 마이크로 인터랙션 (마우스를 쓰는 기기에서만)
 * - 빛 반사: 카드 위에서 커서를 따라 은은한 빛이 비침 (--sx, --sy 좌표만 갱신)
 * - 문서 전체에 포인터 이벤트 1개만 걸고, requestAnimationFrame으로 묶어서 처리한다.
 * - (2026-10-25) 자석 버튼은 제거함 — 버튼이 커서로 끌려오는 효과는 쓰지 않는다.
 */
const SPOTLIGHT = ".type-tile__link, .app-item, .inquiry-option, .contact-card, .res-card, .result-card, .tech-card, .type-row";

export function Interactions() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let last: PointerEvent | null = null;

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

    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
