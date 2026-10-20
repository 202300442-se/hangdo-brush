// 항도제일특수브러쉬 HJ 로고 — 기존 홈페이지 로고 화면을 보고 다시 그린 벡터.
// TODO: 회사 원본 로고 파일(AI/SVG/PNG)을 받으면 public/logo/ 의 원본으로 교체
// 로고 표기는 원본 그대로 "HANDO JEIL SPECIAL BRUSH"를 따른다.

export const LOGO_GREEN = "#6FA05F";

export function LogoMark({ size = 40, color = LOGO_GREEN }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="17.2" fill="none" stroke={color} strokeWidth="3.4" />
      {/* H 왼쪽 기둥 + 가로대 */}
      <path d="M13.2 10.5V22.6M13.2 17.4H26.6" fill="none" stroke={color} strokeWidth="3.4" />
      {/* H 오른쪽 기둥이 아래로 내려와 J 갈고리로 휘어짐 */}
      <path d="M26.6 10.5V25.2C26.6 29.4 23.6 31.6 20 31.6C16.6 31.6 14.2 29.8 13.4 27.4" fill="none" stroke={color} strokeWidth="3.4" />
    </svg>
  );
}

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`logo${inverse ? " logo--inverse" : ""}`}>
      <LogoMark />
      <span className="logo__text">
        <span className="logo__ko">항도제일특수브러쉬</span>
        <span className="logo__en">HANDO JEIL SPECIAL BRUSH</span>
      </span>
    </span>
  );
}
