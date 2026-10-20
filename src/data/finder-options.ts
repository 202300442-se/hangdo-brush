// AI 개발 의뢰서 질문 선택지.
// 브러쉬 형태·소재를 고르게 하지 않는다 — 소재와 구조는 공정을 확인한 뒤 대표가 직접 제안한다.
// 선택지는 입력을 돕는 "예시"이며, 실제 내용은 자유 서술로 받는다.

export type Option = { id: string; label: string; hint?: string };

export const UNKNOWN = "unknown";
export const OTHER = "other";

export const goals: Option[] = [
  { id: "wash", label: "세척", hint: "흙·오염·이물을 씻어냄" },
  { id: "dewater", label: "물기 제거", hint: "세척·냉각 후 남은 물" },
  { id: "debris", label: "이물질·분진 제거", hint: "건식으로 털어냄" },
  { id: "abrasive", label: "연마·표면 처리", hint: "표면을 갈거나 다듬음" },
  { id: "descale", label: "녹·스케일·버 제거" },
  { id: "convey", label: "이송·가이드·차단", hint: "물건을 잡거나 막음" },
  { id: OTHER, label: "기타 (직접 입력)" },
];

export const methods: Option[] = [
  { id: "manual", label: "사람이 손으로 작업 중" },
  { id: "existing", label: "설비에 브러쉬를 쓰고 있음 (교체·개선)" },
  { id: "new-brush", label: "설비는 있고 브러쉬만 새로 필요" },
  { id: "new-line", label: "설비도 새로 구성 중" },
  { id: UNKNOWN, label: "잘 모르겠습니다" },
];

export const motions: Option[] = [
  { id: "rotary", label: "회전" },
  { id: "fixed", label: "고정 (대상물이 지나감)" },
  { id: "reciprocate", label: "왕복·이동" },
  { id: "hand", label: "손으로 사용" },
  { id: UNKNOWN, label: "잘 모르겠습니다" },
];

export const environments: Option[] = [
  { id: "water", label: "물 사용" },
  { id: "chemical", label: "세제·약품" },
  { id: "heat", label: "고온" },
  { id: "oil", label: "기름·절삭유" },
  { id: "food", label: "식품에 직접 닿음" },
  { id: "dust", label: "분진" },
  { id: "none", label: "특별한 조건 없음" },
  { id: UNKNOWN, label: "잘 모르겠습니다" },
];

export const sensitivity: Option[] = [
  { id: "delicate", label: "긁히거나 손상되면 안 됨" },
  { id: "normal", label: "적당히 문질러도 됨" },
  { id: "strong", label: "강하게 갈아내야 함" },
  { id: UNKNOWN, label: "잘 모르겠습니다" },
];

export const resources: Option[] = [
  { id: "photo", label: "현장·대상물 사진" },
  { id: "video", label: "작업 동영상" },
  { id: "drawing", label: "도면" },
  { id: "old-brush", label: "기존 브러쉬 (사진·샘플)" },
  { id: "object-sample", label: "대상물 샘플" },
  { id: "none", label: "아직 없음" },
];

export const labelOf = (list: Option[], id: string | undefined) =>
  list.find((o) => o.id === id)?.label;
