"use client";

import { useRef, useState } from "react";
import type { Material } from "@/data/materials";

/**
 * 글라스 소재 버튼 + 특징 상자
 * - 마우스를 올리거나(hover) 키보드로 초점이 오면(focus) 물이 차오르듯 채워지고, 위에 특징 상자가 뜬다.
 * - 터치 기기에서는 탭하면 열리고 다시 탭하거나 다른 곳을 누르면 닫힌다. Esc로도 닫힌다.
 * - 화면 가장자리에서 상자가 잘리지 않도록, 열릴 때(이벤트 시점에만) 위치를 계산해 화면 안에 맞춘다.
 */
export function MaterialChips({ items }: { items: Material[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const show = (id: string, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const li = el.parentElement?.getBoundingClientRect() ?? r;
    const vw = document.documentElement.clientWidth;
    const w = Math.min(300, vw - 32);
    const desired = r.left + r.width / 2 - w / 2;
    const clamped = Math.max(16, Math.min(desired, vw - 16 - w));
    setOffset(Math.round(clamped - li.left));
    setOpen(id);
  };

  return (
    <ul
      ref={listRef}
      role="list"
      className="glass-chips"
      onMouseLeave={() => setOpen(null)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(null);
      }}
    >
      {items.map((m) => {
        const isOpen = open === m.id;
        const tipId = `mat-tip-${m.id}`;
        return (
          <li key={m.id} className={`glass-chip-wrap${isOpen ? " is-open" : ""}`}>
            <button
              type="button"
              className="glass-chip"
              aria-describedby={tipId}
              aria-expanded={isOpen}
              onMouseEnter={(e) => show(m.id, e.currentTarget)}
              onFocus={(e) => show(m.id, e.currentTarget)}
              onBlur={() => setOpen((cur) => (cur === m.id ? null : cur))}
              onClick={(e) => (isOpen ? setOpen(null) : show(m.id, e.currentTarget))}
            >
              <span className="glass-chip__fill" aria-hidden="true">
                <svg viewBox="0 0 240 20" preserveAspectRatio="none" focusable="false">
                  <path d="M0 10 Q 15 0 30 10 T 60 10 T 90 10 T 120 10 T 150 10 T 180 10 T 210 10 T 240 10 V20 H0 Z" />
                </svg>
              </span>
              <span className="glass-chip__label">{m.name}</span>
            </button>
            <span
              id={tipId}
              role="tooltip"
              className="glass-tip"
              style={isOpen ? { ["--tip-left" as string]: `${offset}px` } : undefined}
            >
              <span className="glass-tip__group">{m.group}</span>
              <span className="glass-tip__name">{m.name}</span>
              <span className="glass-tip__traits">
                {m.traits.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </span>
              <span className="glass-tip__note">일반적 특성 · 공정 조건에 따라 다름</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
