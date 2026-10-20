"use client";

import Link from "next/link";
import { useState } from "react";
import { applications, matchApplications } from "@/data/applications";

function validate(q: string): string | null {
  const t = q.trim();
  if (t.length > 40) return "검색어는 40자 이내로 입력해 주세요. 예: 가리비, 버스, 철강 물기";
  if (t && !/[가-힣a-zA-Z0-9]/.test(t)) return "글자나 숫자를 포함해 입력해 주세요. 예: 신발";
  return null;
}

export function ApplicationSearch() {
  const [query, setQuery] = useState("");
  const error = validate(query);
  const q = query.trim();
  const list = error ? [] : q ? matchApplications(q) : applications;
  const groups = [...new Set(applications.map((a) => a.group))];

  return (
    <div className="app-search">
      <div className="field">
        <label htmlFor="app-q" className="field__label">
          대상물이나 작업으로 찾기
        </label>
        <input
          id="app-q"
          className="input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 가리비, 지하철, 운동화, 물기"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby="app-q-status"
        />
        <p id="app-q-status" className={error ? "field__error" : "field__help"} role="status" aria-live="polite">
          {error ?? (q ? `'${q}' 관련 적용 분야 ${list.length}개` : `전체 적용 분야 ${applications.length}개`)}
        </p>
      </div>

      {!error && q && list.length === 0 && (
        <div className="notice notice--warning">
          <p className="notice__title">&lsquo;{q}&rsquo;와 관련해 등록된 적용 분야가 없습니다</p>
          <p>
            등록된 분야는 일부 예시일 뿐입니다. 처음 보는 공정도 개발할 수 있으니 AI 개발 의뢰서로 내용을 정리해
            보내 주세요.
          </p>
          <div className="btn-row">
            <Link className="btn btn--primary" href="/finder/">
              AI 개발 의뢰서 작성
            </Link>
            <button type="button" className="btn btn--ghost" onClick={() => setQuery("")}>
              전체 보기
            </button>
          </div>
        </div>
      )}

      {groups.map((g) => {
        const items = list.filter((a) => a.group === g);
        if (!items.length) return null;
        return (
          <section key={g} className="app-group" aria-labelledby={`g-${g}`}>
            <h2 id={`g-${g}`} className="h3 app-group__title">
              {g}
            </h2>
            <ul role="list" className="app-list">
              {items.map((a) => (
                <li key={a.id} className="app-item">
                  <h3 className="app-item__title">{a.title}</h3>
                  <p className="app-item__challenge">{a.summary}</p>
                  <p className="app-item__label">개발 시 검토하는 것</p>
                  <ul className="app-item__points">
                    {a.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
