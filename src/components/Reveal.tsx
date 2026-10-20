"use client";

import { useEffect } from "react";

/**
 * .reveal 요소가 화면에 들어오면 .is-visible을 붙인다.
 * JS가 실행되기 전·실패 시에는 html에 motion-ok 클래스가 없어 내용이 그대로 보인다.
 */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("motion-ok");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px" },
    );
    const observe = () => document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
