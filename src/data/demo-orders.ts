// MVP 데모 데이터 — 실제 주문·고객과 무관한 가상 데이터.
// 현재 회사의 생산 일정은 종이로 관리되며, 실시간 연동되는 시스템이 없다.
// 2단계: 관리자가 DB에 상태를 직접 입력 → /api/orders 로 교체.

export const ORDER_STATUSES = ["주문 접수", "사양 확정", "소재 준비", "제작 중", "품질 검수", "포장", "출고 완료"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type DemoOrder = {
  id: string;
  summary: string;
  status: OrderStatus;
  /** 상태별 처리일 (완료된 단계까지만) */
  history: { status: OrderStatus; date: string }[];
  expected: string;
};

export const demoOrders: DemoOrder[] = [
  {
    id: "HJ-DEMO-001",
    summary: "와이어 롤 브러쉬 (데모)",
    status: "제작 중",
    history: [
      { status: "주문 접수", date: "2026-10-05" },
      { status: "사양 확정", date: "2026-10-08" },
      { status: "소재 준비", date: "2026-10-12" },
      { status: "제작 중", date: "2026-10-16" },
    ],
    expected: "2026-10-30",
  },
  {
    id: "HJ-DEMO-002",
    summary: "휠 브러쉬 (데모)",
    status: "출고 완료",
    history: ORDER_STATUSES.map((s, i) => ({ status: s, date: `2026-09-${String(10 + i * 2).padStart(2, "0")}` })),
    expected: "2026-09-22",
  },
  {
    id: "HJ-DEMO-003",
    summary: "롤 브러쉬 재제작 (데모)",
    status: "주문 접수",
    history: [{ status: "주문 접수", date: "2026-10-19" }],
    expected: "사양 확정 후 안내",
  },
];
