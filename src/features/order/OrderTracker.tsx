"use client";

import { useRef, useState } from "react";
import { company } from "@/data/company";
import { ORDER_STATUSES, demoOrders, type DemoOrder } from "@/data/demo-orders";
import { findOrder, normalizeOrderId, validateOrderId } from "@/services/orderTrackingService";

type State =
  | { kind: "idle" }
  | { kind: "invalid"; message: string }
  | { kind: "loading" }
  | { kind: "found"; order: DemoOrder }
  | { kind: "notfound"; id: string }
  | { kind: "error" };

export function OrderTracker() {
  const [value, setValue] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  const lookup = async (raw: string) => {
    const invalid = validateOrderId(raw);
    if (invalid) {
      setState({ kind: "invalid", message: invalid });
      inputRef.current?.focus();
      return;
    }
    setState({ kind: "loading" });
    try {
      const simulateError = new URLSearchParams(window.location.search).get("simulate") === "error";
      const order = await findOrder(raw, { simulateError });
      setState(order ? { kind: "found", order } : { kind: "notfound", id: normalizeOrderId(raw) });
    } catch {
      setState({ kind: "error" });
    }
  };

  const status =
    state.kind === "loading"
      ? "주문 정보를 확인하고 있습니다."
      : state.kind === "found"
        ? `주문 ${state.order.id}의 현재 상태는 ${state.order.status}입니다.`
        : state.kind === "notfound"
          ? "주문 정보를 찾을 수 없습니다."
          : state.kind === "error"
            ? "조회 중 오류가 발생했습니다."
            : "";

  return (
    <div className="order">
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
      <form
        className="order__form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void lookup(value);
        }}
      >
        <label htmlFor="order-id" className="field__label">
          주문번호
        </label>
        <div className="order__row">
          <input
            ref={inputRef}
            id="order-id"
            className="input"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (state.kind === "invalid") setState({ kind: "idle" });
            }}
            placeholder="HJ-DEMO-001"
            autoComplete="off"
            aria-invalid={state.kind === "invalid" || undefined}
            aria-describedby={state.kind === "invalid" ? "order-error" : "order-help"}
          />
          <button type="submit" className="btn btn--primary btn--lg" disabled={state.kind === "loading"}>
            조회
          </button>
        </div>
        {state.kind === "invalid" ? (
          <p id="order-error" className="field__error" role="alert">
            {state.message}
          </p>
        ) : (
          <p id="order-help" className="field__help">
            데모 주문번호:{" "}
            {demoOrders.map((o, i) => (
              <span key={o.id}>
                <button type="button" className="link-btn" onClick={() => { setValue(o.id); void lookup(o.id); }}>
                  {o.id}
                </button>
                {i < demoOrders.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
      </form>

      {state.kind === "idle" && (
        <div className="order__empty">
          <p className="h3">조회할 주문번호를 입력해 주세요.</p>
          <p className="muted">주문번호는 견적·주문 확정 시 안내드립니다. (현재는 데모 번호만 조회됩니다)</p>
        </div>
      )}

      {state.kind === "loading" && (
        <div className="order__empty" aria-busy="true">
          <span className="spinner" aria-hidden="true" />
          <p>주문 정보를 확인하고 있습니다…</p>
        </div>
      )}

      {state.kind === "notfound" && (
        <div className="notice notice--warning">
          <p className="notice__title">주문 정보를 찾을 수 없습니다.</p>
          <p>
            &lsquo;{state.id}&rsquo;와 일치하는 주문이 없습니다. 주문번호를 다시 확인하거나 담당자에게 문의해 주세요.
            (전화 <a href={`tel:${company.phone}`}>{company.phone}</a>)
          </p>
        </div>
      )}

      {state.kind === "error" && (
        <div className="notice notice--danger">
          <p className="notice__title">조회 중 문제가 발생했습니다.</p>
          <p>잠시 후 다시 시도해 주세요. 급하신 경우 전화로 제작 현황을 안내해 드립니다.</p>
          <div className="btn-row">
            <button type="button" className="btn btn--primary" onClick={() => void lookup(value)}>
              다시 시도
            </button>
            <a className="btn btn--secondary" href={`tel:${company.phone}`}>
              전화 문의
            </a>
          </div>
        </div>
      )}

      {state.kind === "found" && <OrderCard order={state.order} />}
    </div>
  );
}

function OrderCard({ order }: { order: DemoOrder }) {
  const doneIndex = ORDER_STATUSES.indexOf(order.status);
  const dateOf = (s: string) => order.history.find((h) => h.status === s)?.date;
  return (
    <article className="order-card" aria-labelledby="order-title">
      <div className="order-card__head">
        <span className="tag tag--demo">MVP 데모 데이터</span>
        <h2 id="order-title" className="h3">
          {order.id}
        </h2>
        <p className="muted">{order.summary}</p>
      </div>
      <dl className="info-list info-list--inline">
        <div>
          <dt>현재 상태</dt>
          <dd>
            <strong className="order-card__status">{order.status}</strong>
          </dd>
        </div>
        <div>
          <dt>예상 완료</dt>
          <dd>{order.expected}</dd>
        </div>
      </dl>
      <ol className="progress" aria-label="제작 단계">
        {ORDER_STATUSES.map((s, i) => (
          <li
            key={s}
            className={`progress__item${i < doneIndex ? " is-done" : ""}${i === doneIndex ? " is-current" : ""}`}
            aria-current={i === doneIndex ? "step" : undefined}
          >
            <span className="progress__dot" aria-hidden="true" />
            <span className="progress__label">{s}</span>
            <span className="progress__date small muted">
              {i <= doneIndex ? dateOf(s) ?? "" : "예정"}
              <span className="sr-only">{i < doneIndex ? " 완료" : i === doneIndex ? " 진행 중" : ""}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="small muted">실시간 연동 정보가 아닙니다. 실제 제작 현황은 담당자에게 확인해 주세요.</p>
    </article>
  );
}
