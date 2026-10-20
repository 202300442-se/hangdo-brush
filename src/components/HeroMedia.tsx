"use client";

import { useEffect, useState } from "react";
import { asset, photoSrc } from "@/lib/asset";

// 메인 배경 영상.
// - VIDEO_SRC가 있으면 3~5초짜리 회사 영상을 소리 없이 반복 재생한다.
// - 아직 회사 영상이 없으므로 공장 사진을 천천히 확대·교차하는 시네마틱 배경으로 대신한다.
// TODO: 회사 원본 영상(브러쉬 회전·제작 장면 3~5초)을 public/videos/hero.mp4 로 넣고 VIDEO_SRC 지정
const VIDEO_SRC: string | null = null;
const FRAMES = ["machine-knot-detail", "roll-knot-wire-side", "wire-spools", "roll-abrasive-grey"];

export function HeroMedia() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  if (VIDEO_SRC && !reduced) {
    return (
      <div className="hero-media" aria-hidden="true">
        <video
          className="hero-media__video"
          src={asset(VIDEO_SRC)}
          poster={photoSrc(FRAMES[0])}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <div className={`hero-media${reduced ? " is-static" : ""}`} aria-hidden="true">
      {FRAMES.map((id, i) => (
        <img
          key={id}
          className="hero-media__frame"
          src={photoSrc(id)}
          alt=""
          style={{ animationDelay: `${i * 5}s` }}
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : undefined}
        />
      ))}
    </div>
  );
}
