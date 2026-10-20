// 상단 메뉴 (2026-10-20 대표 인터뷰 반영: 제품 분류 대신 적용 분야·개발 사례 중심)
export const mainNav = [
  { href: "/company/", label: "회사소개" },
  { href: "/applications/", label: "제품·적용 분야" },
  { href: "/products/", label: "개발 사례" },
  { href: "/order/", label: "주문조회" },
  { href: "/contact/", label: "문의" },
] as const;

export const finderCta = { href: "/finder/", label: "AI 개발 의뢰" } as const;
