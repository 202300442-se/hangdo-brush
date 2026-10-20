"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { company } from "@/data/company";
import { OTHER, UNKNOWN, environments, goals, methods, motions, resources, sensitivity } from "@/data/finder-options";
import { BrushFinderError, createBrief } from "@/services/brushFinderService";
import { ChoiceGroup, MultiChoiceGroup, TextField } from "./fields";
import { buildMailto, buildSummary } from "./summary";
import { emptyAnswers, type DevBrief, type FieldErrors, type FinderAnswers } from "./types";
import { firstInvalidStep, validateStep } from "./validation";

const STEPS = [
  { title: "해결할 문제", desc: "무엇을, 어떤 상태로 만들고 싶은지 알려주세요. 브러쉬 이름은 몰라도 됩니다." },
  { title: "작업 방식", desc: "지금 어떻게 작업하고 있는지 알려주세요. 모르면 넘어가도 됩니다." },
  { title: "작업 조건", desc: "아는 만큼만 적어 주세요. 비워 두면 '확인 필요'로 정리됩니다." },
  { title: "수량·자료", desc: "마지막 단계입니다." },
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
  const [brief, setBrief] = useState<DevBrief | null>(null);
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

  const submit = async () => {
    const bad = firstInvalidStep(answers);
    if (bad >= 0) {
      setStep(bad);
      return showErrors(validateStep(bad, answers));
    }
    setPhase("loading");
    setAnnounce("입력하신 내용으로 개발 의뢰서를 정리하고 있습니다.");
    setCopyState("idle");
    try {
      const simulateError = new URLSearchParams(window.location.search).get("simulate") === "error";
      const b = await createBrief(answers, { simulateError });
      setBrief(b);
      setPhase("result");
      setAnnounce(
        b.similar.length
          ? `개발 의뢰서가 준비되었습니다. 유사 적용 분야 ${b.similar.length}개를 찾았습니다.`
          : "개발 의뢰서가 준비되었습니다. 등록된 유사 적용 분야는 없습니다.",
      );
    } catch (err) {
      setErrorMsg(err instanceof BrushFinderError ? err.message : "알 수 없는 오류가 발생했습니다.");
      setPhase("error");
      setAnnounce("의뢰서를 만들지 못했습니다. 다시 시도하거나 전화·카카오톡으로 문의해 주세요.");
    }
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

  const restart = () => {
    setAnswers(emptyAnswers);
    setErrors({});
    setBrief(null);
    setStep(0);
    setPhase("form");
  };

  const editAnswers = () => {
    setPhase("form");
    setStep(0);
  };

  const summary = brief ? buildSummary(brief, answers.memo) : "";

  const onCopy = async () => {
    const ok = await copyText(summary);
    setCopyState(ok ? "copied" : "failed");
    setAnnounce(ok ? "의뢰서가 복사되었습니다." : "자동 복사에 실패했습니다. 의뢰서 상자를 직접 선택해 복사해 주세요.");
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
          <ol className="stepper" role="list" aria-label="의뢰서 작성 단계">
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
                    name="goal"
                    legend="어떤 작업을 하려고 하시나요?"
                    options={goals}
                    value={answers.goal}
                    onChange={(v) => set("goal", v)}
                    required
                    error={errors.goal}
                  >
                    {answers.goal === OTHER && (
                      <TextField
                        id="goalOther"
                        label="작업 내용"
                        value={answers.goalOther}
                        onChange={(v) => set("goalOther", v)}
                        required
                        maxLength={100}
                        error={errors.goalOther}
                        placeholder="예: 유리 기판 이송 중 먼지 털기"
                      />
                    )}
                  </ChoiceGroup>
                  <TextField
                    id="target"
                    label="브러쉬가 닿는 대상은 무엇인가요?"
                    help="최대한 구체적으로 적어 주세요. 같은 철강이라도 표면 세척인지 물기 제거인지에 따라 브러쉬가 완전히 달라집니다."
                    value={answers.target}
                    onChange={(v) => set("target", v)}
                    required
                    maxLength={100}
                    error={errors.target}
                    placeholder="예: 가리비, 버스 차체, 운동화 밑창, 냉연 강판 표면"
                  />
                  <TextField
                    id="outcome"
                    label="어떤 상태가 되면 성공인가요?"
                    value={answers.outcome}
                    onChange={(v) => set("outcome", v)}
                    maxLength={100}
                    placeholder="예: 껍질 손상 없이 뻘만 제거 / 표면에 물방울이 남지 않게"
                  />
                  <TextField
                    id="problem"
                    label="지금 겪고 있는 문제가 있다면 적어 주세요"
                    value={answers.problem}
                    onChange={(v) => set("problem", v)}
                    multiline
                    maxLength={300}
                    placeholder="예: 시중 브러쉬는 모가 금방 빠집니다 / 세척 후 얼룩이 남습니다"
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <ChoiceGroup
                    name="method"
                    legend="지금은 어떻게 작업하고 있나요?"
                    options={methods}
                    value={answers.method}
                    onChange={(v) => set("method", v)}
                  />
                  <ChoiceGroup
                    name="motion"
                    legend="브러쉬는 어떻게 움직이나요?"
                    options={motions}
                    value={answers.motion}
                    onChange={(v) => set("motion", v)}
                  />
                  <TextField
                    id="equipment"
                    label="설비 이름이나 장착 공간을 알면 적어 주세요"
                    value={answers.equipment}
                    onChange={(v) => set("equipment", v)}
                    maxLength={100}
                    placeholder="예: 컨베이어 위 고정, 폭 1,200mm 라인"
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <MultiChoiceGroup
                    name="environments"
                    legend="어떤 환경에서 사용하나요?"
                    options={environments}
                    value={answers.environments}
                    onChange={(v) => set("environments", v)}
                    exclusive={["none", UNKNOWN]}
                  />
                  <ChoiceGroup
                    name="sensitivity"
                    legend="대상 표면은 얼마나 민감한가요?"
                    options={sensitivity}
                    value={answers.sensitivity}
                    onChange={(v) => set("sensitivity", v)}
                  />
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
                        label="길이·폭"
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
                  {answers.motion === "rotary" && (
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
                  )}
                  <TextField
                    id="materialWish"
                    label="원하는 소재가 있다면 적어 주세요"
                    help="없으면 비워 두세요. 소재와 구조는 공정을 확인한 뒤 대표가 직접 제안합니다."
                    value={answers.materialWish}
                    onChange={(v) => set("materialWish", v)}
                    maxLength={50}
                    placeholder="예: 지금 쓰는 것과 같은 소재"
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
                  <MultiChoiceGroup
                    name="resources"
                    legend="보내 주실 수 있는 자료가 있나요?"
                    help="파일은 이 사이트에 올리지 않습니다. 의뢰서를 보낼 때 카카오톡·메일에 직접 첨부해 주세요."
                    options={resources}
                    value={answers.resources}
                    onChange={(v) => set("resources", v)}
                    exclusive={["none"]}
                  />
                  <TextField
                    id="memo"
                    label="추가로 전할 내용"
                    help="이름·전화번호 같은 개인정보는 적지 마세요. 이 사이트는 입력 내용을 저장하지 않습니다."
                    value={answers.memo}
                    onChange={(v) => set("memo", v)}
                    multiline
                    maxLength={500}
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
                {step < STEPS.length - 1 ? "다음 →" : "의뢰서 만들기"}
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
            개발 의뢰서를 정리하고 있습니다…
          </h2>
          <p className="muted">입력하신 조건을 정리하고 유사 적용 분야를 찾는 중입니다.</p>
        </div>
      )}

      {/* ---------------- ERROR ---------------- */}
      {phase === "error" && (
        <div className="finder__panel">
          <div className="notice notice--danger">
            <h2 ref={headingRef} tabIndex={-1} className="notice__title">
              의뢰서를 만들지 못했습니다
            </h2>
            <p>
              이유: {errorMsg} 입력하신 답변은 그대로 남아 있으니 다시 시도해 주세요. 계속 실패하면 전화나
              카카오톡으로 같은 내용을 알려 주세요.
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
      {phase === "result" && brief && (
        <div className="finder__result">
          <div className="finder__result-head">
            <span className="tag tag--accent">개발 의뢰서</span>
            <h2 ref={headingRef} tabIndex={-1} className="h2">
              개발 의뢰서가 준비되었습니다
            </h2>
            <p className="brief-headline">{brief.headline}</p>
          </div>

          <div className="notice">
            <p className="notice__title">소재와 구조는 공정을 확인한 뒤 대표가 직접 제안합니다.</p>
            <p>이 의뢰서는 상담을 빠르게 시작하기 위한 사전 정리이며, 제품 사양을 확정하지 않습니다.</p>
          </div>

          <div className="result-grid">
            <section className="result-card" aria-labelledby="r-known">
              <h3 id="r-known" className="h3">
                확인된 조건
              </h3>
              <dl className="kv">
                {brief.known.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="result-card" aria-labelledby="r-needed">
              <h3 id="r-needed" className="h3">
                아직 필요한 정보 <span className="tag">{brief.needed.length}개</span>
              </h3>
              {brief.needed.length ? (
                <ul role="list" className="needed-list">
                  {brief.needed.map((n) => (
                    <li key={n.item}>
                      <strong>{n.item}</strong>
                      <span className="small muted">{n.why}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">상담에 필요한 기본 정보가 모두 입력되었습니다.</p>
              )}
            </section>

            {brief.reviewPoints.length > 0 && (
              <section className="result-card result-card--wide" aria-labelledby="r-review">
                <h3 id="r-review" className="h3">
                  기술 검토 포인트
                </h3>
                <p className="small muted">대표가 소재·구조를 정할 때 확인할 항목입니다.</p>
                <ul className="caution-list">
                  {brief.reviewPoints.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </section>
            )}

            {brief.prepare.length > 0 && (
              <section className="result-card result-card--wide" aria-labelledby="r-prepare">
                <h3 id="r-prepare" className="h3">
                  함께 보내 주시면 좋은 자료
                </h3>
                <ul role="list" className="check-list">
                  {brief.prepare.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className="result-card result-card--wide" aria-labelledby="r-similar">
              <h3 id="r-similar" className="h3">
                유사 적용 분야
              </h3>
              {brief.similar.length ? (
                <ul role="list" className="similar-list">
                  {brief.similar.map((s) => (
                    <li key={s.id}>
                      <strong>{s.title}</strong>
                      <span className="small muted">{s.summary}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="notice notice--warning">
                  <p className="notice__title">등록된 유사 적용 분야가 없습니다</p>
                  <p>
                    처음 보는 공정이어도 개발할 수 있습니다. 의뢰서를 그대로 보내 주시면 대표가 직접 검토합니다.{" "}
                    <Link href="/products/">브러쉬 종류별 적용 분야 보기</Link>
                  </p>
                </div>
              )}
            </section>
          </div>

          <section className="summary-box" aria-labelledby="r-summary">
            <h3 id="r-summary" className="h3">
              의뢰서 보내기
            </h3>
            <p className="small muted">
              아래 내용을 복사해 카카오톡 채널이나 메일로 보내 주세요. 회사명·담당자·연락처는 보내실 때 직접 적어
              주세요. 이 사이트는 의뢰서를 저장하거나 자동 전송하지 않습니다.
            </p>
            <label htmlFor="summary-text" className="sr-only">
              개발 의뢰서 내용
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
                <p>브라우저가 복사를 허용하지 않았습니다. 위 의뢰서 상자가 선택되어 있으니 Ctrl+C로 직접 복사해 주세요.</p>
              </div>
            )}

            <div className="btn-row finder__actions">
              <button type="button" className="btn btn--primary btn--lg" onClick={() => void onCopy()}>
                의뢰서 복사
              </button>
              <a className="btn btn--kakao btn--lg" href={company.kakaoChat} target="_blank" rel="noopener noreferrer">
                카카오톡으로 보내기<span className="sr-only"> (새 창)</span>
              </a>
              <a className="btn btn--secondary btn--lg" href={buildMailto(summary)}>
                메일로 보내기
              </a>
            </div>
            <ol className="handoff-steps small">
              <li>
                <strong>의뢰서 복사</strong>를 누릅니다.
              </li>
              <li>
                <strong>카카오톡으로 보내기</strong>를 눌러 채널 채팅창을 엽니다.
              </li>
              <li>붙여 넣은 뒤 회사명·연락처를 적고, 사진·영상이 있으면 함께 보냅니다.</li>
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
