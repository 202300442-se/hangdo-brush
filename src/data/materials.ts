// 소재 — 회사가 다루는 모 소재 후보 (회사 제공 목록).
// desc·traits는 업계에서 일반적으로 알려진 성질만 적는다. 내열 온도·내약품 등급·식품 인증 같은 수치·인증은 쓰지 않는다.
// TODO: COMPANY EXPERT REVIEW REQUIRED — 소재별 기술 데이터는 대표 확인 후 추가

export type Material = {
  id: string;
  name: string;
  group: "합성수지" | "연마" | "천연모" | "금속 와이어";
  desc: string;
  /** 일반적 특성 2가지 (짧게) */
  traits: [string, string];
};

export const materials: Material[] = [
  {
    id: "nylon",
    name: "Nylon",
    group: "합성수지",
    desc: "세척과 마감 작업에 폭넓게 쓰이는 합성수지 모",
    traits: ["탄성과 내마모성이 좋아 반복 접촉에 강함", "세척·마감 등 범용 공정의 기본 소재"],
  },
  {
    id: "pp",
    name: "PP",
    group: "합성수지",
    desc: "물을 쓰는 세척 공정에 많이 쓰이는 합성수지 모",
    traits: ["가볍고 물을 거의 흡수하지 않음", "물·세척액을 쓰는 습식 세척에 적합"],
  },
  {
    id: "pbt",
    name: "PBT",
    group: "합성수지",
    desc: "탄성이 필요한 공정에서 검토하는 합성수지 모",
    traits: ["눌려도 원래 모양으로 잘 돌아옴", "모 형태 유지가 중요한 공정에서 검토"],
  },
  {
    id: "antibac",
    name: "항균모",
    group: "합성수지",
    desc: "위생 관리가 중요한 공정에서 검토하는 모",
    traits: ["항균 처리된 합성수지 모", "위생 관리가 중요한 공정에서 검토"],
  },
  {
    id: "abrasive",
    name: "연마사",
    group: "연마",
    desc: "연마 입자를 넣은 모로, 버 제거와 표면 마감에 사용",
    traits: ["모 자체에 연마 입자가 들어 있음", "버 제거·표면 마감·모서리 정리"],
  },
  {
    id: "bristle",
    name: "돈모",
    group: "천연모",
    desc: "부드러운 터치가 필요한 작업에 쓰이는 천연모",
    traits: ["부드럽고 촘촘한 천연 모", "섬세한 표면을 다루는 작업"],
  },
  {
    id: "steel",
    name: "스틸 와이어",
    group: "금속 와이어",
    desc: "녹·스케일 제거처럼 강한 작업에 쓰이는 금속 와이어",
    traits: ["강한 연삭력", "녹·스케일·용접 부산물 제거"],
  },
  {
    id: "sus",
    name: "스테인리스 와이어",
    group: "금속 와이어",
    desc: "녹 발생을 피해야 하는 공정에서 검토하는 금속 와이어",
    traits: ["와이어 자체의 녹 발생이 적음", "스테인리스·비철 소재 작업에 검토"],
  },
  {
    id: "brass",
    name: "황동(신주) 와이어",
    group: "금속 와이어",
    desc: "비교적 부드러운 금속 와이어로 마감 작업에 사용",
    traits: ["강철 와이어보다 부드러워 모재 손상이 적음", "비철금속 마감·세정 작업"],
  },
];

// 기술 — 회사 사진으로 확인되는 제작 공정만 적는다.
export const techItems = [
  { photo: "machine-knot-wheel", title: "꼬임 와이어 식모", desc: "와이어를 꼬아 원판에 차례로 심어 노트형 브러쉬를 만듭니다." },
  { photo: "wire-spools", title: "원자재 공급", desc: "와이어 원자재를 보빈에서 설비로 직접 공급합니다." },
  { photo: "core-white-pair-detail", title: "롤 코어 가공", desc: "모를 심을 몸체와 축을 공정 조건에 맞춰 준비합니다." },
] as const;
