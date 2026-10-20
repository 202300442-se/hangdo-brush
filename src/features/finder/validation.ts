// 단계별 입력 검증. 메시지는 "무엇이 문제인지 + 어떻게 고치면 되는지"를 함께 안내한다.

import { OTHER } from "@/data/finder-options";
import type { FieldErrors, FinderAnswers } from "./types";

export const STEP_COUNT = 4;

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
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function validateStep(step: number, a: FinderAnswers, today = new Date()): FieldErrors {
  const e: FieldErrors = {};
  if (step === 0) {
    if (!a.goal) e.goal = "하려는 작업을 하나 골라 주세요. 딱 맞는 것이 없으면 '기타'를 고르고 직접 적어 주세요.";
    if (a.goal === OTHER && !a.goalOther.trim()) e.goalOther = "'기타'를 고르셨다면 어떤 작업인지 짧게 적어 주세요.";
    const t = a.target.trim();
    if (!t) e.target = "브러쉬가 닿는 대상을 적어 주세요. 예: 가리비, 버스 차체, 철강 코일 표면";
    else if (t.length > 100) e.target = "대상은 100자 이내로 적어 주세요. 자세한 내용은 4단계 메모에 적을 수 있습니다.";
  }
  if (step === 2) {
    if (!a.sizeUnknown) {
      const od = checkNumber(a.outerDiameter, "외경", 5000);
      const len = checkNumber(a.length, "길이", 10000);
      const id = checkNumber(a.innerDiameter, "축경·내경", 3000);
      if (od) e.outerDiameter = od;
      if (len) e.length = len;
      if (id) e.innerDiameter = id;
      if (!od && !id && a.outerDiameter && a.innerDiameter && Number(a.innerDiameter) >= Number(a.outerDiameter))
        e.innerDiameter = "축경·내경은 외경보다 작아야 합니다. 두 값을 다시 확인해 주세요.";
    }
    const rpm = checkNumber(a.rpm, "회전 속도(RPM)", 100000, true);
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
  }
  return e;
}

/** 첫 오류가 있는 단계 번호 (없으면 -1) */
export function firstInvalidStep(a: FinderAnswers, today = new Date()): number {
  for (let i = 0; i < STEP_COUNT; i++) if (Object.keys(validateStep(i, a, today)).length) return i;
  return -1;
}
