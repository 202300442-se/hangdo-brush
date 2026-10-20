// OrderTracking UI → OrderTrackingService → (지금) DemoOrderProvider
//                                         → (2단계) GET /api/orders/:id

import type { DemoOrder } from "@/data/demo-orders";

export const ORDER_ID_PATTERN = /^HJ-[A-Z0-9]+-\d{3,}$/;

export function normalizeOrderId(raw: string) {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

/** 형식 오류면 안내 문구, 정상이면 null */
export function validateOrderId(raw: string): string | null {
  const id = normalizeOrderId(raw);
  if (!id) return "주문번호를 입력해 주세요. 예: HJ-DEMO-001";
  if (!ORDER_ID_PATTERN.test(id))
    return "주문번호 형식이 올바르지 않습니다. 'HJ-'로 시작하고 끝이 숫자 3자리인 번호를 입력해 주세요. 예: HJ-DEMO-001";
  return null;
}

export class OrderLookupError extends Error {}

export async function findOrder(raw: string, { simulateError = false, delayMs = 500 } = {}): Promise<DemoOrder | null> {
  await new Promise((r) => setTimeout(r, delayMs));
  if (simulateError) throw new OrderLookupError("검증용 오류 재현");
  const { demoOrders } = await import("@/data/demo-orders");
  return demoOrders.find((o) => o.id === normalizeOrderId(raw)) ?? null;
}
