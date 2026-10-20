# 항도제일특수브러쉬 홈페이지 — 작업 규칙

## 문서
- 전체 기획: docs/MASTER_BRIEF.md
- 중간고사 실행 계획(우선): docs/PLAN.md — 마감 2026-10-21 11:59 KST
- 저장소: 202300442-se/hangdo-brush → https://202300442-se.github.io/hangdo-brush/

## 우선순위
중간고사 핵심 흐름(홈 → AI 개발 의뢰서 → 결과 → 의뢰서 복사·전달)이 끝까지 작동하는 것이 최우선. 장식·부가 기능 때문에 이를 희생하지 않는다.

## 사실 규칙
- docs/MASTER_BRIEF.md 13절의 "확정" 정보만 사실로 쓴다. 나머지는 TODO 또는 "확인 중"으로 표시.
- 회사 업력은 "1995년 창업 / 30년 이상". "40년" 금지.
- "국내 1위/최고/유일/세계 최고" 금지. 제품 사양·인증·고객사·수치를 지어내지 않는다.
- 브러쉬 형태·소재를 추천하지 않는다. 소재·구조는 "공정을 확인한 뒤 대표가 직접 제안"으로 안내한다 (2026-10-20 대표 인터뷰).
- 회사 포지셔닝: 기성품 판매가 아닌 맞춤 개발. 적용 분야는 src/data/applications.ts(대표 확인분)만 사용.

## 기술
- Next.js (App Router) + TypeScript. 지금은 `output: 'export'` 정적 빌드 + basePath `/hangdo-brush` → GitHub Pages. 11월에 같은 코드로 Vercel 이전.
- 일반 CSS + 토큰(src/styles/tokens.css), Pretendard. 공개 사이트에 관리자 기능을 넣지 않는다(관리자는 별도 앱).
- UI → services/* → engine/provider 구조. UI에 추천 로직을 넣지 않는다.
- 추가 의존성은 꼭 필요할 때만. UI 컴포넌트 라이브러리 사용 금지.
- API 키·비밀값을 저장소에 넣지 않는다. 개인정보를 수집·저장하지 않는다.

## UI 규칙
- 화면·컴포넌트를 바꿀 때는 `.claude/skills/web-interface-guidelines` 스킬(Vercel Web Interface Guidelines)을 따른다.
- 인위적인 효과(입자·눈송이·과한 빛줄기) 금지. 모션은 transform/opacity 위주, 동작 줄이기 설정 존중.
- 브랜드 기준: docs/BRAND.md (캐치프레이즈 "산업 현장의 문제를 해결하는 Brush Solution Company")

## 품질
- 상태: 로딩 / 정상 / 빈 결과 / 오류 / 잘못된 입력 — 각각 이유와 할 일을 안내
- 접근성: 키보드 초점 표시, aria-live 상태 안내, 레이블, prefers-reduced-motion
- 360~390px 폭에서 가로 넘침 없음
- 커밋 전: npm run build, npm test 통과

## git
- 이 폴더는 독립 저장소. 상위 폴더(C:\Users\김시은)의 git 저장소를 건드리지 않는다.
- 테스트를 통과하지 않았거나 배포 URL을 확인하지 않았으면 완료라고 말하지 않는다.
