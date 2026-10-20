// 적용 분야 — 2026-10-20 대표 인터뷰에서 실제 제작 경험이 있다고 확인한 분야.
// 문구는 "그 공정이 왜 어려운가(과제)"와 "개발 시 검토하는 것"을 일반적인 공정 특성 기준으로 정리했다.
// 세부 사양·수치·납품처는 공개하지 않는다. 항목 추가 시 이 파일만 수정한다.
// TODO: 과제·검토 포인트 문구 대표 확인

export type Application = {
  id: string;
  title: string;
  group: "세척" | "물기·이물질 제거" | "연마·표면 처리";
  /** 이 공정의 핵심 과제 (한 줄) */
  summary: string;
  /** 개발할 때 검토하는 것 */
  points: string[];
  /** 의뢰서 입력과 맞춰 보는 검색어. 한 글자 검색어는 단어 단위로만 일치시킨다. */
  keywords: string[];
};

export const applications: Application[] = [
  {
    id: "railway",
    title: "철도 차량 세척",
    group: "세척",
    summary: "길고 굴곡진 차체 전면을 균일하게, 도장면은 상하지 않게",
    points: ["차체 곡면·창틀·연결부까지 고르게 닿는 모 길이와 유연성", "물·세제를 계속 쓰는 환경에서 버티는 모와 몸체", "대형 회전 브러쉬의 균형과 교체 주기"],
    keywords: ["기차", "열차", "철도", "전동차", "지하철", "객차", "차체"],
  },
  {
    id: "bus",
    title: "버스 세척",
    group: "세척",
    summary: "오염은 확실히, 도장면은 상하지 않게 — 매일 반복되는 세차",
    points: ["사이드미러·창문 등 돌출부에 걸리지 않는 모의 유연성", "오염 제거력과 도장면 보호 사이의 균형", "세제·물 상시 사용과 잦은 가동에 따른 마모"],
    keywords: ["버스", "세차", "차량", "차체", "자동차"],
  },
  {
    id: "shoes",
    title: "신발 세척",
    group: "세척",
    summary: "소재와 형태가 제각각인 신발을 한 공정에서",
    points: ["천·가죽·합성 소재 갑피를 상하지 않게 하는 모 강도", "밑창 홈 사이의 흙과 이물까지 닿는 모 배열", "크기·형태가 다른 신발에 고르게 닿는 브러쉬 형상"],
    keywords: ["신발", "운동화", "구두", "밑창", "슈즈"],
  },
  {
    id: "seafood",
    title: "수산물 세척 (가리비 등)",
    group: "세척",
    summary: "울퉁불퉁한 껍데기의 부착물을, 깨뜨리지 않고",
    points: ["불규칙한 껍데기 홈 속 뻘·부착물까지 닿는 모 밀도", "껍데기 파손을 막는 접촉 압력과 모 강도", "식품 위생 기준과 물을 계속 쓰는 환경"],
    keywords: ["가리비", "조개", "패류", "수산", "굴", "홍합", "전복", "어패", "해산물"],
  },
  {
    id: "produce",
    title: "농산물 세척 (무 등)",
    group: "세척",
    summary: "흙은 확실히, 껍질은 상하지 않게",
    points: ["잔뿌리와 표면 굴곡에 낀 흙을 털어내는 세척력", "껍질 상처를 막아 상품성을 지키는 모 강도", "크기 편차가 큰 농산물을 연속으로 처리하는 구조와 식품 위생"],
    keywords: ["무", "농산물", "채소", "야채", "감자", "당근", "뿌리", "고구마", "흙"],
  },
  {
    id: "steel-surface",
    title: "철강 표면 세척",
    group: "세척",
    summary: "쉬지 않고 흐르는 라인에서, 표면 품질에 흔적 없이",
    points: ["넓은 폭 전체에 고르게 닿는 길이와 모 배열", "표면에 긁힘을 남기지 않는 모 소재와 접촉 조건", "연속 가동에 따른 마모와 교체 주기"],
    keywords: ["철강", "강판", "코일", "스틸", "철판", "제철", "압연"],
  },
  {
    id: "steel-water",
    title: "철강 물기 제거",
    group: "물기·이물질 제거",
    summary: "남은 물기 한 줄이 얼룩과 녹으로 이어지는 공정",
    points: ["폭 전체의 물기를 빈틈없이 걷어내는 밀착 구조", "세척·냉각 직후의 물·온도 조건에 맞는 소재", "고속으로 지나가는 소재와의 지속 접촉에 따른 마모"],
    keywords: ["물기", "탈수", "수분", "물 제거", "와이핑", "건조"],
  },
  {
    id: "abrasive",
    title: "연마·표면 처리",
    group: "연마·표면 처리",
    summary: "같은 \"연마\"도 목적과 대상마다 완전히 다른 설계",
    points: ["버 제거·스케일 제거·표면 정리 등 목적에 따른 연마력", "평면·곡면·모서리 등 대상 형상에 맞춘 모양과 크기", "연마력과 브러쉬 수명 사이의 균형"],
    keywords: ["연마", "버", "디버링", "녹", "스케일", "표면처리", "샌딩", "광택", "사상"],
  },
];

const PARTICLES = ["", "을", "를", "이", "가", "은", "는", "의", "도", "와", "과", "에", "로", "류", "들"];

/** 입력 문장에서 적용 분야를 찾는다. "무엇" 같은 단어가 "무"로 잘못 걸리지 않도록 한 글자 검색어는 단어(+조사) 단위로만 비교한다. */
export function matchApplications(text: string, list: Application[] = applications): Application[] {
  const normalized = text.toLowerCase();
  const tokens = normalized.split(/[\s,./·()\[\]!?'"~\-]+/).filter(Boolean);
  const hit = (kw: string) =>
    kw.length === 1
      ? tokens.some((t) => PARTICLES.some((p) => t === kw + p))
      : normalized.includes(kw.toLowerCase());
  return list.filter((a) => a.keywords.some(hit) || normalized.includes(a.title.toLowerCase()));
}
