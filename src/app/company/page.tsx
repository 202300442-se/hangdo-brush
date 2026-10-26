import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { Photo } from "@/components/Photo";
import { company, history } from "@/data/company";
import "@/styles/home.css";
import "@/styles/pages.css";

export const metadata: Metadata = {
  title: "회사소개",
  description: "1992년 부산에서 시작한 산업용 브러쉬 주문제작 기업 항도제일특수브러쉬의 인사말, 연혁, 오시는 길.",
};

export default function CompanyPage() {
  return (
    <>
      <PageHead eyebrow="Company" title={<>공정의 완성도를 높이는<br />브러쉬 솔루션 기업</>}>
        <p className="lead">
          {company.nameKo}({company.nameEn})는 {company.founded}년부터 산업 현장에 맞춘 브러쉬를 제작해 왔습니다.
        </p>
      </PageHead>

      <section className="section" aria-labelledby="ceo-title">
        <div className="container split">
          <div className="split__media media">
            <Photo id="wheel-knot-hangdo-mark" sizes="(min-width: 880px) 45vw, 100vw" />
          </div>
          <div className="prose">
            <p className="eyebrow">CEO Message</p>
            <h2 id="ceo-title" className="h2">대표 인사말</h2>
            <p>안녕하십니까. {company.nameKo} 대표 {company.ceo}입니다.</p>
            <p>
              {company.nameKo}는 산업 현장의 다양한 요구에 맞춘 브러쉬를 제작하며 축적된 현장 경험과 기술 노하우를
              바탕으로 성장해 왔습니다.
            </p>
            <p>
              산업용 브러쉬는 세척, 연마, 표면처리, 이물질 제거 등 다양한 제조 공정에서 품질과 생산성에 영향을 미치는
              중요한 요소입니다.
            </p>
            <p>
              저희는 단순히 제품을 공급하는 데 그치지 않고 고객의 공정과 작업 환경을 이해하고, 이에 적합한 브러쉬
              제작 방향을 함께 고민하는 것을 중요하게 생각합니다.
            </p>
            <p>
              앞으로도 축적된 경험과 지속적인 기술 개선을 바탕으로 국내외 산업 현장에서 신뢰받는 파트너가
              되겠습니다.
            </p>
            <p className="prose__sign">
              대표 <strong>{company.ceo}</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="section section--subtle" aria-labelledby="history-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">History</p>
            <h2 id="history-title" className="h2">현장에서 시작해 기술로 성장해 왔습니다.</h2>
          </div>
          <ol role="list" className="timeline">
            {history.map((h) => (
              <li key={h.year} className="timeline__item">
                <span className="timeline__year">{h.year}</span>
                <span className="timeline__title">
                  {h.title}
                  {"note" in h && <span className="small muted timeline__note">{h.note}</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="location-title">
        <div className="container split">
          <div className="prose">
            <p className="eyebrow">Location</p>
            <h2 id="location-title" className="h2">찾아오시는 길</h2>
            <dl className="info-list">
              <div>
                <dt>주소</dt>
                <dd>{company.address}</dd>
              </div>
              <div>
                <dt>전화</dt>
                <dd>
                  <a href={`tel:${company.phone}`}>{company.phone}</a>
                </dd>
              </div>
              <div>
                <dt>팩스</dt>
                <dd>{company.fax}</dd>
              </div>
              <div>
                <dt>이메일</dt>
                <dd>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </dd>
              </div>
            </dl>
            <div className="btn-row">
              <a className="btn btn--primary" href={company.naverMap} target="_blank" rel="noopener noreferrer">
                네이버지도에서 보기<span className="sr-only"> (새 창)</span>
              </a>
              <Link className="btn btn--secondary" href="/contact/">
                문의하기
              </Link>
            </div>
          </div>
          <div className="split__media media">
            <Photo id="wire-spools" sizes="(min-width: 880px) 45vw, 100vw" />
          </div>
        </div>
      </section>
    </>
  );
}
