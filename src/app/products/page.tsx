import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { Photo } from "@/components/Photo";
import { categoryLabel, photos, type PhotoCategory } from "@/data/photos";
import "@/styles/pages.css";

export const metadata: Metadata = {
  title: "제품",
  description: "항도제일특수브러쉬가 제작한 롤 브러쉬, 휠 브러쉬, 컵 브러쉬와 제작 공정 사진.",
};

const order: PhotoCategory[] = ["roll", "wheel", "cup", "core", "process"];

export default function ProductsPage() {
  return (
    <>
      <PageHead eyebrow="Products" title="제작 사례">
        <p className="lead">
          항도제일특수브러쉬가 직접 제작한 제품 사진입니다. 대부분 고객 공정에 맞춘 주문제작품이며, 같은 형태라도
          치수·소재·모 배열은 주문마다 달라집니다.
        </p>
        <div className="notice notice--warning">
          <p className="notice__title">제품 분류·소재 정보 확인 중</p>
          <p>사진 설명은 외형을 기준으로 작성했으며, 정확한 제품명과 소재는 회사 확인 후 갱신합니다.</p>
        </div>
        <nav aria-label="제품 분류 바로가기">
          <ul role="list" className="chip-nav">
            {order.map((c) => (
              <li key={c}>
                <a href={`#${c}`} className="tag">
                  {categoryLabel[c]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHead>

      {order.map((cat, i) => {
        const list = photos.filter((p) => p.category === cat);
        return (
          <section
            key={cat}
            id={cat}
            className={`section${i % 2 ? " section--subtle" : ""}`}
            aria-labelledby={`${cat}-title`}
          >
            <div className="container">
              <h2 id={`${cat}-title`} className="h2 gallery__title">
                {categoryLabel[cat]} <span className="tag">{list.length}</span>
              </h2>
              <ul role="list" className="gallery">
                {list.map((p) => (
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
          </section>
        );
      })}

      <section className="section section--dark on-dark">
        <div className="container contact-cta">
          <h2 className="h2">어떤 브러쉬가 맞는지 모르겠다면</h2>
          <p className="lead">작업 목적과 환경만 알려주세요. 검토 후보와 확인할 규격을 정리해 드립니다.</p>
          <Link href="/finder/" className="btn btn--primary btn--lg">
            AI 제작상담 시작
          </Link>
        </div>
      </section>
    </>
  );
}
