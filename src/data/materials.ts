// 소재 — 회사가 다루는 모 소재 후보 (회사 제공 목록).
// 설명은 일반적인 용도 수준만 적는다. 내열·내약품·식품 적합성 같은 기술 수치는 지어내지 않는다.
// TODO: COMPANY EXPERT REVIEW REQUIRED — 소재별 기술 데이터는 대표 확인 후 추가

export type Material = { id: string; name: string; group: "합성수지" | "연마" | "천연모" | "금속 와이어"; desc: string };

export const materials: Material[] = [
  { id: "nylon", name: "Nylon", group: "합성수지", desc: "세척과 마감 작업에 폭넓게 쓰이는 합성수지 모" },
  { id: "pp", name: "PP", group: "합성수지", desc: "물을 쓰는 세척 공정에 많이 쓰이는 합성수지 모" },
  { id: "pbt", name: "PBT", group: "합성수지", desc: "탄성이 필요한 공정에서 검토하는 합성수지 모" },
  { id: "antibac", name: "항균모", group: "합성수지", desc: "위생 관리가 중요한 공정에서 검토하는 모" },
  { id: "abrasive", name: "연마사", group: "연마", desc: "연마 입자를 넣은 모로, 버 제거와 표면 마감에 사용" },
  { id: "bristle", name: "돈모", group: "천연모", desc: "부드러운 터치가 필요한 작업에 쓰이는 천연모" },
  { id: "steel", name: "스틸 와이어", group: "금속 와이어", desc: "녹·스케일 제거처럼 강한 작업에 쓰이는 금속 와이어" },
  { id: "sus", name: "스테인리스 와이어", group: "금속 와이어", desc: "녹 발생을 피해야 하는 공정에서 검토하는 금속 와이어" },
  { id: "brass", name: "황동(신주) 와이어", group: "금속 와이어", desc: "비교적 부드러운 금속 와이어로 마감 작업에 사용" },
];

// 기술 — 회사 사진으로 확인되는 제작 공정만 적는다.
export const techItems = [
  { photo: "machine-knot-wheel", title: "꼬임 와이어 식모", desc: "와이어를 꼬아 원판에 차례로 심어 노트형 브러쉬를 만듭니다." },
  { photo: "wire-spools", title: "원자재 공급", desc: "와이어 원자재를 보빈에서 설비로 직접 공급합니다." },
  { photo: "core-white-pair-detail", title: "롤 코어 가공", desc: "모를 심을 몸체와 축을 공정 조건에 맞춰 준비합니다." },
] as const;
