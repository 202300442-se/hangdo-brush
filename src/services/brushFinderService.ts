// 개발 의뢰서 UI → BrushFinderService → (지금) 로컬 의뢰서 엔진
//                                    → (11월~) POST /api/dev-brief (LLM + 회사 지식)
// UI는 이 서비스만 호출하므로 엔진을 바꿔도 화면 코드는 바뀌지 않는다.

import type { DevBrief, FinderAnswers } from "@/features/finder/types";

export class BrushFinderError extends Error {
  constructor(
    message: string,
    public readonly reason: "data-unavailable" | "simulated" | "unknown",
  ) {
    super(message);
    this.name = "BrushFinderError";
  }
}

export type BrushFinderOptions = {
  /** 검증용: 오류 상태를 재현한다 (?simulate=error) */
  simulateError?: boolean;
  /** 로딩 상태를 보여 주기 위한 최소 지연(ms) */
  minDelayMs?: number;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function createBrief(
  answers: FinderAnswers,
  { simulateError = false, minDelayMs = 600 }: BrushFinderOptions = {},
): Promise<DevBrief> {
  const started = Date.now();
  const finish = async () => {
    const elapsed = Date.now() - started;
    if (elapsed < minDelayMs) await wait(minDelayMs - elapsed);
  };
  try {
    // 적용 분야 데이터와 엔진은 별도 청크로 불러온다 — 실패 시 오류 상태로 안내한다.
    const [{ applications }, { buildBrief }] = await Promise.all([
      import("@/data/applications"),
      import("@/features/finder/engine"),
    ]);
    if (simulateError) throw new BrushFinderError("검증용 오류 재현", "simulated");
    if (!Array.isArray(applications)) throw new BrushFinderError("적용 분야 데이터를 불러오지 못했습니다.", "data-unavailable");
    const brief = buildBrief(answers, applications);
    await finish();
    return brief;
  } catch (err) {
    await finish();
    if (err instanceof BrushFinderError) throw err;
    throw new BrushFinderError("의뢰서를 만드는 중 문제가 생겼습니다.", "unknown");
  }
}
