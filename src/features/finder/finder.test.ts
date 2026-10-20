import { describe, expect, it } from "vitest";
import { brushRules } from "@/data/brush-rules";
import { recommend, missingSpecs } from "./engine";
import { buildMailto, buildSummary } from "./summary";
import { emptyAnswers, type FinderAnswers } from "./types";
import { firstInvalidStep, validateStep } from "./validation";

const TODAY = new Date("2026-10-20T09:00:00+09:00");
const base = (p: Partial<FinderAnswers>): FinderAnswers => ({ ...emptyAnswers, ...p });

describe("추천 엔진", () => {
  it("T-U01 녹 제거 + 철 → 와이어 롤/휠, 스틸 와이어 후보", () => {
    const r = recommend(base({ purpose: "rust", target: "steel" }), brushRules);
    expect(r.kind).toBe("matched");
    expect(r.ruleIds).toEqual(["R01-rust-metal"]);
    expect(r.shapes.map((s) => s.id)).toEqual(["roll", "wheel"]);
    expect(r.materials.map((m) => m.id)).toContain("steel-wire");
  });

  it("T-U02 '기타' 목적은 일치 규칙이 없어 빈 결과(unmatched)", () => {
    const r = recommend(base({ purpose: "other", purposeOther: "특수 공정", target: "steel" }), brushRules);
    expect(r.kind).toBe("unmatched");
    expect(r.shapes).toHaveLength(0);
    expect(r.missing.length).toBeGreaterThan(0);
  });

  it("T-U03 모든 기술 질문에 '잘 모르겠습니다'를 골라도 결과와 확인 필요 규격이 나온다", () => {
    const r = recommend(
      base({
        purpose: "wash",
        target: "conveyor",
        industry: "unknown",
        motion: "unknown",
        shape: "unknown",
        currentBrush: "unknown",
        sizeUnknown: true,
        environments: ["unknown"],
        material: "unknown",
      }),
      brushRules,
    );
    expect(r.kind).toBe("matched");
    expect(r.missing).toEqual(
      expect.arrayContaining(["외경 (브러쉬 바깥 지름)", "설치·회전 방식", "사용 환경 (물·약품·온도 등)"]),
    );
  });

  it("T-U04 고객이 고른 소재가 규칙과 다르면 '적합성 검토 필요'로 표시", () => {
    const r = recommend(base({ purpose: "food", target: "food", material: "steel-wire" }), brushRules);
    expect(r.materials[0]).toMatchObject({ id: "steel-wire" });
    expect(r.materials[0].reason).toContain("검토가 필요");
    expect(r.cautions.some((c) => c.includes("금속 와이어"))).toBe(true);
  });

  it("T-U05 고정형이면 RPM을 확인 필요 항목에서 뺀다", () => {
    expect(missingSpecs(base({ motion: "fixed" }))).not.toContain("회전 속도 (RPM)");
    expect(missingSpecs(base({ motion: "rotary" }))).toContain("회전 속도 (RPM)");
  });
});

describe("입력 검증", () => {
  it("T-U06 필수(작업 목적·대상물) 누락 시 1단계 오류", () => {
    const e = validateStep(0, emptyAnswers, TODAY);
    expect(e.purpose).toBeTruthy();
    expect(e.target).toBeTruthy();
    expect(firstInvalidStep(emptyAnswers, TODAY)).toBe(0);
  });

  it("T-U07 '기타' 선택 후 내용을 비우면 오류", () => {
    expect(validateStep(0, base({ purpose: "other", target: "steel" }), TODAY).purposeOther).toBeTruthy();
  });

  it("T-U08 치수에 문자·음수·내경≥외경 입력 시 안내", () => {
    expect(validateStep(2, base({ outerDiameter: "abc" }), TODAY).outerDiameter).toContain("숫자만");
    expect(validateStep(2, base({ outerDiameter: "-5" }), TODAY).outerDiameter).toBeTruthy();
    expect(validateStep(2, base({ outerDiameter: "100", innerDiameter: "120" }), TODAY).innerDiameter).toContain("작아야");
  });

  it("T-U09 치수를 모른다고 체크하면 치수 검증을 건너뛴다", () => {
    expect(validateStep(2, base({ sizeUnknown: true, outerDiameter: "abc" }), TODAY)).toEqual({});
  });

  it("T-U10 수량 소수·과거 납기 입력 시 안내", () => {
    const e = validateStep(3, base({ quantity: "2.5", dueDate: "2026-10-01" }), TODAY);
    expect(e.quantity).toContain("정수");
    expect(e.dueDate).toContain("이전");
  });

  it("T-U11 정상 입력은 오류 없음", () => {
    const a = base({ purpose: "rust", target: "steel", outerDiameter: "200", innerDiameter: "50", quantity: "10", dueDate: "2026-11-30" });
    expect(firstInvalidStep(a, TODAY)).toBe(-1);
  });
});

describe("문의 요약", () => {
  it("T-U12 요약에 미확인 항목·면책 문구·회사명이 포함된다", () => {
    const a = base({ purpose: "rust", target: "steel" });
    const s = buildSummary(a, recommend(a, brushRules), TODAY);
    expect(s).toContain("항도제일특수브러쉬");
    expect(s).toContain("작업 목적: 녹·스케일 제거");
    expect(s).toContain("수량: 미확인");
    expect(s).toContain("기술 담당자 검토 후 확정");
  });

  it("T-U13 긴 요약은 mailto 본문을 줄인다", () => {
    const url = buildMailto("가".repeat(3000));
    expect(url.startsWith("mailto:hokim18@nate.com?subject=")).toBe(true);
    expect(decodeURIComponent(url).length).toBeLessThan(1700);
  });
});
