// 개발 의뢰서를 담당자에게 그대로 붙여 넣을 수 있는 텍스트로 만든다.

import { company } from "@/data/company";
import type { DevBrief } from "./types";

function localDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function buildSummary(b: DevBrief, memo = "", now = new Date()): string {
  return [
    `[${company.nameKo} 브러쉬 개발 의뢰서] ${localDate(now)}`,
    "",
    `■ 의뢰 요약`,
    b.headline,
    "",
    "■ 확인된 조건",
    ...b.known.map(([k, v]) => `- ${k}: ${v}`),
    "",
    "■ 아직 확인이 필요한 정보",
    ...(b.needed.length ? b.needed.map((n) => `- ${n.item}`) : ["- 없음"]),
    ...(b.reviewPoints.length ? ["", "■ 기술 검토 포인트", ...b.reviewPoints.map((p) => `- ${p}`)] : []),
    ...(b.prepare.length ? ["", "■ 함께 보낼 자료", ...b.prepare.map((p) => `- ${p}`)] : []),
    "",
    `■ 유사 적용 분야: ${b.similar.length ? b.similar.map((s) => s.title).join(", ") : "없음 (신규 공정)"}`,
    ...(memo.trim() ? ["", `■ 메모`, memo.trim()] : []),
    "",
    "※ 소재와 구조는 공정을 확인한 뒤 대표가 직접 제안합니다. 이 의뢰서는 상담을 위한 사전 정리입니다.",
    "※ 회신받을 회사명·담당자·연락처를 이 메시지에 함께 적어 주세요.",
  ].join("\n");
}

/** 메일 본문 길이 제한(일부 메일 프로그램 약 2,000자)을 고려한 mailto 링크 */
export function buildMailto(summary: string): string {
  const subject = `[개발 의뢰] ${company.nameKo} 브러쉬 개발 문의`;
  const body =
    summary.length > 1500
      ? `${summary.slice(0, 1400)}\n\n(이하 생략 — 홈페이지에서 '의뢰서 복사' 후 붙여 넣어 주세요.)`
      : summary;
  return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
