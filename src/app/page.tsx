import Link from "next/link";
import { HeroMedia } from "@/components/HeroMedia";
import { Photo } from "@/components/Photo";
import { brushTypes } from "@/data/brushTypes";
import { company, history } from "@/data/company";
import { devProcess } from "@/data/process";
import "@/styles/home.css";
import "@/styles/pages.css";

const finderSteps = ["해결할 문제", "작업 방식", "작업 조건", "수량·자료"];

export default function Home() {
  return (
    <>
      {/* 01 HERO — 전체 화면 배경 영상 */}
      <section className="hero on-dark" aria-labelledby="hero-title">
        <HeroMedia />
        <div className="hero__shade" aria-hidden="true" />
        <div className="container hero__inner">
          <p className="hero__kicker">
            Since {company.founded} · Busan, Korea
          </p>
          <h1 id="hero-title" className="hero__title">
            시중 브러쉬로 해결되지 않는 공정을 위해,
            <br />
            브러쉬를 개발합니다.
          </h1>
          <p className="hero__en">BRUSH ENGINEERING FOR EVERY PROCESS</p>
          <div className="btn-row hero__cta">
            <Link href="/finder/" className="btn btn--primary btn--lg">
              AI 개발 의뢰서 작성
            </Link>
            <Link href="/applications/" className="btn btn--on-dark btn--lg">
              제품·적용 분야
            </Link>
          </div>
        </div>
        <a className="hero__scroll" href="#statement">
          <span className="sr-only">아래로 이동</span>
          <span aria-hidden="true">SCROLL</span>
        </a>
      </section>

      {/* 02 STATEMENT */}
      <section id="statement" className="section statement" aria-labelledby="statement-title">
        <div className="container statement__grid">
          <h2 id="statement-title" className="h1 statement__title reveal">
            제품을 고르는 것이 아니라,
            <br />
            공정에 맞게 개발합니다.
          </h2>
          <div className="statement__body reveal">
            <p className="lead">
              같은 철강 공정이라도 표면을 닦을지, 물기를 걷어낼지에 따라 전혀 다른 브러쉬가 필요합니다. 연마용
              브러쉬는 용도마다 모양과 크기가 모두 다릅니다. 그래서 고객이 무엇을 해결하려는지부터 묻고, 30년 넘게
              쌓은 경험으로 대표가 직접 소재와 구조를 제안합니다.
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

      {/* 03 PRODUCTS — 브러쉬 종류별 적용 분야 */}
      <section className="section section--dark on-dark products-band" aria-labelledby="types-title">
        <div className="container">
          <div className="band-head reveal">
            <p className="eyebrow">Products &amp; Applications</p>
            <h2 id="types-title" className="h2">
              브러쉬 종류별 적용 분야
            </h2>
          </div>
          <ul role="list" className="type-grid">
            {brushTypes.map((t, i) => (
              <li key={t.id} className="type-tile reveal">
                <Link href={`/applications/#${t.id}`} className="type-tile__link">
                  {t.photo ? (
                    <span className="type-tile__media">
                      <Photo id={t.photo} sizes="(min-width: 880px) 33vw, 100vw" decorative />
                    </span>
                  ) : (
                    <span className="type-tile__media type-tile__media--plain" aria-hidden="true" />
                  )}
                  <span className="type-tile__body">
                    <span className="type-tile__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="type-tile__name">{t.name}</span>
                    <span className="type-tile__uses">{t.uses.slice(0, 3).join(" · ")}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 AI DEV BRIEF */}
      <section className="section finder-promo" aria-labelledby="finder-title">
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

      {/* 05 TECHNOLOGY — 전체 폭 사진 */}
      <section className="tech-band on-dark" aria-labelledby="tech-title">
        <div className="tech-band__media" aria-hidden="true">
          <Photo id="machine-knot-wheel" sizes="100vw" decorative />
        </div>
        <div className="container tech-band__copy reveal">
          <p className="eyebrow">Technology · Equipment</p>
          <h2 id="tech-title" className="h1">
            개발한 브러쉬를
            <br />
            자체 설비에서 직접 만듭니다.
          </h2>
          <p className="lead">
            와이어를 꼬아 원판에 심는 공정부터 롤 코어 가공, 마무리까지 공장에서 직접 진행합니다. 충분한 기술과 경험이
            있어야 공정에 맞는 브러쉬를 만들 수 있습니다.
          </p>
        </div>
      </section>

      {/* 06 PROCESS */}
      <section className="section" aria-labelledby="process-title">
        <div className="container">
          <div className="band-head reveal">
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

      {/* 07 HISTORY */}
      <section className="section section--subtle" aria-labelledby="history-title">
        <div className="container">
          <div className="band-head reveal">
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

      {/* 08 CONTACT */}
      <section className="section section--dark on-dark" aria-labelledby="contact-title">
        <div className="container contact-band">
          <h2 id="contact-title" className="h2">
            개발 의뢰는 카카오톡으로
            <br />
            가장 빠르게 받습니다.
          </h2>
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
