import Link from "next/link";
import { Photo } from "@/components/Photo";
import { applications } from "@/data/applications";
import { company, history } from "@/data/company";
import { devProcess } from "@/data/process";
import "@/styles/home.css";
import "@/styles/pages.css";

const cases = [
  { photo: "roll-blue-filament-stack", title: "세척용 롤 브러쉬" },
  { photo: "roll-knot-wire-side", title: "꼬임 와이어 브러쉬" },
  { photo: "roll-abrasive-grey", title: "연마용 롤 브러쉬" },
  { photo: "wheel-knot-hangdo-mark", title: "휠 브러쉬" },
];

const finderSteps = ["해결할 문제", "작업 방식", "작업 조건", "수량·자료"];

export default function Home() {
  return (
    <>
      {/* 01 HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <p className="eyebrow">Custom Brush Development · Since {company.founded}</p>
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
            <span className="sr-only"> — 시중 브러쉬로 해결되지 않는 공정을 위해, 브러쉬를 개발합니다.</span>
          </h1>
          <div className="hero__copy">
            <p className="hero__ko">
              시중 브러쉬로 해결되지 않는 공정을 위해,
              <br />
              브러쉬를 개발합니다.
            </p>
            <p className="lead">
              항도제일특수브러쉬는 정해진 제품을 파는 회사가 아닙니다. 고객의 공정을 확인하고, 30년 넘게 쌓은 경험으로
              대표가 직접 소재와 구조를 제안해 브러쉬를 만듭니다.
            </p>
            <div className="btn-row">
              <Link href="/finder/" className="btn btn--primary btn--lg">
                AI 개발 의뢰서 작성
              </Link>
              <Link href="/applications/" className="btn btn--secondary btn--lg">
                적용 분야 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 02 STATEMENT */}
      <section className="section statement" aria-labelledby="statement-title">
        <div className="container statement__grid">
          <div className="reveal">
            <p className="eyebrow">Development, not catalog</p>
            <h2 id="statement-title" className="h1 statement__title">
              제품을 고르는 것이 아니라,
              <br />
              공정에 맞게 개발합니다.
            </h2>
          </div>
          <div className="statement__body reveal">
            <p className="lead">
              같은 철강 공정이라도 표면을 닦을지, 물기를 걷어낼지에 따라 전혀 다른 브러쉬가 필요합니다. 연마용
              브러쉬는 용도마다 모양과 크기가 모두 다릅니다. 그래서 저희는 고객이 무엇을 해결하려는지부터 묻습니다.
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

      {/* 03 APPLICATIONS */}
      <section className="section section--subtle" aria-labelledby="apps-title">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Applications</p>
            <h2 id="apps-title" className="h2">
              기차부터 가리비까지,
              <br />
              공정마다 다른 브러쉬를 만들어 왔습니다.
            </h2>
          </div>
          <ul role="list" className="app-list reveal">
            {applications.map((a) => (
              <li key={a.id} className="app-item">
                <span className="small muted">{a.group}</span>
                <span className="app-item__title">{a.title}</span>
              </li>
            ))}
          </ul>
          <div className="home-more">
            <Link href="/applications/" className="btn btn--ghost">
              적용 분야와 개발 프로세스 →
            </Link>
          </div>
        </div>
      </section>

      {/* 04 AI DEV BRIEF */}
      <section className="section section--dark finder-promo on-dark" aria-labelledby="finder-title">
        <div className="container finder-promo__grid">
          <div className="reveal">
            <p className="eyebrow">AI 개발 의뢰서</p>
            <h2 id="finder-title" className="h1">
              브러쉬 이름을
              <br />
              모르셔도 괜찮습니다.
            </h2>
            <p className="lead">
              무엇을, 어떤 상태로 만들고 싶은지만 알려주세요. 대표가 바로 검토할 수 있도록 조건과 필요한 정보를 개발
              의뢰서로 정리해 드립니다.
            </p>
            <div className="btn-row">
              <Link href="/finder/" className="btn btn--primary btn--lg">
                2분 의뢰서 작성
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
              <span>개발 의뢰서 → 대표 검토 → 소재·구조 제안</span>
            </li>
          </ol>
        </div>
      </section>

      {/* 05 PROCESS */}
      <section className="section" aria-labelledby="process-title">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Development Process</p>
            <h2 id="process-title" className="h2">
              이렇게 개발합니다
            </h2>
          </div>
          <ol role="list" className="process reveal">
            {devProcess.map((s, i) => (
              <li key={s.title} className="process__step">
                <span className="process__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="process__title h3">{s.title}</span>
                <span className="small muted">{s.desc}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 06 CASES */}
      <section className="section section--subtle" aria-labelledby="cases-title">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Cases</p>
            <h2 id="cases-title" className="h2">
              직접 개발하고 제작한 브러쉬
            </h2>
            <p className="lead">모든 사진은 항도제일특수브러쉬가 직접 만든 제품입니다.</p>
          </div>
          <ul role="list" className="product-grid">
            {cases.map((p) => (
              <li key={p.title} className="product-card reveal">
                <Link href="/products/" className="product-card__link">
                  <span className="product-card__media media">
                    <Photo id={p.photo} sizes="(min-width: 880px) 300px, 50vw" />
                  </span>
                  <span className="product-card__title h3">{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 07 TECHNOLOGY */}
      <section className="section" aria-labelledby="tech-title">
        <div className="container tech">
          <div className="tech__media media reveal">
            <Photo id="machine-knot-detail" sizes="(min-width: 880px) 50vw, 100vw" />
          </div>
          <div className="tech__copy reveal">
            <p className="eyebrow">Technology · Equipment</p>
            <h2 id="tech-title" className="h2">
              개발한 브러쉬를
              <br />
              자체 설비에서 직접 만듭니다.
            </h2>
            <p className="lead">
              와이어를 꼬아 원판에 심는 공정부터 롤 코어 가공, 마무리까지 공장에서 직접 진행합니다. 충분한 기술과 경험이
              있어야 공정에 맞는 브러쉬를 만들 수 있습니다.
            </p>
            <p className="small muted">설비 사양과 공정 상세는 확인 후 공개 예정입니다.</p>
          </div>
        </div>
      </section>

      {/* 08 HISTORY */}
      <section className="section section--subtle" aria-labelledby="history-title">
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

      {/* 09 CONTACT */}
      <section className="section section--dark on-dark" aria-labelledby="contact-title">
        <div className="container contact-band">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 id="contact-title" className="h2">
              개발 의뢰는 카카오톡으로
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
