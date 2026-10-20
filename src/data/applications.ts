// 적용 분야 — 2026-10-20 대표 인터뷰에서 실제 제작 경험이 있다고 확인한 분야.
// 세부 사양·납품처는 공개하지 않는다. 항목 추가 시 이 파일만 수정한다.

export type Application = {
  id: string;
  title: string;
  group: "세척" | "물기·이물질 제거" | "연마·표면 처리";
  summary: string;
  /** 의뢰서 입력과 맞춰 보는 검색어. 한 글자 검색어는 단어 단위로만 일치시킨다. */
  keywords: string[];
};

export const applications: Application[] = [
  {
    id: "railway",
    title: "철도 차량 세척",
    group: "세척",
    summary: "기차·전동차처럼 크고 긴 차체를 세척하는 설비용 브러쉬",
    keywords: ["기차", "열차", "철도", "전동차", "지하철", "객차", "차체"],
  },
  {
    id: "bus",
    title: "버스 세척",
    group: "세척",
    summary: "버스 차체 세척 설비에 장착하는 브러쉬",
    keywords: ["버스", "세차", "차량", "차체", "자동차"],
  },
  {
    id: "shoes",
    title: "신발 세척",
    group: "세척",
    summary: "신발 표면과 밑창을 세척하는 브러쉬",
    keywords: ["신발", "운동화", "구두", "밑창", "슈즈"],
  },
  {
    id: "seafood",
    title: "수산물 세척 (가리비 등)",
    group: "세척",
    summary: "가리비 같은 패류·수산물 표면을 세척하는 브러쉬",
    keywords: ["가리비", "조개", "패류", "수산", "굴", "홍합", "전복", "어패", "해산물"],
  },
  {
    id: "produce",
    title: "농산물 세척 (무 등)",
    group: "세척",
    summary: "무 같은 뿌리채소·농산물의 흙과 이물질을 씻어내는 브러쉬",
    keywords: ["무", "농산물", "채소", "야채", "감자", "당근", "뿌리", "고구마", "흙"],
  },
  {
    id: "steel-surface",
    title: "철강 표면 세척",
    group: "세척",
    summary: "철강 소재 표면의 오염·이물질을 닦아내는 브러쉬",
    keywords: ["철강", "강판", "코일", "스틸", "철판", "제철", "압연"],
  },
  {
    id: "steel-water",
    title: "철강 물기 제거",
    group: "물기·이물질 제거",
    summary: "세척·냉각 후 철강 표면에 남은 물기를 제거하는 브러쉬",
    keywords: ["물기", "탈수", "수분", "물 제거", "와이핑", "건조"],
  },
  {
    id: "abrasive",
    title: "연마·표면 처리",
    group: "연마·표면 처리",
    summary: "용도에 따라 모양과 크기가 모두 달라지는 연마용 브러쉬 — 공정마다 새로 설계",
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
