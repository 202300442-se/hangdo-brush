// 브러쉬 종류별 적용 분야
// 종류 9가지: 기존 회사 홈페이지(jeilbrush.com) 제품소개 메뉴 그대로.
// 구조 설명·적용 분야: 각 브러쉬 종류의 일반적인 산업 용도 + 2026-10-20 대표 인터뷰에서 확인한 적용 분야를 연결해 정리.
// TODO: COMPANY EXPERT REVIEW REQUIRED — 종류별 적용 분야 연결은 대표 확인 필요
// photo: 회사 사진 중 해당 종류로 판단되는 것만 연결. 확신이 없으면 비워 둔다.

export type BrushType = {
  id: string;
  name: string;
  /** 어떤 구조의 브러쉬인지 */
  structure: string;
  /** 주요 적용 분야 */
  uses: string[];
  photo?: string;
};

export const brushTypes: BrushType[] = [
  {
    id: "abrasive",
    name: "연마사 브러쉬",
    structure: "연마 입자가 들어간 나일론 모로, 표면을 깎지 않고 다듬는 브러쉬",
    uses: ["가공품 버(Burr) 제거", "금속·판재 표면 연마와 마감", "모서리 라운딩", "녹·산화막 정리"],
    photo: "roll-abrasive-grey",
  },
  {
    id: "knot",
    name: "노트형 롤 브러쉬",
    structure: "와이어를 꼬아 다발로 심어, 강한 연삭력과 내구성을 가진 롤 브러쉬",
    uses: ["철강 스케일·녹 제거", "강판·코일 표면 처리", "용접 슬래그·비드 정리", "고하중 연속 라인"],
    photo: "roll-knot-wire-side",
  },
  {
    id: "spiral",
    name: "스파이럴 롤 브러쉬",
    structure: "띠 형태의 브러쉬를 축에 나선형으로 감아, 폭과 밀도를 자유롭게 설계하는 롤 브러쉬",
    uses: ["철강 표면 세척", "철강 물기 제거", "농산물 세척 (무 등)", "수산물 세척 (가리비 등)", "컨베이어 세척"],
  },
  {
    id: "strip",
    name: "스트립 브러쉬",
    structure: "일자형 채널에 모를 고정한 브러쉬로, 길이를 자유롭게 맞추는 형태",
    uses: ["설비 틈새 밀폐·분진 차단", "셔터·도어 하부 차단", "컨베이어 가이드·이송", "낙하물 차단"],
  },
  {
    id: "carwash",
    name: "세차솔 브러쉬",
    structure: "자동 세차 설비에 장착하는 대형 회전 브러쉬",
    uses: ["버스 세척", "철도 차량 세척", "자동세차기"],
  },
  {
    id: "punching",
    name: "펀칭 브러쉬",
    structure: "몸체에 구멍을 내고 모 다발을 촘촘히 심는 브러쉬로, 모 배열과 밀도를 정밀하게 설계",
    uses: ["농산물 세척 (무 등)", "수산물 세척 (가리비 등)", "신발 세척", "식품 설비·산업용 세척기"],
    photo: "roll-blue-filament-front",
  },
  {
    id: "wire",
    name: "와이어 브러쉬",
    structure: "스틸·스테인리스·황동 와이어로 만든 휠·컵 브러쉬",
    uses: ["녹·도장 제거", "용접부 정리", "금속 가공품 버 제거", "그라인더·설비 장착용"],
    photo: "wheel-knot-set-a",
  },
  {
    id: "sweeper",
    name: "청소차 브러쉬",
    structure: "노면 청소차의 사이드·메인 브러쉬",
    uses: ["도로 노면 청소", "공장·물류 바닥 청소"],
  },
  {
    id: "special",
    name: "특수 롤 브러쉬",
    structure: "정해진 규격 없이, 공정 조건에 맞춰 처음부터 설계하는 롤 브러쉬",
    uses: ["기존 브러쉬로 해결되지 않는 공정", "설비 신규 구성", "특수 소재·특수 환경"],
  },
];
