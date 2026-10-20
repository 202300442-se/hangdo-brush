// BrushFinder UI → BrushFinderService → (지금) LocalBrushEngine
//                                     → (11월~) POST /api/brush-finder
// UI는 이 서비스만 호출하므로 엔진을 바꿔도 화면 코드는 바뀌지 않는다.

import type { FinderAnswers, FinderResult } from "@/features/finder/types";

export class BrushFinderError extends Error {
  constructor(
    message: string,
    public readonly reason: "rules-unavailable" | "simulated" | "unknown",
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

export async function getRecommendation(
  answers: FinderAnswers,
  { simulateError = false, minDelayMs = 600 }: BrushFinderOptions = {},
): Promise<FinderResult> {
  const started = Date.now();
  try {
    // 규칙 데이터는 별도 청크로 불러온다 — 실패 시 오류 상태로 안내한다.
    const [{ brushRules }, { recommend }] = await Promise.all([
      import("@/data/brush-rules"),
      import("@/features/finder/engine"),
    ]);
    if (simulateError) throw new BrushFinderError("검증용 오류 재현", "simulated");
    if (!Array.isArray(brushRules) || brushRules.length === 0)
      throw new BrushFinderError("추천 규칙을 불러오지 못했습니다.", "rules-unavailable");
    const result = recommend(answers, brushRules);
    const elapsed = Date.now() - started;
    if (elapsed < minDelayMs) await wait(minDelayMs - elapsed);
    return result;
  } catch (err) {
    const elapsed = Date.now() - started;
    if (elapsed < minDelayMs) await wait(minDelayMs - elapsed);
    if (err instanceof BrushFinderError) throw err;
    throw new BrushFinderError("추천 데이터를 불러오는 중 문제가 생겼습니다.", "unknown");
  }
}
