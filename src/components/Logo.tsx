// 항도제일특수브러쉬 HJ 로고 — 회사 홈페이지 로고 캡처(2026-10-20 제공)를 그대로 따라 그린 벡터.
// 구성: 굵은 원 + H + 가로대 가운데에서 내려와 왼쪽 아래 원으로 이어지는 J
// 색: 캡처에서 추출한 #68A454
// TODO: 회사 원본 로고 파일(AI/SVG/PNG)을 받으면 교체

export const LOGO_GREEN = "#68A454";

export function LogoMark({ size = 42, color = LOGO_GREEN }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="7 3.5 54 54" aria-hidden="true" focusable="false">
      <circle cx="34" cy="30.5" r="24.4" fill="none" stroke={color} strokeWidth="4.8" />
      <rect x="17.5" y="19.5" width="6.5" height="22.5" fill={color} />
      <rect x="45" y="19.5" width="6.5" height="22.5" fill={color} />
      <rect x="17.5" y="26.5" width="34" height="6.5" fill={color} />
      <path d="M35 32V40.5C35 47 30.5 51.2 23.5 52" fill="none" stroke={color} strokeWidth="5" />
    </svg>
  );
}

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`logo${inverse ? " logo--inverse" : ""}`}>
      <LogoMark />
      <span className="logo__text" translate="no">
        <span className="logo__ko">항도제일특수브러쉬</span>
        <span className="logo__en">HANDO JEIL SPECIAL BRUSH</span>
      </span>
    </span>
  );
}
