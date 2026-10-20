"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { company } from "@/data/company";
import { finderCta, mainNav } from "@/data/navigation";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

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
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label={`${company.nameKo} 홈`}>
          {/* TODO: 공식 HJ 로고 파일 수령 후 교체 */}
          <span className="brand__mark" aria-hidden="true">HJ</span>
          <span className="brand__text">
            <span className="brand__ko">{company.nameKo}</span>
            <span className="brand__en">{company.nameEn}</span>
          </span>
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
          <Link href={finderCta.href} className="btn btn--primary site-nav__cta">
            {finderCta.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
