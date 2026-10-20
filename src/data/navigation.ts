// 상단 메뉴. 11월에 솔루션·기술·설비·자료실을 추가한다 (docs/MASTER_BRIEF.md 4절).
export const mainNav = [
  { href: "/company/", label: "회사소개" },
  { href: "/products/", label: "제품" },
  { href: "/order/", label: "주문조회" },
  { href: "/contact/", label: "문의" },
] as const;

export const finderCta = { href: "/finder/", label: "AI 제작상담" } as const;
