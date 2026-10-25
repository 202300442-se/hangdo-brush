"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * 오른쪽 아래 글라스 'AI 제작상담' 버튼
 * - 첫 화면을 지나면 나타나고, 페이지 맨 아래(푸터)에 닿으면 숨는다.
 * - AI 제작상담·주문조회 화면에서는 보이지 않는다.
 */
export function FloatingCta() {
  const pathname = usePathname() ?? "";
  const [show, setShow] = useState(false);
  const hiddenHere = pathname.includes("/finder") || pathname.includes("/order");

  useEffect(() => {
    if (hiddenHere) return;
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom = window.innerHeight + y > document.documentElement.scrollHeight - 320;
      setShow(y > window.innerHeight * 0.7 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hiddenHere]);

  if (hiddenHere) return null;

  return (
    <Link
      href="/finder/"
      className={`floating-cta${show ? " is-shown" : ""}`}
      aria-hidden={show ? undefined : true}
      tabIndex={show ? undefined : -1}
    >
      <span className="floating-cta__dot" aria-hidden="true" />
      AI 제작상담
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </Link>
  );
}
