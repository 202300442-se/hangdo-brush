import { describe, expect, it } from "vitest";
import { findOrder, normalizeOrderId, validateOrderId } from "./orderTrackingService";

describe("주문조회", () => {
  it("T-U14 빈 입력·형식 오류는 안내 문구를 돌려준다", () => {
    expect(validateOrderId("  ")).toContain("입력해 주세요");
    expect(validateOrderId("INVALID")).toContain("형식");
    expect(validateOrderId("hj-demo-001")).toBeNull();
  });
  it("T-U15 소문자·공백 입력도 정규화해 조회한다", async () => {
    expect(normalizeOrderId(" hj-demo-001 ")).toBe("HJ-DEMO-001");
    expect((await findOrder(" hj-demo-001 ", { delayMs: 0 }))?.status).toBe("제작 중");
  });
  it("T-U16 없는 번호는 null, 오류 재현은 예외", async () => {
    expect(await findOrder("HJ-DEMO-999", { delayMs: 0 })).toBeNull();
    await expect(findOrder("HJ-DEMO-001", { delayMs: 0, simulateError: true })).rejects.toThrow();
  });
});
