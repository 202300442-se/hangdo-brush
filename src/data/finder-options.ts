// Brush Finder 질문 선택지.
// 분류는 잠정안이며, 교체 시 이 파일만 수정한다.
// TODO: COMPANY EXPERT REVIEW REQUIRED

export type Option = { id: string; label: string; hint?: string };

export const UNKNOWN = "unknown";
export const OTHER = "other";

export const purposes: Option[] = [
  { id: "rust", label: "녹·스케일 제거", hint: "산화막, 용접 스패터 등" },
  { id: "deburr", label: "버(Burr) 제거", hint: "가공 후 날카로운 모서리" },
  { id: "finish", label: "연마·표면 마감", hint: "표면 거칠기 정리" },
  { id: "wash", label: "세척", hint: "물·세척액과 함께" },
  { id: "food", label: "식품 세척", hint: "농산물·식품 공정" },
  { id: "polish", label: "광택·부드러운 마감", hint: "비철금속 등" },
  { id: "debris", label: "이물질 제거·이송", hint: "컨베이어, 분진" },
  { id: "static", label: "정전기 제거" },
  { id: OTHER, label: "기타 (직접 입력)" },
];

export const targets: Option[] = [
  { id: "steel", label: "철·스틸" },
  { id: "stainless", label: "스테인리스" },
  { id: "nonferrous", label: "알루미늄·비철금속" },
  { id: "food", label: "식품·농산물" },
  { id: "sheet", label: "판재·필름·유리" },
  { id: "conveyor", label: "컨베이어·설비 부품" },
  { id: OTHER, label: "기타 (직접 입력)" },
];

export const industries: Option[] = [
  { id: "steel", label: "철강" },
  { id: "food", label: "식품" },
  { id: "semicon", label: "반도체·전자" },
  { id: "auto", label: "자동차·부품" },
  { id: "general", label: "일반 제조" },
  { id: UNKNOWN, label: "잘 모르겠습니다" },
];

export const motions: Option[] = [
  { id: "rotary", label: "회전형 (설비에 장착)" },
  { id: "grinder", label: "그라인더·공구에 장착" },
  { id: "fixed", label: "고정형 (회전하지 않음)" },
  { id: UNKNOWN, label: "잘 모르겠습니다" },
];

export const shapes: Option[] = [
  { id: "roll", label: "롤 (긴 원통형)" },
  { id: "wheel", label: "휠 (원판형)" },
  { id: "cup", label: "컵형" },
  { id: "strip", label: "스트립 (일자형)" },
  { id: UNKNOWN, label: "잘 모르겠습니다" },
];

export const currentBrush: Option[] = [
  { id: "same", label: "있음 — 같은 제품으로 재제작" },
  { id: "improve", label: "있음 — 문제가 있어 개선 필요" },
  { id: "none", label: "없음 — 처음 도입" },
  { id: UNKNOWN, label: "잘 모르겠습니다" },
];

export const environments: Option[] = [
  { id: "water", label: "물 사용" },
  { id: "chemical", label: "약품·세척제" },
  { id: "heat", label: "고온" },
  { id: "oil", label: "기름·절삭유" },
  { id: "dust", label: "분진" },
  { id: "none", label: "특별한 조건 없음" },
  { id: UNKNOWN, label: "잘 모르겠습니다" },
];

export const materials: Option[] = [
  { id: "nylon", label: "Nylon" },
  { id: "pp", label: "PP" },
  { id: "abrasive", label: "연마사" },
  { id: "steel-wire", label: "스틸 와이어" },
  { id: "sus-wire", label: "스테인리스 와이어" },
  { id: "brass-wire", label: "황동 와이어" },
  { id: "knot-wire", label: "꼬임(Knot) 와이어" },
  { id: "bristle", label: "돈모" },
  { id: "antistatic", label: "제전사" },
  { id: UNKNOWN, label: "잘 모르겠습니다" },
];

export const attachments: Option[] = [
  { id: "photo", label: "사진 있음" },
  { id: "drawing", label: "도면 있음" },
  { id: "both", label: "사진·도면 모두 있음" },
  { id: "none", label: "없음" },
];

export const labelOf = (list: Option[], id: string | undefined) =>
  list.find((o) => o.id === id)?.label;
