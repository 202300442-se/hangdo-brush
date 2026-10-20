"use client";

import type { ReactNode } from "react";
import type { Option } from "@/data/finder-options";

type ChoiceProps = {
  name: string;
  legend: string;
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  help?: string;
  children?: ReactNode;
};

/** 라디오 그룹 — 네이티브 input을 그대로 사용해 키보드(화살표)·스크린리더 동작을 보장한다. */
export function ChoiceGroup({ name, legend, options, value, onChange, required, error, help, children }: ChoiceProps) {
  const errId = `${name}-error`;
  const helpId = `${name}-help`;
  return (
    <fieldset
      className={`field${error ? " field--invalid" : ""}`}
      aria-describedby={[help && helpId, error && errId].filter(Boolean).join(" ") || undefined}
    >
      <legend className="field__label">
        {legend} {required ? <span className="field__req">필수</span> : <span className="field__opt">선택</span>}
      </legend>
      {help && (
        <p id={helpId} className="field__help">
          {help}
        </p>
      )}
      <div className="choices">
        {options.map((o) => (
          <label key={o.id} className="choice">
            <input
              type="radio"
              name={name}
              value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
              aria-invalid={error ? true : undefined}
            />
            <span className="choice__body">
              <span className="choice__label">{o.label}</span>
              {o.hint && <span className="choice__hint">{o.hint}</span>}
            </span>
          </label>
        ))}
      </div>
      {children}
      {error && (
        <p id={errId} className="field__error">
          {error}
        </p>
      )}
    </fieldset>
  );
}

type MultiProps = Omit<ChoiceProps, "value" | "onChange" | "required"> & {
  value: string[];
  onChange: (v: string[]) => void;
  /** 선택 시 나머지를 해제하는 항목 (예: '조건 없음', '잘 모르겠습니다') */
  exclusive?: string[];
};

export function MultiChoiceGroup({ name, legend, options, value, onChange, error, help, exclusive = [] }: MultiProps) {
  const toggle = (id: string) => {
    if (value.includes(id)) return onChange(value.filter((v) => v !== id));
    if (exclusive.includes(id)) return onChange([id]);
    onChange([...value.filter((v) => !exclusive.includes(v)), id]);
  };
  const helpId = `${name}-help`;
  return (
    <fieldset className="field" aria-describedby={help ? helpId : undefined}>
      <legend className="field__label">
        {legend} <span className="field__opt">선택 · 여러 개 가능</span>
      </legend>
      {help && (
        <p id={helpId} className="field__help">
          {help}
        </p>
      )}
      <div className="choices">
        {options.map((o) => (
          <label key={o.id} className="choice">
            <input type="checkbox" name={name} value={o.id} checked={value.includes(o.id)} onChange={() => toggle(o.id)} />
            <span className="choice__body">
              <span className="choice__label">{o.label}</span>
            </span>
          </label>
        ))}
      </div>
      {error && <p className="field__error">{error}</p>}
    </fieldset>
  );
}

type TextProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  help?: string;
  suffix?: string;
  required?: boolean;
  disabled?: boolean;
  inputMode?: "text" | "decimal" | "numeric";
  type?: "text" | "date";
  min?: string;
  multiline?: boolean;
  maxLength?: number;
  placeholder?: string;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  help,
  suffix,
  required,
  disabled,
  inputMode = "text",
  type = "text",
  min,
  multiline,
  maxLength,
  placeholder,
}: TextProps) {
  const describedBy = [help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name: id,
    value,
    disabled,
    placeholder,
    maxLength,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    "aria-required": required || undefined,
    className: "input",
  } as const;
  return (
    <div className={`field${error ? " field--invalid" : ""}${disabled ? " field--disabled" : ""}`}>
      <label htmlFor={id} className="field__label">
        {label} {required ? <span className="field__req">필수</span> : <span className="field__opt">선택</span>}
      </label>
      {help && (
        <p id={`${id}-help`} className="field__help">
          {help}
        </p>
      )}
      <div className="input-wrap">
        {multiline ? (
          <textarea {...common} rows={3} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input
            {...common}
            type={type}
            inputMode={type === "date" ? undefined : inputMode}
            min={min}
            autoComplete="off"
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        {suffix && (
          <span className="input-suffix" aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
      {maxLength && multiline && (
        <p className="field__count" aria-hidden="true">
          {value.length} / {maxLength}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}
