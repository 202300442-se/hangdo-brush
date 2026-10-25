"use client";

import { useEffect } from "react";

/**
 * 한 번 스크롤 = 화면 한 장 (넓은 화면 + 마우스 휠/트랙패드 전용)
 * - CSS scroll-snap만 쓰면 휠을 살짝 굴렸을 때 제자리로 되돌아가므로, 휠 한 번에 다음/이전 섹션으로 보낸다.
 * - 이동 중 들어오는 휠(트랙패드 관성 포함)은 무시한다.
 * - 키보드·스크롤바·스크린리더 이동은 그대로 두고 CSS snap(snap.css)이 처리한다.
 * - '동작 줄이기' 설정이면 끈다.
 */
const WIDE = "(min-width: 900px) and (min-height: 680px)";

export function FullPageScroll({ ids }: { ids: string[] }) {
  useEffect(() => {
    const wide = window.matchMedia(WIDE);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lockUntil = 0;

    const tops = () =>
      ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el)
        .map((el) => el.getBoundingClientRect().top + window.scrollY);

    const onWheel = (e: WheelEvent) => {
      if (!wide.matches || reduced.matches || e.ctrlKey) return;
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();

      const now = performance.now();
      if (now < lockUntil) {
        // 관성 스크롤이 이어지는 동안은 잠금을 조금씩 연장
        lockUntil = Math.max(lockUntil, now + 160);
        return;
      }
      if (Math.abs(e.deltaY) < 4) return;

      const points = tops();
      const end = document.documentElement.scrollHeight - window.innerHeight;
      points.push(end); // 마지막 섹션 다음은 바닥글
      const y = window.scrollY;
      const dir = e.deltaY > 0 ? 1 : -1;
      const target =
        dir > 0 ? points.find((p) => p > y + 8) : [...points].reverse().find((p) => p < y - 8);
      if (target === undefined) return;

      lockUntil = now + 900;
      window.scrollTo({ top: Math.min(target, end), behavior: "smooth" });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [ids]);

  return null;
}
