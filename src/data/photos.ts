// 회사 제공 실사 사진 (2026-10 촬영본, 원본: photos-raw/ — 저장소 제외)
// 변환: scripts/optimize-photos.mjs (크기·압축만, 보정·합성 없음)
// category·alt는 사진을 보고 추정한 것으로, 회사 확인 전까지 "추정"으로 취급한다.
// TODO: COMPANY EXPERT REVIEW REQUIRED — 제품 형태·소재 분류 확인

export type PhotoCategory = "roll" | "wheel" | "cup" | "core" | "process";

export type Photo = {
  id: string;
  alt: string;
  category: PhotoCategory;
  /** 가로:세로 비율 (원본 기준) */
  ratio: number;
};

export const photos: Photo[] = [
  { id: "roll-abrasive-grey", alt: "회색 모가 촘촘히 심어진 축 일체형 롤 브러쉬 7개가 공장 바닥에 나란히 놓여 있다", category: "roll", ratio: 1.5 },
  { id: "roll-steel-wire", alt: "와이어 모가 심어진 원통형 롤 브러쉬 4개가 팔레트 위에 놓여 있다", category: "roll", ratio: 1.5 },
  { id: "roll-brass-wire", alt: "금색 황동 계열 와이어로 만든 긴 롤 브러쉬 여러 개가 세워져 있다", category: "roll", ratio: 1.5 },
  { id: "roll-blue-filament-front", alt: "파란색 합성수지 모가 나선형으로 심어진 롤 브러쉬 4개", category: "roll", ratio: 1.5 },
  { id: "roll-blue-filament-stack", alt: "파란색 모 롤 브러쉬 수십 개가 팔레트 위에 쌓여 있다", category: "roll", ratio: 1.5 },
  { id: "roll-knot-wire-top", alt: "꼬임 와이어 다발이 방사형으로 촘촘하게 배열된 원통형 브러쉬", category: "roll", ratio: 1.5 },
  { id: "roll-knot-wire-side", alt: "꼬임 와이어 원통형 브러쉬 2개를 옆에서 본 모습", category: "roll", ratio: 1.5 },
  { id: "wheel-mixed-wire-nylon", alt: "황동·스틸 와이어와 흰색 합성수지 모로 만든 휠 브러쉬 5종", category: "wheel", ratio: 1.5 },
  { id: "wheel-crimped-pile", alt: "웨이브 와이어 휠 브러쉬 수십 개가 쌓여 있다", category: "wheel", ratio: 1.5 },
  { id: "wheel-crimped-box", alt: "상자에 담긴 웨이브 와이어 휠 브러쉬를 위에서 본 모습", category: "wheel", ratio: 1.5 },
  { id: "wheel-knot-set-a", alt: "크기와 허브 형태가 다른 꼬임 와이어 휠 브러쉬 8종", category: "wheel", ratio: 1.5 },
  { id: "wheel-knot-set-b", alt: "꼬임 와이어 휠 브러쉬 7종을 흰 배경에 배열한 모습", category: "wheel", ratio: 1.5 },
  { id: "wheel-knot-hangdo-mark", alt: "HANG DO JE IL과 MADE IN KOREA 각인이 있는 꼬임 와이어 휠 브러쉬", category: "wheel", ratio: 1.5 },
  { id: "cup-knot-set", alt: "꼬임 와이어 컵 브러쉬와 휠 브러쉬 6종", category: "cup", ratio: 1.5 },
  { id: "core-white-pair-top", alt: "볼트 구멍이 일정 간격으로 있는 흰색 원통형 롤 코어 2개", category: "core", ratio: 1.5 },
  { id: "core-white-pair-detail", alt: "흰색 롤 코어 끝부분과 스테인리스 축을 가까이서 본 모습", category: "core", ratio: 1.5 },
  { id: "core-white-pair-angle", alt: "흰색 롤 코어 2개를 비스듬히 본 모습", category: "core", ratio: 1.5 },
  { id: "machine-knot-wheel", alt: "생산 설비에 물린 원판에 꼬임 와이어 다발이 차례로 심어지고 있다", category: "process", ratio: 1.5 },
  { id: "machine-knot-detail", alt: "설비가 와이어를 꼬아 원판 구멍에 심는 장면을 가까이서 본 모습", category: "process", ratio: 1.5 },
  { id: "wire-spools", alt: "와이어 원자재가 감긴 보빈들이 거치대에 걸려 설비로 공급되고 있다", category: "process", ratio: 1.5 },
];

export const photoById = (id: string) => {
  const p = photos.find((x) => x.id === id);
  if (!p) throw new Error(`photo not found: ${id}`);
  return p;
};

export const categoryLabel: Record<PhotoCategory, string> = {
  roll: "롤 브러쉬",
  wheel: "휠 브러쉬",
  cup: "컵 브러쉬",
  core: "롤 코어",
  process: "제작 공정",
};
