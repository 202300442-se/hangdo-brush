/** 사용자가 Brush Finder에 입력한 답변. 모든 값은 문자열로 보관하고 검증 단계에서 해석한다. */
export type FinderAnswers = {
  purpose: string;
  purposeOther: string;
  problem: string;
  target: string;
  targetOther: string;
  industry: string;
  motion: string;
  shape: string;
  currentBrush: string;
  sizeUnknown: boolean;
  outerDiameter: string;
  length: string;
  innerDiameter: string;
  rpm: string;
  environments: string[];
  material: string;
  quantity: string;
  dueDate: string;
  attachment: string;
  memo: string;
};

export const emptyAnswers: FinderAnswers = {
  purpose: "",
  purposeOther: "",
  problem: "",
  target: "",
  targetOther: "",
  industry: "",
  motion: "",
  shape: "",
  currentBrush: "",
  sizeUnknown: false,
  outerDiameter: "",
  length: "",
  innerDiameter: "",
  rpm: "",
  environments: [],
  material: "",
  quantity: "",
  dueDate: "",
  attachment: "",
  memo: "",
};

export type FieldErrors = Partial<Record<keyof FinderAnswers, string>>;

export type Candidate = { id: string; label: string; reason: string };

export type FinderResult = {
  /** matched: 규칙 일치 / unmatched: 일치 규칙 없음(빈 결과) */
  kind: "matched" | "unmatched";
  ruleIds: string[];
  shapes: Candidate[];
  materials: Candidate[];
  /** 아직 확인되지 않은 규격 — 담당자가 다시 물어볼 항목 */
  missing: string[];
  /** 기술 검토가 꼭 필요한 조건 */
  cautions: string[];
};
