/** AI 개발 의뢰서 입력값. 모든 값은 문자열로 보관하고 검증 단계에서 해석한다. */
export type FinderAnswers = {
  goal: string;
  goalOther: string;
  target: string;
  outcome: string;
  problem: string;
  method: string;
  motion: string;
  equipment: string;
  environments: string[];
  sensitivity: string;
  sizeUnknown: boolean;
  outerDiameter: string;
  length: string;
  innerDiameter: string;
  rpm: string;
  materialWish: string;
  quantity: string;
  dueDate: string;
  resources: string[];
  memo: string;
};

export const emptyAnswers: FinderAnswers = {
  goal: "",
  goalOther: "",
  target: "",
  outcome: "",
  problem: "",
  method: "",
  motion: "",
  equipment: "",
  environments: [],
  sensitivity: "",
  sizeUnknown: false,
  outerDiameter: "",
  length: "",
  innerDiameter: "",
  rpm: "",
  materialWish: "",
  quantity: "",
  dueDate: "",
  resources: [],
  memo: "",
};

export type FieldErrors = Partial<Record<keyof FinderAnswers, string>>;

/** 아직 모르는 정보 + 그 정보가 왜 필요한지 */
export type NeededInfo = { item: string; why: string };

export type DevBrief = {
  /** 한 줄 의뢰 요약 */
  headline: string;
  /** 확인된 조건 (라벨, 값) */
  known: [string, string][];
  /** 대표가 판단하려면 더 필요한 정보 */
  needed: NeededInfo[];
  /** 기술 검토 포인트 — 추천이 아니라 "검토할 항목" */
  reviewPoints: string[];
  /** 보내 주시면 좋은 자료 */
  prepare: string[];
  /** 유사 적용 분야 (없으면 빈 배열 = 빈 결과) */
  similar: { id: string; title: string; summary: string }[];
};
