import Link from "next/link";
import { Photo } from "@/components/Photo";
import { company, history } from "@/data/company";
import "@/styles/home.css";

const productPaths = [
  { photo: "roll-abrasive-grey", title: "롤 브러쉬", desc: "세척·연마·이송 공정에 쓰이는 긴 원통형 브러쉬" },
  { photo: "wheel-knot-set-a", title: "휠 브러쉬", desc: "녹·버 제거와 표면 처리에 쓰이는 원판형 브러쉬" },
  { photo: "cup-knot-set", title: "컵 브러쉬", desc: "공구에 장착해 넓은 면을 처리하는 컵형 브러쉬" },
  { photo: "roll-blue-filament-stack", title: "주문제작", desc: "치수·소재·모 배열을 공정에 맞춰 제작" },
];

const finderSteps = ["작업 목적", "사용 방식", "규격·환경", "수량·납기"];

export default function Home() {
  return (
    <>
      {/* 01 HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <p className="eyebrow">Industrial Brush Solution · Since {company.founded}</p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line">
              BRUSH
              <span className="hero__capsule media media--capsule" aria-hidden="true">
                <Photo id="roll-brass-wire" sizes="(min-width: 880px) 260px, 140px" decorative priority />
              </span>
            </span>
            <span className="hero__line">ENGINEERING</span>
            <span className="hero__line">
              <span className="hero__capsule hero__capsule--wide media media--capsule" aria-hidden="true">
                <Photo id="machine-knot-wheel" sizes="(min-width: 880px) 360px, 180px" decorative priority />
              </span>
              FOR EVERY
            </span>
            <span className="hero__line">PROCESS</span>
            <span className="sr-only"> — 산업 현장의 문제를 해결하는 Brush Solution Company</span>
          </h1>
          <div className="hero__copy">
            <p className="hero__ko">
              산업 현장의 문제를 해결하는
              <br />
              Brush Solution Company
            </p>
            <p className="lead">
              다양한 산업 공정과 작업 환경에 맞춘 산업용 브러쉬를 설계·제작합니다. 1995년부터 부산에서 롤·휠·컵
              브러쉬를 주문제작해 왔습니다.
            </p>
            <div className="btn-row">
              <Link href="/finder/" className="btn btn--primary btn--lg">
                AI 제작상담 시작
              </Link>
              <Link href="/products/" className="btn btn--secondary btn--lg">
                제품 살펴보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 02 BRAND STATEMENT */}
      <section className="section statement" aria-labelledby="statement-title">
        <div className="container statement__grid">
          <div className="reveal">
            <p className="eyebrow">Custom Manufacturing</p>
            <h2 id="statement-title" className="h1 statement__title">
              제품을 고르는 것이 아니라,
              <br />
              공정에 맞게 제작합니다.
            </h2>
          </div>
          <div className="statement__body reveal">
            <p className="lead">
              같은 &lsquo;롤 브러쉬&rsquo;라도 대상물, 회전 속도, 물·약품 사용 여부에 따라 맞는 소재와 모 배열이
              달라집니다. 항도제일특수브러쉬는 고객의 작업 조건을 먼저 확인하고 그에 맞춰 브러쉬를 제작합니다.
            </p>
            <dl className="facts">
              <div>
                <dt>Since</dt>
                <dd>{company.founded}</dd>
              </div>
              <div>
                <dt>Japan Export</dt>
                <dd>1999</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>30년 이상</dd>
              </div>
              <div>
                <dt>Made in</dt>
                <dd>Busan, Korea</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* 03 AI BRUSH FINDER */}
      <section className="section section--dark finder-promo on-dark" aria-labelledby="finder-title">
        <div className="container finder-promo__grid">
          <div className="reveal">
            <p className="eyebrow">AI Brush Finder</p>
            <h2 id="finder-title" className="h1">
              브러쉬 이름을
              <br />
              모르셔도 괜찮습니다.
            </h2>
            <p className="lead">
              사용 목적과 작업 환경을 알려주시면 제작 상담에 필요한 정보를 단계별로 정리해 드립니다. 기술 질문은
              모두 &lsquo;잘 모르겠습니다&rsquo;로 넘어갈 수 있습니다.
            </p>
            <div className="btn-row">
              <Link href="/finder/" className="btn btn--primary btn--lg">
                2분 상담 시작
              </Link>
            </div>
          </div>
          <ol className="promo-steps reveal" role="list">
            {finderSteps.map((s, i) => (
              <li key={s}>
                <span className="promo-steps__num">0{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
            <li className="promo-steps__out">
              <span className="promo-steps__num">→</span>
              <span>검토 후보 · 확인할 규격 · 문의 요약</span>
            </li>
          </ol>
        </div>
      </section>

      {/* 04 PRODUCTS */}
      <section className="section" aria-labelledby="products-title">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Products</p>
            <h2 id="products-title" className="h2">
              현장에서 쓰이는 브러쉬
            </h2>
            <p className="lead">모든 사진은 항도제일특수브러쉬가 직접 제작한 제품입니다.</p>
          </div>
          <ul role="list" className="product-grid">
            {productPaths.map((p) => (
              <li key={p.title} className="product-card reveal">
                <Link href="/products/" className="product-card__link">
                  <span className="product-card__media media">
                    <Photo id={p.photo} sizes="(min-width: 880px) 300px, 50vw" />
                  </span>
                  <span className="product-card__title h3">{p.title}</span>
                  <span className="product-card__desc small muted">{p.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 05 TECHNOLOGY */}
      <section className="section section--subtle" aria-labelledby="tech-title">
        <div className="container tech">
          <div className="tech__media media reveal">
            <Photo id="machine-knot-detail" sizes="(min-width: 880px) 50vw, 100vw" />
          </div>
          <div className="tech__copy reveal">
            <p className="eyebrow">Technology · Equipment</p>
            <h2 id="tech-title" className="h2">
              원자재에서 완제품까지,
              <br />
              공장에서 직접 만듭니다.
            </h2>
            <p className="lead">
              와이어를 꼬아 원판에 심는 공정부터 롤 코어 가공, 마무리 검수까지 자체 설비에서 진행합니다.
            </p>
            <p className="small muted">설비 사양과 공정 상세는 확인 후 공개 예정입니다.</p>
          </div>
        </div>
      </section>

      {/* 06 HISTORY */}
      <section className="section" aria-labelledby="history-title">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">History</p>
            <h2 id="history-title" className="h2">
              현장에서 시작해 기술로 성장해 왔습니다.
            </h2>
          </div>
          <ol role="list" className="timeline">
            {history.map((h) => (
              <li key={h.year} className="timeline__item reveal">
                <span className="timeline__year">{h.year}</span>
                <span className="timeline__title">{h.title}</span>
              </li>
            ))}
          </ol>
          <Link href="/company/" className="btn btn--ghost">
            회사소개 자세히 →
          </Link>
        </div>
      </section>

      {/* 07 CONTACT */}
      <section className="section section--dark on-dark" aria-labelledby="contact-title">
        <div className="container contact-band">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 id="contact-title" className="h2">
              제작 문의는 카카오톡으로
              <br />
              가장 빠르게 받습니다.
            </h2>
          </div>
          <div className="btn-row">
            <a className="btn btn--kakao btn--lg" href={company.kakaoChannel} target="_blank" rel="noopener noreferrer">
              카카오톡 상담<span className="sr-only"> (새 창)</span>
            </a>
            <a className="btn btn--on-dark btn--lg" href={`tel:${company.phone}`}>
              {company.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
