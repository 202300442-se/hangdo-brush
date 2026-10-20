// =========================================================
// Brush Finder 데모 추천 규칙 — 기술 검토 전
// =========================================================
// 이 규칙은 중간 MVP 시연용 초안이다. 회사 전문가 검토를 거치지 않았으며
// 화면에도 "데모 규칙 · 기술 검토 전"으로 표시한다.
// 규칙 교체 시 이 파일만 수정하면 엔진·UI는 그대로 동작한다.
// TODO: COMPANY EXPERT REVIEW REQUIRED

export type BrushRule = {
  id: string;
  /** 일치해야 하는 작업 목적 (하나라도) */
  purposes: string[];
  /** 지정 시 대상물이 이 중 하나일 때만 일치 */
  targets?: string[];
  shapes: { id: string; label: string }[];
  materials: { id: string; label: string }[];
  reason: string;
  cautions?: string[];
};

export const brushRules: BrushRule[] = [
  {
    id: "R01-rust-metal",
    purposes: ["rust"],
    targets: ["steel", "stainless", "nonferrous", "conveyor"],
    shapes: [
      { id: "roll", label: "와이어 롤 브러쉬" },
      { id: "wheel", label: "와이어 휠 브러쉬" },
    ],
    materials: [
      { id: "steel-wire", label: "스틸 와이어" },
      { id: "knot-wire", label: "꼬임(Knot) 와이어" },
    ],
    reason: "금속 표면의 녹·스케일 제거 작업",
  },
  {
    id: "R02-deburr-metal",
    purposes: ["deburr"],
    targets: ["steel", "stainless", "nonferrous"],
    shapes: [
      { id: "wheel", label: "휠 브러쉬" },
      { id: "cup", label: "컵 브러쉬" },
    ],
    materials: [
      { id: "sus-wire", label: "스테인리스 와이어" },
      { id: "abrasive", label: "연마사" },
    ],
    reason: "금속 가공품의 버 제거 작업",
  },
  {
    id: "R03-finish",
    purposes: ["finish"],
    targets: ["steel", "stainless", "nonferrous", "sheet"],
    shapes: [{ id: "roll", label: "롤 브러쉬" }],
    materials: [{ id: "abrasive", label: "연마사" }],
    reason: "판재·금속 표면의 연마·마감 작업",
  },
  {
    id: "R04-wash",
    purposes: ["wash"],
    shapes: [{ id: "roll", label: "롤 브러쉬" }],
    materials: [
      { id: "nylon", label: "Nylon" },
      { id: "pp", label: "PP" },
    ],
    reason: "물·세척액을 사용하는 세척 작업",
  },
  {
    id: "R05-food",
    purposes: ["food"],
    shapes: [{ id: "roll", label: "롤 브러쉬" }],
    materials: [
      { id: "pp", label: "PP" },
      { id: "nylon", label: "Nylon" },
    ],
    reason: "식품·농산물 세척 공정",
    cautions: ["식품 접촉 소재 적합성(필요 서류 포함)은 기술 담당자 확인이 필요합니다."],
  },
  {
    id: "R06-polish-nonferrous",
    purposes: ["polish"],
    targets: ["nonferrous", "steel", "stainless"],
    shapes: [{ id: "wheel", label: "휠 브러쉬" }],
    materials: [{ id: "brass-wire", label: "황동 와이어" }],
    reason: "비철금속 등의 부드러운 마감·광택 작업",
  },
  {
    id: "R07-debris",
    purposes: ["debris"],
    shapes: [
      { id: "roll", label: "롤 브러쉬" },
      { id: "strip", label: "스트립 브러쉬" },
    ],
    materials: [
      { id: "nylon", label: "Nylon" },
      { id: "pp", label: "PP" },
    ],
    reason: "컨베이어·설비의 이물질 제거·이송",
  },
  {
    id: "R08-static",
    purposes: ["static"],
    shapes: [{ id: "strip", label: "제전 브러쉬" }],
    materials: [{ id: "antistatic", label: "제전사" }],
    reason: "정전기 제거",
    cautions: ["제전 소재와 설치 방식은 사용 환경에 따라 기술 담당자 검토가 필요합니다."],
  },
];
