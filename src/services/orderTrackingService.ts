// OrderTracking UI → OrderTrackingService → (지금) DemoOrderProvider
//                                         → (2단계) POST /api/orders/lookup (서버에서 확인, DB RLS)
//
// 보안 원칙
// 1) 주문번호만으로는 조회되지 않는다 — 주문 확정 시 거래처에만 알려 주는 6자리 조회 코드가 함께 맞아야 한다.
// 2) 실패 시 "주문번호가 없는지 / 코드가 틀렸는지"를 구분해 알려 주지 않는다 (다른 회사가 거래 여부를 알 수 없게).
// 3) 연속 실패 시 잠시 잠근다 (무작위 대입 방지). 실제 서비스에서는 서버에서 IP·주문번호 기준으로 제한한다.

import type { DemoOrder } from "@/data/demo-orders";

export const ORDER_ID_PATTERN = /^HJ-[A-Z0-9]+-\d{3,}$/;
export const CODE_PATTERN = /^\d{6}$/;
export const MAX_FAILURES = 5;
export const LOCK_MS = 30_000;

export function normalizeOrderId(raw: string) {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export function normalizeCode(raw: string) {
  return raw.replace(/\s|-/g, "");
}

export type LookupInputErrors = { id?: string; code?: string };

/** 입력 형식 검증 — 오류가 없으면 빈 객체 */
export function validateLookup(rawId: string, rawCode: string): LookupInputErrors {
  const e: LookupInputErrors = {};
  const id = normalizeOrderId(rawId);
  const code = normalizeCode(rawCode);
  if (!id) e.id = "주문번호를 입력해 주세요. 주문 확정 안내 문자·메일에 적혀 있습니다.";
  else if (!ORDER_ID_PATTERN.test(id)) e.id = "주문번호 형식이 올바르지 않습니다. 'HJ-'로 시작하는 번호를 입력해 주세요.";
  if (!code) e.code = "조회 코드 6자리를 입력해 주세요.";
  else if (!CODE_PATTERN.test(code)) e.code = "조회 코드는 숫자 6자리입니다.";
  return e;
}

async function sha256Hex(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export class OrderLookupError extends Error {}

/** 주문번호와 조회 코드가 모두 맞을 때만 주문을 돌려준다. 하나라도 틀리면 null (구분하지 않음). */
export async function lookupOrder(
  rawId: string,
  rawCode: string,
  { simulateError = false, delayMs = 500 } = {},
): Promise<Omit<DemoOrder, "codeHash"> | null> {
  await new Promise((r) => setTimeout(r, delayMs));
  if (simulateError) throw new OrderLookupError("검증용 오류 재현");
  const id = normalizeOrderId(rawId);
  const hash = await sha256Hex(`${id}:${normalizeCode(rawCode)}`);
  const { demoOrders } = await import("@/data/demo-orders");
  const order = demoOrders.find((o) => o.id === id && o.codeHash === hash);
  if (!order) return null;
  const { codeHash: _omit, ...safe } = order;
  return safe;
}
