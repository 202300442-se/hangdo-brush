"use client";

import { useEffect, useState } from "react";

/**
 * 오른쪽 섹션 점 내비게이션 (넓은 화면 전용)
 * - 지금 보고 있는 섹션을 표시하고, 누르면 그 섹션으로 이동한다.
 * - 이름은 마우스를 올리거나 키보드 초점이 오면 나타난다.
 */
export function SectionDots({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="section-dots" aria-label="섹션 이동">
      <ul role="list">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className="section-dots__link" aria-current={active === i.id ? "true" : undefined}>
              <span className="section-dots__label">{i.label}</span>
              <span className="section-dots__dot" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
