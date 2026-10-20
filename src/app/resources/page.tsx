import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { company } from "@/data/company";
import "@/styles/pages.css";

export const metadata: Metadata = {
  title: "자료실",
  description: "항도제일특수브러쉬 카탈로그, 설비·제품 영상, 자주 묻는 질문.",
};

// FAQ — 회사 운영 방식에서 확인된 내용만 답한다 (최소 수량·납기·가격 정책은 확인 전이라 넣지 않음)
const faqs = [
  {
    q: "브러쉬 이름이나 규격을 몰라도 문의할 수 있나요?",
    a: "네. AI 제작상담에서 무엇을, 어떤 상태로 만들고 싶은지만 답하시면 필요한 정보가 의뢰서로 정리됩니다. 모르는 항목은 '잘 모르겠습니다'로 넘어가도 됩니다.",
  },
  {
    q: "소재는 누가 정하나요?",
    a: "공정과 사용 환경을 확인한 뒤 대표가 직접 소재와 구조를 제안합니다. 원하는 소재가 있으면 의뢰서에 적어 주세요.",
  },
  {
    q: "사진이나 도면은 어떻게 보내나요?",
    a: "카카오톡 채널이나 메일로 의뢰서와 함께 보내 주세요. 작업 현장 사진이나 짧은 영상이 있으면 검토가 빨라집니다.",
  },
  {
    q: "주문한 제품의 진행 상황은 어디서 보나요?",
    a: "주문조회에서 주문번호와 조회 코드를 입력하면 확인할 수 있습니다. 조회 코드는 주문 확정 시 거래처에만 따로 알려 드립니다. (현재는 데모 운영)",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHead eyebrow="Resources" title="자료실" />

      <section className="section" aria-labelledby="catalog-title">
        <div className="container res-grid">
          <article className="res-card">
            <h2 id="catalog-title" className="h3">
              제품 카탈로그
            </h2>
            <p className="muted">카탈로그를 준비하고 있습니다. 필요한 자료가 있으면 고객센터로 문의해 주세요.</p>
            <span className="tag">준비 중</span>
          </article>
          <article className="res-card">
            <h2 className="h3">설비·제품 영상</h2>
            <p className="muted">유튜브 채널에서 제작 공정과 설비 영상을 볼 수 있습니다.</p>
            <ul className="res-links">
              {company.youtube.map((v) => (
                <li key={v.id}>
                  <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer">
                    {v.title}
                    <span className="sr-only"> (유튜브, 새 창)</span>
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section section--subtle" aria-labelledby="faq-title">
        <div className="container container--narrow">
          <h2 id="faq-title" className="h2 band-head">
            자주 묻는 질문
          </h2>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q} className="faq__item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p className="faq__more">
            더 궁금한 점은 <Link href="/contact/">고객센터</Link>로 문의해 주세요.
          </p>
        </div>
      </section>
    </>
  );
}
