"use client";

import { useEffect, useRef, useState } from "react";
import { asset, photoSrc } from "@/lib/asset";

// 메인 배경 영상
// - VIDEO_SRC: 회사 실사 사진으로 만든 10초 반복 영상 (scripts/video/make-hero.html 로 생성, 인위적 효과 없음)
//   회사 원본 촬영 영상(브러쉬 회전·제작 장면)을 받으면 같은 경로에 교체한다.
// - 영상 아래에는 사진 교차 배경을 깔아 두어, 영상을 못 불러오거나 '동작 줄이기' 설정이면 사진이 보인다.
// - 5초 넘게 반복되는 영상이므로 일시정지 버튼을 둔다 (Web Interface Guidelines: Animation).
const VIDEO_SRC: string | null = "/videos/hero.mp4";
const FRAMES = ["roll-abrasive-grey", "machine-knot-detail", "roll-knot-wire-side", "wire-spools"];

export function HeroMedia() {
  const [reduced, setReduced] = useState(false);
  const [videoOk, setVideoOk] = useState(true);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  const showVideo = Boolean(VIDEO_SRC) && videoOk && !reduced;

  return (
    <>
      <div className={`hero-media${reduced || paused ? " is-static" : ""}`} aria-hidden="true">
        {FRAMES.map((id, i) => (
          <img
            key={id}
            className="hero-media__frame"
            src={photoSrc(id)}
            alt=""
            width={1600}
            height={1067}
            style={{ animationDelay: `${i * 5}s` }}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : undefined}
          />
        ))}
        {showVideo && (
          <video
            ref={videoRef}
            className="hero-media__video"
            src={asset(VIDEO_SRC!)}
            poster={photoSrc(FRAMES[0])}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setVideoOk(false)}
          />
        )}
      </div>
      {showVideo && (
        <button
          type="button"
          className="hero-media__toggle"
          onClick={toggle}
          aria-label={paused ? "배경 영상 재생" : "배경 영상 일시정지"}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
            {paused ? <path d="M3 1.5v11l9-5.5z" fill="currentColor" /> : <path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" fill="currentColor" />}
          </svg>
        </button>
      )}
    </>
  );
}
