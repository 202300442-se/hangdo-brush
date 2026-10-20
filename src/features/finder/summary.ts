// 상담 결과를 담당자에게 그대로 붙여 넣을 수 있는 문의 요약 텍스트로 만든다.

import { company } from "@/data/company";
import {
  OTHER,
  UNKNOWN,
  attachments,
  currentBrush,
  environments,
  industries,
  labelOf,
  materials,
  motions,
  purposes,
  shapes,
  targets,
} from "@/data/finder-options";
import type { FinderAnswers, FinderResult } from "./types";

const NA = "미확인";

function pick(list: Parameters<typeof labelOf>[0], id: string, other = "") {
  if (!id) return NA;
  if (id === OTHER) return other.trim() ? `기타 — ${other.trim()}` : "기타";
  if (id === UNKNOWN) return "잘 모르겠음";
  return labelOf(list, id) ?? id;
}

function sizeLine(a: FinderAnswers) {
  if (a.sizeUnknown) return "치수 모름 (사진·도면 또는 현물 확인 필요)";
  const parts = [
    a.outerDiameter && `외경 ${a.outerDiameter}mm`,
    a.length && `길이 ${a.length}mm`,
    a.innerDiameter && `축경·내경 ${a.innerDiameter}mm`,
  ].filter(Boolean);
  return parts.length ? parts.join(" / ") : NA;
}

export function buildSummary(a: FinderAnswers, r: FinderResult, now = new Date()): string {
  const env =
    a.environments.length === 0
      ? NA
      : a.environments.map((id) => (id === UNKNOWN ? "잘 모르겠음" : labelOf(environments, id) ?? id)).join(", ");
  const list = (xs: { label: string }[]) => (xs.length ? xs.map((x) => x.label).join(", ") : "담당자 검토 필요");
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return [
    `[${company.nameKo} 제작 상담 요약] ${date}`,
    "",
    "■ 작업 정보",
    `- 작업 목적: ${pick(purposes, a.purpose, a.purposeOther)}`,
    `- 해결하려는 문제: ${a.problem.trim() || NA}`,
    `- 대상물: ${pick(targets, a.target, a.targetOther)}`,
    `- 산업: ${pick(industries, a.industry)}`,
    "",
    "■ 사용 방식",
    `- 설치·회전 방식: ${pick(motions, a.motion)}`,
    `- 희망 형태: ${pick(shapes, a.shape)}`,
    `- 현재 브러쉬: ${pick(currentBrush, a.currentBrush)}`,
    "",
    "■ 규격·환경",
    `- 치수: ${sizeLine(a)}`,
    `- 회전 속도: ${a.rpm ? `${a.rpm} RPM` : NA}`,
    `- 사용 환경: ${env}`,
    `- 희망 소재: ${pick(materials, a.material)}`,
    "",
    "■ 수량·납기",
    `- 수량: ${a.quantity ? `${a.quantity}개` : NA}`,
    `- 희망 납기: ${a.dueDate || NA}`,
    `- 첨부 가능 자료: ${pick(attachments, a.attachment)}`,
    `- 메모: ${a.memo.trim() || "없음"}`,
    "",
    "■ 사전 검토 결과 (데모 규칙 · 기술 검토 전)",
    `- 검토 후보 형태: ${list(r.shapes)}`,
    `- 검토 후보 소재: ${list(r.materials)}`,
    `- 확인이 필요한 규격: ${r.missing.length ? r.missing.join(", ") : "없음"}`,
    ...(r.cautions.length ? [`- 검토 필요 사항: ${r.cautions.join(" / ")}`] : []),
    "",
    "※ 이 요약은 제작 상담을 위한 사전 안내입니다. 최종 소재와 사양은 기술 담당자 검토 후 확정됩니다.",
    "※ 회신받을 회사명·담당자·연락처를 이 메시지에 함께 적어 주세요.",
  ].join("\n");
}

/** 메일 본문 길이 제한(일부 메일 프로그램 약 2,000자)을 고려한 mailto 링크 */
export function buildMailto(summary: string): string {
  const subject = `[제작 상담] ${company.nameKo} 브러쉬 제작 문의`;
  const body =
    summary.length > 1500
      ? `${summary.slice(0, 1400)}\n\n(이하 생략 — 홈페이지에서 '요약 복사' 후 붙여 넣어 주세요.)`
      : summary;
  return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
