import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { Photo } from "@/components/Photo";
import { brushTypes } from "@/data/brushTypes";
import { categoryLabel, photos, type PhotoCategory } from "@/data/photos";
import { ApplicationSearch } from "@/features/applications/ApplicationSearch";
import "@/styles/finder.css";
import "@/styles/home.css";
import "@/styles/pages.css";

export const metadata: Metadata = {
  title: "브러쉬·제품",
  description:
    "연마사·노트형·스파이럴·스트립·세차솔·펀칭·와이어·청소차·특수 롤 브러쉬 — 항도제일특수브러쉬의 브러쉬 종류별 적용 분야와 개발 사례.",
};

const galleryOrder: PhotoCategory[] = ["roll", "wheel", "cup", "core"];

export default function ProductsPage() {
  return (
    <>
      <PageHead eyebrow="Brush & Products" title={<>같은 &lsquo;세척&rsquo;도<br />공정마다 다른 브러쉬가 필요합니다.</>}>
        <p className="lead">
          대상의 형상, 표면의 민감도, 물·약품 조건, 라인 속도가 모두 다르기 때문에 브러쉬도 공정에 맞춰 설계합니다. 아래
          종류는 출발점일 뿐, 대부분의 제품은 의뢰마다 새로 개발합니다.
        </p>
        <nav aria-label="브러쉬 종류 바로가기">
          <ul role="list" className="chip-nav">
            {brushTypes.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="tag">
                  {t.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHead>

      <section className="section" aria-labelledby="types-title">
        <div className="container">
          <h2 id="types-title" className="sr-only">
            브러쉬 종류별 적용 분야
          </h2>
          <ul role="list" className="type-list">
            {brushTypes.map((t, i) => (
              <li key={t.id} id={t.id} className="type-row">
                <div className="type-row__media">
                  {t.photo ? (
                    <Photo id={t.photo} sizes="(min-width: 880px) 360px, 100vw" />
                  ) : (
                    <span className="type-row__placeholder">사진 준비 중</span>
                  )}
                </div>
                <div className="type-row__body">
                  <span className="type-row__num">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="h3">{t.name}</h3>
                  <p className="muted">{t.structure}</p>
                  <p className="type-row__label">주요 적용 분야</p>
                  <ul className="type-row__uses">
                    {t.uses.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--subtle" aria-labelledby="challenge-title">
        <div className="container">
          <div className="band-head">
            <p className="eyebrow">Process Challenges</p>
            <h2 id="challenge-title" className="h2">
              공정별로 풀어야 할 과제
            </h2>
          </div>
          <ApplicationSearch />
        </div>
      </section>

      <section className="section" aria-labelledby="gallery-title">
        <div className="container">
          <div className="band-head">
            <p className="eyebrow">Cases</p>
            <h2 id="gallery-title" className="h2">
              직접 개발·제작한 브러쉬
            </h2>
            <p className="small muted">사진 설명은 외형 기준이며, 정확한 제품명은 회사 확인 후 갱신합니다.</p>
          </div>
          {galleryOrder.map((cat) => (
            <div key={cat} className="gallery-group">
              <h3 className="h3 gallery__title">{categoryLabel[cat]}</h3>
              <ul role="list" className="gallery">
                {photos
                  .filter((p) => p.category === cat)
                  .map((p) => (
                    <li key={p.id}>
                      <figure className="gallery__item">
                        <span className="media gallery__media">
                          <Photo id={p.id} sizes="(min-width: 880px) 400px, 100vw" />
                        </span>
                        <figcaption className="small muted">{p.alt}</figcaption>
                      </figure>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--dark on-dark">
        <div className="container contact-cta">
          <h2 className="h2">우리 공정에 맞는 브러쉬가 필요하다면</h2>
          <p className="lead">해결하려는 문제만 알려주세요. 대표가 검토할 수 있는 의뢰서로 정리해 드립니다.</p>
          <Link href="/finder/" className="btn btn--primary btn--lg">
            AI 제작상담 시작
          </Link>
        </div>
      </section>
    </>
  );
}
