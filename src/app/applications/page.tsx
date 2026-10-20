import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { devProcess } from "@/data/process";
import { ApplicationSearch } from "@/features/applications/ApplicationSearch";
import "@/styles/finder.css";
import "@/styles/pages.css";

export const metadata: Metadata = {
  title: "적용 분야 · 개발 프로세스",
  description:
    "철도 차량·버스·신발·수산물·농산물 세척, 철강 표면 세척과 물기 제거, 연마까지 — 항도제일특수브러쉬가 공정에 맞춰 개발해 온 산업용 브러쉬 적용 분야.",
};

export default function ApplicationsPage() {
  return (
    <>
      <PageHead eyebrow="Applications" title={<>같은 &lsquo;세척&rsquo;도<br />공정마다 다른 브러쉬가 필요합니다.</>}>
        <p className="lead">
          기차와 가리비, 철강 표면과 철강 물기는 모두 다른 브러쉬로 해결합니다. 항도제일특수브러쉬는 정해진 제품을
          파는 대신, 공정을 확인하고 그에 맞는 브러쉬를 개발합니다.
        </p>
      </PageHead>

      <section className="section">
        <div className="container">
          <ApplicationSearch />
        </div>
      </section>

      <section className="section section--subtle" aria-labelledby="process-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Development Process</p>
            <h2 id="process-title" className="h2">
              이렇게 개발합니다
            </h2>
            <p className="lead">시중 브러쉬로 해결되지 않는 공정일수록 처음 확인하는 정보가 중요합니다.</p>
          </div>
          <ol role="list" className="process">
            {devProcess.map((s, i) => (
              <li key={s.title} className="process__step">
                <span className="process__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="process__title h3">{s.title}</span>
                <span className="small muted">{s.desc}</span>
              </li>
            ))}
          </ol>
          <Link href="/finder/" className="btn btn--primary btn--lg">
            1단계 — AI 개발 의뢰서 작성
          </Link>
        </div>
      </section>
    </>
  );
}
