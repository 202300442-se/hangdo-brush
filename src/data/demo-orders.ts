// MVP 데모 데이터 — 실제 주문·고객과 무관한 가상 데이터. 거래처명은 넣지 않는다.
// 현재 회사의 생산 일정은 종이로 관리되며, 실시간 연동되는 시스템이 없다.
// 조회 코드는 원문을 두지 않고 SHA-256(주문번호:코드) 해시만 둔다.
// ⚠️ 정적 사이트라 이 파일은 브라우저에 그대로 내려간다. 실제 주문 데이터는 절대 여기에 넣지 않는다.
// 2단계: 서버 API(/api/orders)에서 주문번호+조회 코드(또는 거래처 로그인)를 확인하고, DB 행 단위 보안(RLS)으로 본인 주문만 반환.

export const ORDER_STATUSES = ["주문 접수", "사양 확정", "소재 준비", "제작 중", "품질 검수", "포장", "출고 완료"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type DemoOrder = {
  id: string;
  /** SHA-256(`${id}:${조회코드}`) */
  codeHash: string;
  summary: string;
  status: OrderStatus;
  /** 상태별 처리일 (완료된 단계까지만) */
  history: { status: OrderStatus; date: string }[];
  expected: string;
};

export const demoOrders: DemoOrder[] = [
  {
    id: "HJ-DEMO-001",
    codeHash: "0e9550a3b697623f01ec388cd07971cec0f08d3356bc5513767d7bddc0d5d388",
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
    codeHash: "801a4e4c2dfde4d5a931bf36bd67cead1c38eaefdde9c8ed8ec2068527045e31",
    summary: "휠 브러쉬 (데모)",
    status: "출고 완료",
    history: ORDER_STATUSES.map((s, i) => ({ status: s, date: `2026-09-${String(10 + i * 2).padStart(2, "0")}` })),
    expected: "2026-09-22",
  },
  {
    id: "HJ-DEMO-003",
    codeHash: "1a97b7dd332a8e29f930c77261fee93fd477b40d7ed8c8b85293ecd8be2e9038",
    summary: "롤 브러쉬 재제작 (데모)",
    status: "주문 접수",
    history: [{ status: "주문 접수", date: "2026-10-19" }],
    expected: "사양 확정 후 안내",
  },
];

/** 데모 안내용 조회 코드 (실제 서비스에서는 주문 확정 시 거래처에만 개별 안내) */
export const DEMO_CODES: Record<string, string> = {
  "HJ-DEMO-001": "482913",
  "HJ-DEMO-002": "735160",
  "HJ-DEMO-003": "290847",
};
