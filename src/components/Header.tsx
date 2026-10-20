"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { company } from "@/data/company";
import { Logo } from "./Logo";
import { finderCta, mainNav, orderLink } from "@/data/navigation";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isHome = pathname === "/" || pathname === "";

  // 홈 첫 화면에서는 영상 위에 투명하게 겹치고, 스크롤하면 흰 배경으로 바뀐다.
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const overlay = isHome && atTop && !open;

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => setOpen(false), [pathname]);

  // Esc로 닫고 토글 버튼으로 초점 복귀
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname?.startsWith(href.replace(/\/$/, ""));

  return (
    <header className={`site-header${overlay ? " site-header--overlay on-dark" : ""}`}>
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label={`${company.nameKo} 홈`}>
          <Logo inverse={overlay} />
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle__bar" aria-hidden="true" />
          <span className="sr-only">{open ? "메뉴 닫기" : "메뉴 열기"}</span>
        </button>

        <nav id="site-nav" className={`site-nav${open ? " is-open" : ""}`} aria-label="주 메뉴">
          <ul role="list" className="site-nav__list">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="site-nav__link"
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={orderLink.href}
            className="site-nav__util"
            aria-current={isActive(orderLink.href) ? "page" : undefined}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5z" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            {orderLink.label}
          </Link>
          <Link href={finderCta.href} className="btn btn--primary site-nav__cta">
            {finderCta.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
