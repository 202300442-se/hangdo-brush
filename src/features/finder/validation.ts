// 단계별 입력 검증. 메시지는 "무엇이 문제인지 + 어떻게 고치면 되는지"를 함께 안내한다.

import { OTHER } from "@/data/finder-options";
import type { FieldErrors, FinderAnswers } from "./types";

export const STEP_FIELDS: (keyof FinderAnswers)[][] = [
  ["purpose", "purposeOther", "problem", "target", "targetOther", "industry"],
  ["motion", "shape", "currentBrush"],
  ["outerDiameter", "length", "innerDiameter", "rpm", "environments", "material"],
  ["quantity", "dueDate", "attachment", "memo"],
];

const NUM = /^\d+(\.\d+)?$/;

function checkNumber(raw: string, label: string, max: number, integer = false): string | undefined {
  const v = raw.trim().replace(/,/g, "");
  if (v === "") return undefined;
  if (!NUM.test(v)) return `${label}에는 숫자만 입력해 주세요. 예: 120 (단위 없이)`;
  const n = Number(v);
  if (n <= 0) return `${label}은(는) 0보다 커야 합니다.`;
  if (integer && !Number.isInteger(n)) return `${label}은(는) 정수로 입력해 주세요.`;
  if (n > max) return `${label} 값이 너무 큽니다. 다시 확인해 주세요. (최대 ${max.toLocaleString("ko-KR")})`;
  return undefined;
}

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function validateStep(step: number, a: FinderAnswers, today = new Date()): FieldErrors {
  const e: FieldErrors = {};
  if (step === 0) {
    if (!a.purpose) e.purpose = "작업 목적을 하나 선택해 주세요. 딱 맞는 항목이 없으면 '기타'를 고르고 직접 적어 주세요.";
    if (a.purpose === OTHER && !a.purposeOther.trim()) e.purposeOther = "'기타'를 선택하셨다면 어떤 작업인지 짧게 적어 주세요.";
    if (!a.target) e.target = "브러쉬가 닿는 대상물을 하나 선택해 주세요. 모르시면 '기타'에 생각나는 대로 적어 주세요.";
    if (a.target === OTHER && !a.targetOther.trim()) e.targetOther = "'기타'를 선택하셨다면 대상물을 짧게 적어 주세요.";
    if (a.problem.length > 300) e.problem = "300자 이내로 줄여 주세요.";
  }
  if (step === 2 && !a.sizeUnknown) {
    const od = checkNumber(a.outerDiameter, "외경", 5000);
    const len = checkNumber(a.length, "길이", 10000);
    const id = checkNumber(a.innerDiameter, "축경·내경", 3000);
    if (od) e.outerDiameter = od;
    if (len) e.length = len;
    if (id) e.innerDiameter = id;
    if (!od && !id && a.outerDiameter && a.innerDiameter && Number(a.innerDiameter) >= Number(a.outerDiameter))
      e.innerDiameter = "축경·내경은 외경보다 작아야 합니다. 두 값을 다시 확인해 주세요.";
  }
  if (step === 2) {
    const rpm = checkNumber(a.rpm, "회전 속도", 100000, true);
    if (rpm) e.rpm = rpm;
  }
  if (step === 3) {
    const q = checkNumber(a.quantity, "수량", 1000000, true);
    if (q) e.quantity = q;
    if (a.dueDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(a.dueDate) || Number.isNaN(Date.parse(a.dueDate)))
        e.dueDate = "날짜 형식이 올바르지 않습니다. 달력에서 날짜를 선택해 주세요.";
      else if (a.dueDate < toISODate(today))
        e.dueDate = "희망 납기가 오늘보다 이전입니다. 오늘 이후 날짜를 선택해 주세요.";
    }
    if (a.memo.length > 500) e.memo = "메모는 500자 이내로 적어 주세요.";
  }
  return e;
}

export function validateAll(a: FinderAnswers, today = new Date()): FieldErrors {
  return STEP_FIELDS.reduce<FieldErrors>((acc, _, i) => ({ ...acc, ...validateStep(i, a, today) }), {});
}

/** 첫 오류가 있는 단계 번호 (없으면 -1) */
export function firstInvalidStep(a: FinderAnswers, today = new Date()): number {
  return STEP_FIELDS.findIndex((_, i) => Object.keys(validateStep(i, a, today)).length > 0);
}
