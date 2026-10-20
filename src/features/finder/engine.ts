// 로컬 규칙 기반 추천 엔진 (순수 함수 — UI·네트워크와 무관하게 테스트 가능)
// 11월 이후: 같은 입력/출력 형태를 유지한 채 서버 API(LLM + 회사 지식)로 교체한다.

import type { BrushRule } from "@/data/brush-rules";
import { OTHER, UNKNOWN, labelOf, materials, shapes } from "@/data/finder-options";
import type { Candidate, FinderAnswers, FinderResult } from "./types";

const known = (v: string) => v !== "" && v !== UNKNOWN;

function pushUnique(list: Candidate[], c: Candidate) {
  if (!list.some((x) => x.id === c.id)) list.push(c);
}

export function matchRules(a: FinderAnswers, rules: BrushRule[]): BrushRule[] {
  if (!a.purpose || a.purpose === OTHER) return [];
  return rules.filter(
    (r) => r.purposes.includes(a.purpose) && (!r.targets || r.targets.includes(a.target)),
  );
}

export function missingSpecs(a: FinderAnswers): string[] {
  const m: string[] = [];
  if (a.sizeUnknown || !a.outerDiameter) m.push("외경 (브러쉬 바깥 지름)");
  if (a.sizeUnknown || !a.length) m.push("길이 또는 모 폭");
  if (a.sizeUnknown || !a.innerDiameter) m.push("축경·내경 (장착부 치수)");
  if (!known(a.motion)) m.push("설치·회전 방식");
  if (a.motion !== "fixed" && !a.rpm) m.push("회전 속도 (RPM)");
  if (a.environments.length === 0 || a.environments.includes(UNKNOWN)) m.push("사용 환경 (물·약품·온도 등)");
  if (!known(a.currentBrush)) m.push("현재 사용 중인 브러쉬 정보");
  if (!a.attachment || a.attachment === "none") m.push("사진 또는 도면");
  if (!a.quantity) m.push("수량");
  if (!a.dueDate) m.push("희망 납기");
  return m;
}

function cautionsFor(a: FinderAnswers, rules: BrushRule[]): string[] {
  const c = new Set<string>();
  rules.forEach((r) => r.cautions?.forEach((x) => c.add(x)));
  if (a.environments.includes("heat"))
    c.add("고온 환경: 모 소재와 고정 방식이 온도 조건에 맞는지 기술 검토가 필요합니다.");
  if (a.environments.includes("chemical"))
    c.add("약품 환경: 사용하는 약품 이름과 농도를 알려주시면 소재 검토가 빨라집니다.");
  const foodContext = a.purpose === "food" || a.target === "food" || a.industry === "food";
  if (foodContext && ["steel-wire", "sus-wire", "brass-wire", "knot-wire"].includes(a.material))
    c.add("식품 공정에서 금속 와이어 소재를 쓰려면 기술 담당자 검토가 필요합니다.");
  if (a.currentBrush === "improve")
    c.add("기존 브러쉬의 문제(마모·모 빠짐·세척력 등)를 함께 알려주시면 개선 방향을 검토할 수 있습니다.");
  return [...c];
}

export function recommend(a: FinderAnswers, rules: BrushRule[]): FinderResult {
  const matched = matchRules(a, rules);
  const shapeList: Candidate[] = [];
  const materialList: Candidate[] = [];

  // 고객이 직접 고른 형태·소재는 항상 검토 대상으로 먼저 보여 준다.
  if (known(a.shape)) {
    const inRule = matched.some((r) => r.shapes.some((s) => s.id === a.shape));
    pushUnique(shapeList, {
      id: a.shape,
      label: labelOf(shapes, a.shape) ?? a.shape,
      reason: inRule ? "선택하신 형태이며 작업 목적과도 일치합니다." : "선택하신 형태 — 작업 목적과의 적합성 검토가 필요합니다.",
    });
  }
  if (known(a.material)) {
    const inRule = matched.some((r) => r.materials.some((m) => m.id === a.material));
    pushUnique(materialList, {
      id: a.material,
      label: labelOf(materials, a.material) ?? a.material,
      reason: inRule ? "희망하신 소재이며 작업 목적과도 일치합니다." : "희망하신 소재 — 작업 조건과의 적합성 검토가 필요합니다.",
    });
  }

  for (const r of matched) {
    r.shapes.forEach((s) => pushUnique(shapeList, { ...s, reason: r.reason }));
    r.materials.forEach((m) => pushUnique(materialList, { ...m, reason: r.reason }));
  }

  return {
    kind: matched.length > 0 ? "matched" : "unmatched",
    ruleIds: matched.map((r) => r.id),
    shapes: shapeList,
    materials: materialList,
    missing: missingSpecs(a),
    cautions: cautionsFor(a, matched),
  };
}
