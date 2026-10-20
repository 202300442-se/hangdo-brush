import { describe, expect, it } from "vitest";
import { matchApplications } from "@/data/applications";
import { buildBrief, neededInfo } from "./engine";
import { buildMailto, buildSummary } from "./summary";
import { emptyAnswers, type FinderAnswers } from "./types";
import { firstInvalidStep, validateStep } from "./validation";

const TODAY = new Date("2026-10-20T21:00:00+09:00");
const base = (p: Partial<FinderAnswers>): FinderAnswers => ({ ...emptyAnswers, ...p });

describe("개발 의뢰서 엔진", () => {
  it("T-U01 가리비 세척 → 의뢰 요약 + 유사 적용 분야 '수산물 세척'", () => {
    const b = buildBrief(base({ goal: "wash", target: "가리비", outcome: "껍질 손상 없이 뻘 제거" }));
    expect(b.headline).toBe("가리비 — 세척 (껍질 손상 없이 뻘 제거)용 브러쉬 개발 의뢰");
    expect(b.similar.map((s) => s.id)).toEqual(["seafood"]);
    expect(b.known).toContainEqual(["대상물", "가리비"]);
  });

  it("T-U02 유사 적용 분야가 없으면 빈 배열 (빈 결과)", () => {
    const b = buildBrief(base({ goal: "other", goalOther: "반도체 웨이퍼 이송", target: "웨이퍼 캐리어" }));
    expect(b.similar).toHaveLength(0);
    expect(b.needed.length).toBeGreaterThan(0);
  });

  it("T-U03 기술 질문을 모두 '잘 모르겠습니다'로 답해도 의뢰서가 만들어지고, 필요한 정보가 이유와 함께 정리된다", () => {
    const b = buildBrief(
      base({ goal: "dewater", target: "냉연 강판", method: "unknown", motion: "unknown", environments: ["unknown"], sensitivity: "unknown", sizeUnknown: true }),
    );
    const items = b.needed.map((n) => n.item);
    expect(items).toEqual(expect.arrayContaining(["현재 작업 방식", "사용 환경 (물·약품·온도·식품 접촉)", "장착 공간·치수"]));
    expect(b.needed.every((n) => n.why.length > 10)).toBe(true);
    expect(b.similar.map((s) => s.id)).toContain("steel-water");
  });

  it("T-U04 소재를 추천하지 않고, 조건은 '검토 대상'으로만 표시한다", () => {
    const b = buildBrief(base({ goal: "wash", target: "무", environments: ["water", "food"], sensitivity: "delicate", materialWish: "PP" }));
    expect(b.reviewPoints.some((p) => p.includes("식품 직접 접촉"))).toBe(true);
    expect(b.reviewPoints.some((p) => p.includes('희망 소재 "PP"') && p.includes("대표가 검토"))).toBe(true);
    expect(JSON.stringify(b)).not.toMatch(/추천 소재|를 추천합니다/);
  });

  it("T-U05 회전형일 때만 RPM을 필요 정보로 묻는다", () => {
    const items = (p: Partial<FinderAnswers>) => neededInfo(base(p)).map((n) => n.item);
    expect(items({ motion: "rotary" })).toContain("회전 속도 (RPM)");
    expect(items({ motion: "fixed" })).not.toContain("회전 속도 (RPM)");
  });
});

describe("적용 분야 매칭", () => {
  it("T-U06 한 글자 검색어 '무'는 단어로만 일치 ('무엇'에는 걸리지 않음)", () => {
    expect(matchApplications("세척 전 무를 씻어야 함").map((a) => a.id)).toContain("produce");
    expect(matchApplications("무엇을 닦아야 할지").map((a) => a.id)).not.toContain("produce");
  });
  it("T-U07 기차·버스·신발 문장에서 해당 분야를 찾는다", () => {
    expect(matchApplications("지하철 전동차 외판").map((a) => a.id)).toContain("railway");
    expect(matchApplications("시내버스 세척기").map((a) => a.id)).toContain("bus");
    expect(matchApplications("운동화 밑창").map((a) => a.id)).toContain("shoes");
  });
});

describe("입력 검증", () => {
  it("T-U08 필수(작업 목적·대상) 누락 시 1단계 오류", () => {
    const e = validateStep(0, emptyAnswers, TODAY);
    expect(e.goal).toBeTruthy();
    expect(e.target).toBeTruthy();
    expect(firstInvalidStep(emptyAnswers, TODAY)).toBe(0);
  });
  it("T-U09 공백만 입력한 대상, '기타' 후 빈 내용은 오류", () => {
    expect(validateStep(0, base({ goal: "wash", target: "   " }), TODAY).target).toBeTruthy();
    expect(validateStep(0, base({ goal: "other", target: "무" }), TODAY).goalOther).toBeTruthy();
    expect(validateStep(0, base({ goal: "wash", target: "무" }), TODAY)).toEqual({});
  });
  it("T-U10 치수 문자·음수·내경≥외경, 치수 모름이면 건너뜀", () => {
    expect(validateStep(2, base({ outerDiameter: "abc" }), TODAY).outerDiameter).toContain("숫자만");
    expect(validateStep(2, base({ outerDiameter: "-5" }), TODAY).outerDiameter).toBeTruthy();
    expect(validateStep(2, base({ outerDiameter: "100", innerDiameter: "120" }), TODAY).innerDiameter).toContain("작아야");
    expect(validateStep(2, base({ sizeUnknown: true, outerDiameter: "abc" }), TODAY)).toEqual({});
  });
  it("T-U11 수량 소수·과거 납기 안내, 정상 입력은 통과", () => {
    const e = validateStep(3, base({ quantity: "2.5", dueDate: "2026-10-01" }), TODAY);
    expect(e.quantity).toContain("정수");
    expect(e.dueDate).toContain("이전");
    expect(firstInvalidStep(base({ goal: "wash", target: "버스", quantity: "4", dueDate: "2026-12-01" }), TODAY)).toBe(-1);
  });
});

describe("의뢰서 텍스트", () => {
  it("T-U12 요약에 의뢰 요약·필요 정보·대표 제안 문구가 포함된다", () => {
    const s = buildSummary(buildBrief(base({ goal: "wash", target: "버스 차체" })), "", TODAY);
    expect(s).toContain("[항도제일특수브러쉬 브러쉬 개발 의뢰서] 2026-10-20");
    expect(s).toContain("버스 차체 — 세척용 브러쉬 개발 의뢰");
    expect(s).toContain("아직 확인이 필요한 정보");
    expect(s).toContain("대표가 직접 제안");
  });
  it("T-U13 긴 요약은 mailto 본문을 줄인다", () => {
    const url = buildMailto("가".repeat(3000));
    expect(url.startsWith("mailto:hokim18@nate.com?subject=")).toBe(true);
    expect(decodeURIComponent(url).length).toBeLessThan(1700);
  });
});
