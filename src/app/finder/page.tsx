import type { Metadata } from "next";
import { BrushFinder } from "@/features/finder/BrushFinder";
import "@/styles/finder.css";

export const metadata: Metadata = {
  title: "AI 제작상담 — 브러쉬 이름을 몰라도 괜찮습니다",
  description:
    "작업 목적과 사용 환경을 단계별로 답하면 검토 후보 형태·소재, 확인이 필요한 규격, 제작 문의 요약을 정리해 드립니다.",
};

export default function FinderPage() {
  return (
    <>
      <section className="page-head finder-head">
        <div className="container page-head__inner">
          <p className="eyebrow">AI Brush Finder</p>
          <h1 className="h1">브러쉬 이름을 모르셔도 괜찮습니다.</h1>
          <p className="lead">
            사용 목적과 작업 환경을 알려주시면 제작 상담에 필요한 정보를 단계별로 정리해 드립니다. 약 2분이면
            끝나며, 기술 질문은 모두 &lsquo;잘 모르겠습니다&rsquo;로 넘어갈 수 있습니다.
          </p>
          <ul role="list" className="finder-facts small">
            <li>현재 버전은 규칙 기반 상담 도우미(데모)입니다</li>
            <li>입력 내용은 저장·전송되지 않습니다</li>
            <li>최종 사양은 기술 담당자가 확정합니다</li>
          </ul>
        </div>
      </section>
      <section className="section finder-section">
        <div className="container">
          <BrushFinder />
        </div>
      </section>
    </>
  );
}
