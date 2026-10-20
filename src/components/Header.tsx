"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { company } from "@/data/company";
import { Logo } from "./Logo";
import { finderCta, mainNav, orderLink } from "@/data/navigation";

// 메뉴는 항상 펼쳐 둔다 (햄버거 버튼 없음).
// 넓은 화면: 로고 오른쪽에 한 줄 / 좁은 화면: 로고 아래 한 줄로 내려가 좌우로 밀어서 볼 수 있음.
export function Header() {
  const pathname = usePathname();
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const isHome = pathname === "/" || pathname === "";

  // 홈 첫 화면에서는 영상 위에 투명하게 겹치고, 스크롤하면 흰 배경으로 바뀐다.
  // 아래로 스크롤하면 숨고, 위로 스크롤하면 다시 나타난다 (초점이 헤더 안에 있으면 숨기지 않음).
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 40);
      const headerHasFocus = document.activeElement?.closest(".site-header") != null;
      if (y > 240 && y > lastY + 4 && !headerHasFocus) setHidden(true);
      else if (y < lastY - 4 || y <= 240) setHidden(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const overlay = isHome && atTop;

  const isActive = (href: string) => pathname?.startsWith(href.replace(/\/$/, ""));

  return (
    <header
      className={`site-header${overlay ? " site-header--overlay on-dark" : ""}${hidden ? " site-header--hidden" : ""}`}
      onFocus={() => setHidden(false)}
    >
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label={`${company.nameKo} 홈`}>
          <Logo inverse={overlay} />
        </Link>

        <nav className="site-nav" aria-label="주 메뉴">
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
            <li>
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
            </li>
            <li>
              <Link href={finderCta.href} className="btn btn--primary site-nav__cta">
                {finderCta.label}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
