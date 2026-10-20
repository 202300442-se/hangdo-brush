"use client";

import { useEffect, useRef, useState } from "react";
import { company } from "@/data/company";
import {
  OTHER,
  UNKNOWN,
  attachments,
  currentBrush,
  environments,
  industries,
  materials,
  motions,
  purposes,
  shapes,
  targets,
} from "@/data/finder-options";
import { BrushFinderError, getRecommendation } from "@/services/brushFinderService";
import { ChoiceGroup, MultiChoiceGroup, TextField } from "./fields";
import { buildMailto, buildSummary } from "./summary";
import { emptyAnswers, type FieldErrors, type FinderAnswers, type FinderResult } from "./types";
import { firstInvalidStep, validateStep } from "./validation";

const STEPS = [
  { title: "작업 목적", desc: "어떤 작업에, 무엇에 쓰실지 알려주세요." },
  { title: "사용 방식", desc: "설비에 어떻게 장착되는지 알려주세요. 모르셔도 괜찮습니다." },
  { title: "규격·환경", desc: "아는 만큼만 적어 주세요. 비워 두면 '확인 필요'로 정리됩니다." },
  { title: "수량·납기", desc: "마지막 단계입니다." },
] as const;

type Phase = "form" | "loading" | "result" | "error";
type CopyState = "idle" | "copied" | "failed";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* 아래 대체 방식 시도 */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function BrushFinder() {
  const [phase, setPhase] = useState<Phase>("form");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<FinderAnswers>(emptyAnswers);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<FinderResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [announce, setAnnounce] = useState("");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const firstRender = useRef(true);

  // 단계·화면이 바뀌면 제목으로 초점 이동 (키보드·스크린리더 사용자가 위치를 잃지 않도록)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, phase]);

  const set = <K extends keyof FinderAnswers>(key: K, value: FinderAnswers[K]) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const showErrors = (e: FieldErrors) => {
    setErrors(e);
    const n = Object.values(e).filter(Boolean).length;
    setAnnounce(`입력 내용을 확인해 주세요. 고칠 항목이 ${n}개 있습니다.`);
    requestAnimationFrame(() => errorSummaryRef.current?.focus());
  };

  const next = () => {
    const e = validateStep(step, answers);
    if (Object.keys(e).length) return showErrors(e);
    setErrors({});
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      setAnnounce(`${step + 2}단계 ${STEPS[step + 1].title}`);
    } else {
      void submit();
    }
  };

  const prev = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const submit = async () => {
    const bad = firstInvalidStep(answers);
    if (bad >= 0) {
      setStep(bad);
      return showErrors(validateStep(bad, answers));
    }
    setPhase("loading");
    setAnnounce("입력하신 내용으로 검토 후보를 정리하고 있습니다.");
    setCopyState("idle");
    try {
      const simulateError = new URLSearchParams(window.location.search).get("simulate") === "error";
      const r = await getRecommendation(answers, { simulateError });
      setResult(r);
      setPhase("result");
      setAnnounce(
        r.kind === "matched"
          ? "사전 검토 결과가 준비되었습니다."
          : "일치하는 추천 후보가 없습니다. 입력 내용은 문의 요약으로 정리되었습니다.",
      );
    } catch (err) {
      setErrorMsg(err instanceof BrushFinderError ? err.message : "알 수 없는 오류가 발생했습니다.");
      setPhase("error");
      setAnnounce("결과를 불러오지 못했습니다. 다시 시도하거나 전화·카카오톡으로 문의해 주세요.");
    }
  };

  const restart = () => {
    setAnswers(emptyAnswers);
    setErrors({});
    setResult(null);
    setStep(0);
    setPhase("form");
  };

  const editAnswers = () => {
    setPhase("form");
    setStep(0);
  };

  const summary = result ? buildSummary(answers, result) : "";

  const onCopy = async () => {
    const ok = await copyText(summary);
    setCopyState(ok ? "copied" : "failed");
    setAnnounce(ok ? "요약이 복사되었습니다." : "자동 복사에 실패했습니다. 요약 상자를 직접 선택해 복사해 주세요.");
    if (!ok) summaryRef.current?.select();
  };

  const errorEntries = Object.entries(errors).filter(([, v]) => v) as [keyof FinderAnswers, string][];

  return (
    <div className="finder">
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

      {/* ---------------- FORM ---------------- */}
      {phase === "form" && (
        <form
          className="finder__form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
        >
          <ol className="stepper" role="list" aria-label="상담 단계">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className={`stepper__item${i === step ? " is-current" : ""}${i < step ? " is-done" : ""}`}
                aria-current={i === step ? "step" : undefined}
              >
                <span className="stepper__num">{i + 1}</span>
                <span className="stepper__title">{s.title}</span>
              </li>
            ))}
          </ol>

          <div className="finder__panel">
            <p className="finder__count">
              {step + 1} / {STEPS.length} 단계
            </p>
            <h2 ref={headingRef} tabIndex={-1} className="h2 finder__heading">
              {STEPS[step].title}
            </h2>
            <p className="muted">{STEPS[step].desc}</p>

            {errorEntries.length > 0 && (
              <div ref={errorSummaryRef} tabIndex={-1} className="notice notice--danger" role="alert">
                <p className="notice__title">입력 내용을 확인해 주세요</p>
                <ul>
                  {errorEntries.map(([k, msg]) => (
                    <li key={k}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="finder__fields">
              {step === 0 && (
                <>
                  <ChoiceGroup
                    name="purpose"
                    legend="어떤 작업에 사용하시나요?"
                    options={purposes}
                    value={answers.purpose}
                    onChange={(v) => set("purpose", v)}
                    required
                    error={errors.purpose}
                  >
                    {answers.purpose === OTHER && (
                      <TextField
                        id="purposeOther"
                        label="작업 내용"
                        value={answers.purposeOther}
                        onChange={(v) => set("purposeOther", v)}
                        required
                        maxLength={100}
                        error={errors.purposeOther}
                        placeholder="예: 유리 기판 표면 먼지 제거"
                      />
                    )}
                  </ChoiceGroup>
                  <ChoiceGroup
                    name="target"
                    legend="브러쉬가 닿는 대상물은 무엇인가요?"
                    options={targets}
                    value={answers.target}
                    onChange={(v) => set("target", v)}
                    required
                    error={errors.target}
                  >
                    {answers.target === OTHER && (
                      <TextField
                        id="targetOther"
                        label="대상물"
                        value={answers.targetOther}
                        onChange={(v) => set("targetOther", v)}
                        required
                        maxLength={100}
                        error={errors.targetOther}
                        placeholder="예: 고무 벨트, 목재 판넬"
                      />
                    )}
                  </ChoiceGroup>
                  <ChoiceGroup
                    name="industry"
                    legend="어느 산업 현장인가요?"
                    options={industries}
                    value={answers.industry}
                    onChange={(v) => set("industry", v)}
                  />
                  <TextField
                    id="problem"
                    label="해결하려는 문제가 있다면 적어 주세요"
                    value={answers.problem}
                    onChange={(v) => set("problem", v)}
                    multiline
                    maxLength={300}
                    error={errors.problem}
                    placeholder="예: 기존 브러쉬 모가 빨리 빠집니다 / 세척 후 얼룩이 남습니다"
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <ChoiceGroup
                    name="motion"
                    legend="브러쉬는 어떻게 사용되나요?"
                    options={motions}
                    value={answers.motion}
                    onChange={(v) => set("motion", v)}
                  />
                  <ChoiceGroup
                    name="shape"
                    legend="생각하시는 형태가 있나요?"
                    help="사진에서 보신 모양과 비슷한 것을 고르시면 됩니다."
                    options={shapes}
                    value={answers.shape}
                    onChange={(v) => set("shape", v)}
                  />
                  <ChoiceGroup
                    name="currentBrush"
                    legend="현재 사용 중인 브러쉬가 있나요?"
                    options={currentBrush}
                    value={answers.currentBrush}
                    onChange={(v) => set("currentBrush", v)}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <fieldset className="field">
                    <legend className="field__label">
                      대략적인 치수 <span className="field__opt">선택</span>
                    </legend>
                    <p className="field__help">단위는 mm입니다. 아는 값만 적어 주세요.</p>
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={answers.sizeUnknown}
                        onChange={(e) => set("sizeUnknown", e.target.checked)}
                      />
                      <span>치수를 모릅니다 (사진·도면이나 현물로 확인 예정)</span>
                    </label>
                    <div className="field-grid">
                      <TextField
                        id="outerDiameter"
                        label="외경"
                        value={answers.outerDiameter}
                        onChange={(v) => set("outerDiameter", v)}
                        inputMode="decimal"
                        suffix="mm"
                        disabled={answers.sizeUnknown}
                        error={errors.outerDiameter}
                      />
                      <TextField
                        id="length"
                        label="길이·모 폭"
                        value={answers.length}
                        onChange={(v) => set("length", v)}
                        inputMode="decimal"
                        suffix="mm"
                        disabled={answers.sizeUnknown}
                        error={errors.length}
                      />
                      <TextField
                        id="innerDiameter"
                        label="축경·내경"
                        value={answers.innerDiameter}
                        onChange={(v) => set("innerDiameter", v)}
                        inputMode="decimal"
                        suffix="mm"
                        disabled={answers.sizeUnknown}
                        error={errors.innerDiameter}
                      />
                    </div>
                  </fieldset>
                  <TextField
                    id="rpm"
                    label="회전 속도"
                    help="모르시면 비워 두세요."
                    value={answers.rpm}
                    onChange={(v) => set("rpm", v)}
                    inputMode="numeric"
                    suffix="RPM"
                    error={errors.rpm}
                  />
                  <MultiChoiceGroup
                    name="environments"
                    legend="어떤 환경에서 사용하나요?"
                    options={environments}
                    value={answers.environments}
                    onChange={(v) => set("environments", v)}
                    exclusive={["none", UNKNOWN]}
                  />
                  <ChoiceGroup
                    name="material"
                    legend="원하시는 모 소재가 있나요?"
                    options={materials}
                    value={answers.material}
                    onChange={(v) => set("material", v)}
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <div className="field-grid field-grid--2">
                    <TextField
                      id="quantity"
                      label="예상 수량"
                      value={answers.quantity}
                      onChange={(v) => set("quantity", v)}
                      inputMode="numeric"
                      suffix="개"
                      error={errors.quantity}
                    />
                    <TextField
                      id="dueDate"
                      label="희망 납기"
                      type="date"
                      min={todayISO()}
                      value={answers.dueDate}
                      onChange={(v) => set("dueDate", v)}
                      error={errors.dueDate}
                    />
                  </div>
                  <ChoiceGroup
                    name="attachment"
                    legend="사진이나 도면이 있나요?"
                    help="파일은 이 사이트에 올리지 않습니다. 문의 메일·카카오톡에 직접 첨부해 주세요."
                    options={attachments}
                    value={answers.attachment}
                    onChange={(v) => set("attachment", v)}
                  />
                  <TextField
                    id="memo"
                    label="추가로 전할 내용"
                    help="이름·전화번호 같은 개인정보는 적지 마세요. 이 사이트는 입력 내용을 저장하지 않습니다."
                    value={answers.memo}
                    onChange={(v) => set("memo", v)}
                    multiline
                    maxLength={500}
                    error={errors.memo}
                  />
                </>
              )}
            </div>

            <div className="finder__nav">
              {step > 0 ? (
                <button type="button" className="btn btn--secondary" onClick={prev}>
                  ← 이전
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className="btn btn--primary btn--lg">
                {step < STEPS.length - 1 ? "다음 →" : "결과 보기"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ---------------- LOADING ---------------- */}
      {phase === "loading" && (
        <div className="finder__panel finder__state" aria-busy="true">
          <span className="spinner" aria-hidden="true" />
          <h2 ref={headingRef} tabIndex={-1} className="h3">
            검토 후보를 정리하고 있습니다…
          </h2>
          <p className="muted">입력하신 작업 조건을 데모 규칙과 비교하는 중입니다.</p>
        </div>
      )}

      {/* ---------------- ERROR ---------------- */}
      {phase === "error" && (
        <div className="finder__panel">
          <div className="notice notice--danger">
            <h2 ref={headingRef} tabIndex={-1} className="notice__title">
              결과를 불러오지 못했습니다
            </h2>
            <p>
              이유: {errorMsg} 입력하신 답변은 그대로 남아 있으니 다시 시도해 주세요. 계속 실패하면 전화나
              카카오톡으로 문의해 주시면 같은 내용을 안내해 드립니다.
            </p>
          </div>
          <div className="btn-row finder__actions">
            <button type="button" className="btn btn--primary" onClick={() => void submit()}>
              다시 시도
            </button>
            <button type="button" className="btn btn--secondary" onClick={editAnswers}>
              답변 수정
            </button>
            <a className="btn btn--ghost" href={`tel:${company.phone}`}>
              전화 {company.phone}
            </a>
          </div>
        </div>
      )}

      {/* ---------------- RESULT ---------------- */}
      {phase === "result" && result && (
        <div className="finder__result">
          <div className="finder__result-head">
            <span className="tag tag--demo">데모 규칙 · 기술 검토 전</span>
            <h2 ref={headingRef} tabIndex={-1} className="h2">
              {result.kind === "matched" ? "사전 검토 결과" : "추천 후보를 특정하지 못했습니다"}
            </h2>
          </div>

          {result.kind === "unmatched" ? (
            <div className="notice notice--warning">
              <p className="notice__title">일치하는 추천 규칙이 없습니다</p>
              <p>
                입력하신 작업은 현재 데모 규칙에 없는 조건입니다. 주문제작이 불가능하다는 뜻이 아니므로, 아래 요약을
                그대로 보내 주시면 기술 담당자가 직접 검토합니다.
              </p>
            </div>
          ) : (
            <div className="notice notice--success">
              <p className="notice__title">입력하신 조건으로 검토 후보를 정리했습니다</p>
              <p>아래 후보와 확인 필요 항목을 문의 요약에 담았습니다.</p>
            </div>
          )}

          <div className="notice">
            <p className="notice__title">추천 결과는 제작 상담을 위한 사전 안내입니다.</p>
            <p>최종 소재와 사양은 기술 담당자의 검토 후 확정됩니다.</p>
          </div>

          <div className="result-grid">
            <section className="result-card" aria-labelledby="r-shapes">
              <h3 id="r-shapes" className="h3">
                검토 후보 형태
              </h3>
              {result.shapes.length ? (
                <ul role="list" className="cand-list">
                  {result.shapes.map((s) => (
                    <li key={s.id}>
                      <strong>{s.label}</strong>
                      <span className="small muted">{s.reason}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">담당자 검토 후 안내드립니다.</p>
              )}
            </section>
            <section className="result-card" aria-labelledby="r-materials">
              <h3 id="r-materials" className="h3">
                검토 후보 소재
              </h3>
              {result.materials.length ? (
                <ul role="list" className="cand-list">
                  {result.materials.map((m) => (
                    <li key={m.id}>
                      <strong>{m.label}</strong>
                      <span className="small muted">{m.reason}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">담당자 검토 후 안내드립니다.</p>
              )}
            </section>
            <section className="result-card result-card--wide" aria-labelledby="r-missing">
              <h3 id="r-missing" className="h3">
                확인이 필요한 규격 <span className="tag">{result.missing.length}개</span>
              </h3>
              {result.missing.length ? (
                <>
                  <p className="small muted">
                    아래 항목은 담당자가 다시 여쭤볼 내용입니다. 미리 준비해 주시면 견적이 빨라집니다.
                  </p>
                  <ul role="list" className="check-list">
                    {result.missing.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="muted">필요한 기본 정보가 모두 입력되었습니다.</p>
              )}
            </section>
            {result.cautions.length > 0 && (
              <section className="result-card result-card--wide" aria-labelledby="r-cautions">
                <h3 id="r-cautions" className="h3">
                  기술 검토가 필요한 사항
                </h3>
                <ul className="caution-list">
                  {result.cautions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <section className="summary-box" aria-labelledby="r-summary">
            <h3 id="r-summary" className="h3">
              문의 요약
            </h3>
            <p className="small muted">
              이 내용을 복사해 카카오톡 채널이나 메일로 보내 주세요. 회사명·담당자·연락처는 보내실 때 직접 적어
              주세요. 이 사이트는 요약을 저장하거나 자동 전송하지 않습니다.
            </p>
            <label htmlFor="summary-text" className="sr-only">
              문의 요약 내용
            </label>
            <textarea id="summary-text" ref={summaryRef} className="summary-text" readOnly value={summary} rows={14} />

            {copyState === "copied" && (
              <div className="notice notice--success">
                <p className="notice__title">복사되었습니다</p>
                <p>카카오톡 채팅창이나 메일 본문에 붙여 넣어 주세요. (Ctrl+V / 길게 눌러 붙여넣기)</p>
              </div>
            )}
            {copyState === "failed" && (
              <div className="notice notice--danger">
                <p className="notice__title">자동 복사에 실패했습니다</p>
                <p>브라우저가 복사를 허용하지 않았습니다. 위 요약 상자가 선택되어 있으니 Ctrl+C로 직접 복사해 주세요.</p>
              </div>
            )}

            <div className="btn-row finder__actions">
              <button type="button" className="btn btn--primary btn--lg" onClick={() => void onCopy()}>
                요약 복사
              </button>
              <a className="btn btn--kakao btn--lg" href={company.kakaoChat} target="_blank" rel="noopener noreferrer">
                카카오톡으로 상담<span className="sr-only"> (새 창)</span>
              </a>
              <a className="btn btn--secondary btn--lg" href={buildMailto(summary)}>
                메일로 보내기
              </a>
            </div>
            <ol className="handoff-steps small">
              <li>
                <strong>요약 복사</strong>를 누릅니다.
              </li>
              <li>
                <strong>카카오톡으로 상담</strong>을 눌러 채널 채팅창을 엽니다.
              </li>
              <li>붙여 넣은 뒤 회사명·연락처를 적고, 사진·도면이 있으면 함께 보냅니다.</li>
            </ol>
          </section>

          <div className="btn-row finder__actions">
            <button type="button" className="btn btn--secondary" onClick={editAnswers}>
              답변 수정
            </button>
            <button type="button" className="btn btn--ghost" onClick={restart}>
              처음부터 다시
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
