// 회사 기본 정보 — docs/MASTER_BRIEF.md 13절 "확정" 정보만 기재한다.
// 갱신일: 2026-10-20 (출처: 회사 제공)

export const company = {
  nameKo: "항도제일특수브러쉬",
  nameEn: "Hangdo Jeil Special Brush",
  ceo: "김종호",
  bizNo: "605-09-77705",
  founded: 1995,
  address: "부산광역시 강서구 대저2동 2424-1",
  phone: "051-315-4012",
  fax: "051-315-4012", // TODO: 팩스 번호가 전화와 동일한지 확인 필요
  email: "hokim18@nate.com",
  kakaoChannel: "https://pf.kakao.com/_qezQn",
  kakaoChat: "https://pf.kakao.com/_qezQn/chat",
  naverMap:
    "https://map.naver.com/p/search/" + encodeURIComponent("부산 강서구 대저2동 2424-1"),
  youtube: [
    { id: "hlAkSl3nWv0", title: "항도제일특수브러쉬 영상 1" },
    { id: "V9ke9P5-acE", title: "항도제일특수브러쉬 영상 2" },
    { id: "AEDFOE5fz-c", title: "항도제일특수브러쉬 영상 3" },
  ],
  dataUpdated: "2026-10-20",
} as const;

export const history = [
  { year: 1995, title: "항도제일특수브러쉬 사업 시작" },
  { year: 1999, title: "일본 거래처 대상 수출 시작" },
  { year: 2020, title: "백년소상공인 선정" }, // TODO: 선정 연도·명칭 확인
  { year: 2026, title: "쉴드브러쉬 관련 특허", note: "특허 명칭·번호 확인 후 갱신" },
] as const;

export const yearsInBusiness = (now = new Date()) => now.getFullYear() - company.founded;
