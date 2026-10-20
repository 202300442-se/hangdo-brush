"use client";

import { useEffect, useRef, useState } from "react";
import { company } from "@/data/company";
import { DEMO_CODES, ORDER_STATUSES, type DemoOrder } from "@/data/demo-orders";
import {
  LOCK_MS,
  MAX_FAILURES,
  lookupOrder,
  validateLookup,
  type LookupInputErrors,
} from "@/services/orderTrackingService";

type SafeOrder = Omit<DemoOrder, "codeHash">;
type State =
  | { kind: "idle" }
  | { kind: "invalid"; errors: LookupInputErrors }
  | { kind: "loading" }
  | { kind: "found"; order: SafeOrder }
  | { kind: "nomatch" }
  | { kind: "locked"; until: number }
  | { kind: "error" };

export function OrderTracker() {
  const [id, setId] = useState("");
  const [code, setCode] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const [failures, setFailures] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const idRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  // 잠금 남은 시간 표시
  useEffect(() => {
    if (state.kind !== "locked") return;
    const t = setInterval(() => {
      setNow(Date.now());
      if (Date.now() >= state.until) {
        setState({ kind: "idle" });
        setFailures(0);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [state]);

  const lookup = async (rawId = id, rawCode = code) => {
    if (state.kind === "locked") return;
    const errors = validateLookup(rawId, rawCode);
    if (errors.id || errors.code) {
      setState({ kind: "invalid", errors });
      (errors.id ? idRef : codeRef).current?.focus();
      return;
    }
    setState({ kind: "loading" });
    try {
      const simulateError = new URLSearchParams(window.location.search).get("simulate") === "error";
      const order = await lookupOrder(rawId, rawCode, { simulateError });
      if (order) {
        setFailures(0);
        setState({ kind: "found", order });
      } else {
        const n = failures + 1;
        setFailures(n);
        setState(n >= MAX_FAILURES ? { kind: "locked", until: Date.now() + LOCK_MS } : { kind: "nomatch" });
      }
    } catch {
      setState({ kind: "error" });
    }
  };

  const errors = state.kind === "invalid" ? state.errors : {};
  const remain = state.kind === "locked" ? Math.max(0, Math.ceil((state.until - now) / 1000)) : 0;
  const status =
    state.kind === "loading"
      ? "주문 정보를 확인하고 있습니다."
      : state.kind === "found"
        ? `주문 ${state.order.id}의 현재 상태는 ${state.order.status}입니다.`
        : state.kind === "nomatch"
          ? "주문번호 또는 조회 코드가 맞지 않습니다."
          : state.kind === "locked"
            ? "입력이 여러 번 틀려 잠시 조회가 제한되었습니다."
            : state.kind === "error"
              ? "조회 중 오류가 발생했습니다."
              : "";

  return (
    <div className="order">
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>

      <form
        className="order-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void lookup();
        }}
      >
        <div className="order-form__field">
          <label htmlFor="order-id">주문번호</label>
          <input
            ref={idRef}
            id="order-id"
            name="orderId"
            className="input"
            spellCheck={false}
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="예: HJ-2026-001…"
            autoComplete="off"
            aria-invalid={errors.id ? true : undefined}
            aria-describedby={errors.id ? "order-id-error" : undefined}
          />
          {errors.id && (
            <p id="order-id-error" className="field__error" role="alert">
              {errors.id}
            </p>
          )}
        </div>
        <div className="order-form__field">
          <label htmlFor="order-code">조회 코드</label>
          <input
            ref={codeRef}
            id="order-code"
            name="lookupCode"
            className="input"
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="숫자 6자리…"
            inputMode="numeric"
            autoComplete="off"
            maxLength={7}
            aria-invalid={errors.code ? true : undefined}
            aria-describedby={errors.code ? "order-code-error" : "order-code-help"}
          />
          {errors.code ? (
            <p id="order-code-error" className="field__error" role="alert">
              {errors.code}
            </p>
          ) : (
            <p id="order-code-help" className="order-form__help">
              주문 확정 시 담당자가 거래처에만 따로 알려 드리는 번호입니다.
            </p>
          )}
        </div>
        <button
          type="submit"
          className="btn btn--primary btn--lg order-form__submit"
          disabled={state.kind === "loading" || state.kind === "locked"}
        >
          조회
        </button>
      </form>

      <details className="order-demo">
        <summary>심사·시연용 데모 주문 보기</summary>
        <ul>
          {Object.entries(DEMO_CODES).map(([oid, c]) => (
            <li key={oid}>
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setId(oid);
                  setCode(c);
                  void lookup(oid, c);
                }}
              >
                {oid} / {c}
              </button>
            </li>
          ))}
        </ul>
      </details>

      {state.kind === "idle" && (
        <div className="order__empty">
          <p className="h3">주문번호와 조회 코드를 입력해 주세요.</p>
          <p className="muted">두 값이 모두 맞을 때만 주문 내용이 표시됩니다.</p>
        </div>
      )}

      {state.kind === "loading" && (
        <div className="order__empty" aria-busy="true">
          <span className="spinner" aria-hidden="true" />
          <p>주문 정보를 확인하고 있습니다…</p>
        </div>
      )}

      {state.kind === "nomatch" && (
        <div className="notice notice--warning">
          <p className="notice__title">주문번호 또는 조회 코드가 맞지 않습니다.</p>
          <p>
            안내받은 번호를 다시 확인해 주세요. 계속 조회되지 않으면 담당자에게 문의해 주세요. (전화{" "}
            <a href={`tel:${company.phone}`}>{company.phone}</a>) · 남은 시도 {MAX_FAILURES - failures}회
          </p>
        </div>
      )}

      {state.kind === "locked" && (
        <div className="notice notice--danger">
          <p className="notice__title">입력이 {MAX_FAILURES}회 틀려 잠시 조회가 제한되었습니다.</p>
          <p>{remain}초 후에 다시 시도할 수 있습니다. 번호를 잊으셨다면 담당자에게 문의해 주세요.</p>
        </div>
      )}

      {state.kind === "error" && (
        <div className="notice notice--danger">
          <p className="notice__title">조회 중 문제가 발생했습니다.</p>
          <p>잠시 후 다시 시도해 주세요. 급하신 경우 전화로 제작 현황을 안내해 드립니다.</p>
          <div className="btn-row">
            <button type="button" className="btn btn--primary" onClick={() => void lookup()}>
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

function OrderCard({ order }: { order: SafeOrder }) {
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
