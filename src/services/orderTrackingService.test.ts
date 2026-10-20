import { describe, expect, it } from "vitest";
import { lookupOrder, normalizeOrderId, validateLookup } from "./orderTrackingService";

describe("주문조회 (주문번호 + 조회 코드)", () => {
  it("T-U14 빈 입력·형식 오류는 각 칸에 안내한다", () => {
    expect(validateLookup("", "")).toEqual({
      id: expect.stringContaining("입력해 주세요"),
      code: expect.stringContaining("6자리"),
    });
    expect(validateLookup("INVALID", "12ab").id).toContain("형식");
    expect(validateLookup("INVALID", "12ab").code).toContain("숫자 6자리");
    expect(validateLookup("hj-demo-001", "482 913")).toEqual({});
  });

  it("T-U15 주문번호와 조회 코드가 모두 맞으면 조회되고, 해시는 돌려주지 않는다", async () => {
    expect(normalizeOrderId(" hj-demo-001 ")).toBe("HJ-DEMO-001");
    const o = await lookupOrder(" hj-demo-001 ", "482913", { delayMs: 0 });
    expect(o?.status).toBe("제작 중");
    expect(o && "codeHash" in o).toBe(false);
  });

  it("T-U16 코드가 틀리거나 없는 주문번호면 똑같이 null (거래 여부를 드러내지 않음), 오류 재현은 예외", async () => {
    expect(await lookupOrder("HJ-DEMO-001", "000000", { delayMs: 0 })).toBeNull();
    expect(await lookupOrder("HJ-DEMO-999", "482913", { delayMs: 0 })).toBeNull();
    await expect(lookupOrder("HJ-DEMO-001", "482913", { delayMs: 0, simulateError: true })).rejects.toThrow();
  });
});
