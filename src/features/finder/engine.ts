// 개발 의뢰서 생성 엔진 (순수 함수 — UI·네트워크와 무관하게 테스트 가능)
// 브러쉬 형태·소재를 추천하지 않는다. 고객의 문제를 구조화해 대표가 바로 판단할 수 있게 정리한다.
// 11월 이후: 같은 입력/출력 형태를 유지한 채 서버 API(LLM + 회사 지식)로 교체한다.

import { type Application, matchApplications } from "@/data/applications";
import {
  OTHER,
  UNKNOWN,
  environments,
  goals,
  labelOf,
  methods,
  motions,
  resources,
  sensitivity,
} from "@/data/finder-options";
import type { DevBrief, FinderAnswers, NeededInfo } from "./types";

const known = (v: string) => v.trim() !== "" && v !== UNKNOWN;

export function goalText(a: FinderAnswers) {
  if (a.goal === OTHER) return a.goalOther.trim() || "기타 작업";
  return labelOf(goals, a.goal) ?? "";
}

export function neededInfo(a: FinderAnswers): NeededInfo[] {
  const n: NeededInfo[] = [];
  if (!known(a.outcome))
    n.push({ item: "원하는 결과", why: "어느 정도로 닦이거나 다듬어져야 하는지에 따라 모의 강도와 밀도가 달라집니다." });
  if (!known(a.method))
    n.push({ item: "현재 작업 방식", why: "기존 설비·브러쉬가 있으면 그 조건에 맞춰 개발 범위를 정합니다." });
  if (!known(a.motion))
    n.push({ item: "브러쉬 움직임 (회전·고정·왕복)", why: "몸체 구조와 모 배열을 정하는 기준입니다." });
  if (a.environments.length === 0 || a.environments.includes(UNKNOWN))
    n.push({ item: "사용 환경 (물·약품·온도·식품 접촉)", why: "모와 몸체 소재를 고르는 가장 중요한 조건입니다." });
  if (!known(a.sensitivity))
    n.push({ item: "대상물 표면의 민감도", why: "긁힘이 허용되는지에 따라 모 굵기와 소재가 달라집니다." });
  if (a.sizeUnknown || (!a.outerDiameter && !a.length && !a.innerDiameter))
    n.push({ item: "장착 공간·치수", why: "설비에 맞는 크기와 축·고정 방식을 설계하는 데 필요합니다." });
  if (a.motion === "rotary" && !a.rpm)
    n.push({ item: "회전 속도 (RPM)", why: "회전 속도에 따라 모 길이와 고정 강도를 검토합니다." });
  if (!a.quantity) n.push({ item: "수량", why: "시제품 수량과 양산 수량에 따라 제작 방식이 달라집니다." });
  if (!a.dueDate) n.push({ item: "희망 납기", why: "시제품·테스트 일정을 잡는 데 필요합니다." });
  return n;
}

export function reviewPoints(a: FinderAnswers): string[] {
  const p: string[] = [];
  const env = new Set(a.environments);
  if (env.has("food")) p.push("식품 직접 접촉 — 위생 기준과 소재 적합성 검토 대상");
  if (env.has("water")) p.push("물 사용 — 모와 몸체의 내수성 검토 대상");
  if (env.has("chemical")) p.push("세제·약품 사용 — 내약품성 검토 대상 (약품 이름과 농도를 알려주시면 좋습니다)");
  if (env.has("heat")) p.push("고온 환경 — 모 소재와 고정 방식의 내열성 검토 대상");
  if (env.has("oil")) p.push("기름·절삭유 — 모 소재의 내유성 검토 대상");
  if (a.sensitivity === "delicate") p.push("표면 손상 불가 — 모 굵기·강도와 접촉 압력 검토 대상");
  if (a.sensitivity === "strong") p.push("강한 연마 필요 — 연마력과 모 마모 수명의 균형 검토 대상");
  if (a.method === "existing") p.push("기존 브러쉬 교체·개선 — 현재 브러쉬의 문제(마모·모 빠짐·성능)를 먼저 확인");
  if (a.method === "new-line") p.push("신규 설비 — 설비 설계 단계에서 브러쉬 치수·장착 방식을 함께 정하면 유리");
  if (known(a.materialWish)) p.push(`희망 소재 "${a.materialWish.trim()}" — 공정 조건에 맞는지 대표가 검토 후 제안`);
  return p;
}

export function prepareList(a: FinderAnswers): string[] {
  const r = new Set(a.resources);
  const list: string[] = [];
  if (!r.has("photo") && !r.has("video")) list.push("작업 현장과 대상물 사진, 가능하면 10초 정도의 작업 영상");
  if (a.method === "existing" && !r.has("old-brush")) list.push("지금 쓰는 브러쉬 사진과 치수 (또는 실물 샘플)");
  if (a.method === "new-line" && !r.has("drawing")) list.push("설비 도면 또는 장착부 치수");
  if (!r.has("object-sample") && (a.environments.includes("food") || a.sensitivity === "delicate"))
    list.push("대상물 샘플 (브러쉬 검토·테스트용)");
  return list;
}

export function similarApplications(a: FinderAnswers, list?: Application[]) {
  const text = [a.target, goalText(a), a.equipment, a.problem].join(" ");
  return matchApplications(text, list).map(({ id, title, summary }) => ({ id, title, summary }));
}

export function buildBrief(a: FinderAnswers, list?: Application[]): DevBrief {
  const goal = goalText(a);
  const target = a.target.trim();
  const headline = `${target} — ${goal}${known(a.outcome) ? ` (${a.outcome.trim()})` : ""}용 브러쉬 개발 의뢰`;

  const k: [string, string][] = [
    ["작업 목적", goal],
    ["대상물", target],
  ];
  if (known(a.outcome)) k.push(["원하는 결과", a.outcome.trim()]);
  if (known(a.problem)) k.push(["현재 문제", a.problem.trim()]);
  if (known(a.method)) k.push(["작업 방식", labelOf(methods, a.method) ?? a.method]);
  if (known(a.motion)) k.push(["움직임", labelOf(motions, a.motion) ?? a.motion]);
  if (known(a.equipment)) k.push(["설비·공간", a.equipment.trim()]);
  const env = a.environments.filter((e) => e !== UNKNOWN);
  if (env.length) k.push(["사용 환경", env.map((e) => labelOf(environments, e) ?? e).join(", ")]);
  if (known(a.sensitivity)) k.push(["표면 민감도", labelOf(sensitivity, a.sensitivity) ?? a.sensitivity]);
  if (!a.sizeUnknown) {
    const size = [
      a.outerDiameter && `외경 ${a.outerDiameter}mm`,
      a.length && `길이 ${a.length}mm`,
      a.innerDiameter && `축경·내경 ${a.innerDiameter}mm`,
    ].filter(Boolean);
    if (size.length) k.push(["치수", size.join(" / ")]);
  }
  if (a.rpm) k.push(["회전 속도", `${a.rpm} RPM`]);
  if (known(a.materialWish)) k.push(["희망 소재", a.materialWish.trim()]);
  if (a.quantity) k.push(["수량", `${a.quantity}개`]);
  if (a.dueDate) k.push(["희망 납기", a.dueDate]);
  const res = a.resources.filter((r) => r !== "none");
  if (res.length) k.push(["보낼 수 있는 자료", res.map((r) => labelOf(resources, r) ?? r).join(", ")]);

  return {
    headline,
    known: k,
    needed: neededInfo(a),
    reviewPoints: reviewPoints(a),
    prepare: prepareList(a),
    similar: similarApplications(a, list),
  };
}
