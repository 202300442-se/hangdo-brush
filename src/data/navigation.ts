// 상단 메뉴 (2026-10-20 개편)
// - 견적/주문 메뉴는 두지 않는다: 견적은 AI 제작상담·전화로 받고, 결제·주문은 오프라인으로 진행.
// - 주문조회는 거래처 전용이라 주 메뉴가 아닌 보조 링크로 둔다.
export const mainNav = [
  { href: "/company/", label: "회사소개" },
  { href: "/products/", label: "브러쉬·제품" },
  { href: "/materials/", label: "소재·기술" },
  { href: "/resources/", label: "자료실" },
  { href: "/contact/", label: "고객센터" },
] as const;

export const orderLink = { href: "/order/", label: "주문조회" } as const;
export const finderCta = { href: "/finder/", label: "AI 제작상담" } as const;
