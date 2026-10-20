import type { Metadata } from "next";
import { BrushFinder } from "@/features/finder/BrushFinder";
import "@/styles/finder.css";

export const metadata: Metadata = {
  title: "AI 제작상담 — 브러쉬 이름을 몰라도 괜찮습니다",
  description:
    "해결하려는 문제와 작업 환경을 단계별로 답하면, 대표가 바로 검토할 수 있는 브러쉬 개발 의뢰서를 정리해 드립니다.",
};

export default function FinderPage() {
  return (
    <>
      <section className="page-head finder-head">
        <div className="container page-head__inner">
          <p className="eyebrow">AI 제작상담 · 개발 의뢰서 작성</p>
          <h1 className="h1">브러쉬 이름을 모르셔도 괜찮습니다.</h1>
          <p className="lead">
            무엇을, 어떤 상태로 만들고 싶은지만 알려주세요. 상담에 필요한 정보를 개발 의뢰서로 정리해 드립니다. 약
            2분이면 끝나며, 기술 질문은 모두 &lsquo;잘 모르겠습니다&rsquo;로 넘어갈 수 있습니다.
          </p>
          <ul role="list" className="finder-facts small">
            <li>현재 버전은 규칙 기반 정리 도우미입니다 (AI 모델 미사용)</li>
            <li>입력 내용은 저장·전송되지 않습니다</li>
            <li>소재와 구조는 대표가 공정을 확인한 뒤 직접 제안합니다</li>
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
