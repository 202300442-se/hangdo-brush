import Link from "next/link";
import { HeroMedia } from "@/components/HeroMedia";
import { CountUp } from "@/components/CountUp";
import { MaterialChips } from "@/components/MaterialChips";
import { SectionDots } from "@/components/SectionDots";
import { FullPageScroll } from "@/components/FullPageScroll";
import { SplitWords } from "@/components/SplitWords";
import { Photo } from "@/components/Photo";
import { brushTypes } from "@/data/brushTypes";
import { company } from "@/data/company";
import { materials } from "@/data/materials";
import "@/styles/glass.css";
import "@/styles/home.css";
import "@/styles/pages.css";
import "@/styles/snap.css";

// 홈 스크롤 순서: 배경 영상 → 회사소개 → 찾아오시는 길 → 커스텀 엔지니어링 → 제작문의 → 브러쉬·제품 → 소재·기술
// 넓은 화면에서는 한 번 스크롤할 때마다 화면 한 장씩 넘어간다 (snap.css + FullPageScroll)
const SECTIONS = [
  { id: "top", label: "처음" },
  { id: "company", label: "회사소개" },
  { id: "location", label: "찾아오시는 길" },
  { id: "engineering", label: "커스텀 엔지니어링" },
  { id: "inquiry", label: "제작문의" },
  { id: "brushes", label: "브러쉬·제품" },
  { id: "tech", label: "소재·기술" },
];
const SECTION_IDS = SECTIONS.map((s) => s.id);

export default function Home() {
  return (
    <div className="snap-page">
      <SectionDots items={SECTIONS} />
      <FullPageScroll ids={SECTION_IDS} />
      {/* 01 HERO */}
      <section id="top" className="hero on-dark snap" aria-labelledby="hero-title">
        <HeroMedia />
        <div className="hero__shade" aria-hidden="true" />
        <div className="container hero__inner">
          <p className="hero__kicker">Since {company.founded} · Busan, Korea</p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line">산업 현장의 문제를 해결하는</span>
            <span className="hero__line hero__line--en" translate="no">
              Brush Solution Company
            </span>
          </h1>
          <p className="hero__en">고객의 공정에 맞춰 브러쉬를 개발합니다</p>
          <div className="btn-row hero__cta">
            <Link href="/finder/" className="btn btn--light btn--lg">
              AI 제작상담 시작
            </Link>
          </div>
        </div>
        <a className="hero__scroll" href="#company">
          <span className="sr-only">아래로 이동</span>
          <span aria-hidden="true">SCROLL</span>
        </a>
      </section>

      {/* 02 회사소개 */}
      <section id="company" className="panel snap" aria-labelledby="company-title">
        <div className="container panel__split">
          <div className="panel__copy reveal">
            <p className="eyebrow">회사소개</p>
            <h2 id="company-title" className="h1 scroll-ink">
              제품을 고르는 것이 아니라,
              <br />
              공정에 맞게 개발합니다.
            </h2>
            <p className="lead">
              같은 철강 공정이라도 표면을 닦을지, 물기를 걷어낼지에 따라 전혀 다른 브러쉬가 필요합니다. 항도제일특수브러쉬는
              고객이 무엇을 해결하려는지부터 묻고, 30년 넘게 쌓은 경험으로 대표가 직접 소재와 구조를 제안합니다.
            </p>
            <dl className="facts">
              <div>
                <dt>Since</dt>
                <dd>
                  <CountUp to={company.founded} from={1950} />
                </dd>
              </div>
              <div>
                <dt>Japan Export</dt>
                <dd>
                  <CountUp to={1999} from={1950} />
                </dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>
                  <CountUp to={30} from={0} />년 이상
                </dd>
              </div>
              <div>
                <dt>Made in</dt>
                <dd>Busan, Korea</dd>
              </div>
            </dl>
            <Link href="/company/" className="panel__more">
              회사소개 자세히 보기 →
            </Link>
          </div>
          <div className="panel__media scroll-zoom">
            <Photo id="wheel-knot-hangdo-mark" sizes="(min-width: 880px) 50vw, 100vw" />
          </div>
        </div>
      </section>

      {/* 03 찾아오시는 길 */}
      <section id="location" className="panel panel--dark on-dark snap" aria-labelledby="location-title">
        <div className="panel__bg scroll-zoom-bg" aria-hidden="true">
          <Photo id="wire-spools" sizes="100vw" decorative />
        </div>
        <div className="container panel__inner reveal">
          <p className="eyebrow">찾아오시는 길</p>
          <h2 id="location-title" className="h1">
            <SplitWords lines={["설계부터 제작까지,", "한 공장에서 완성합니다."]} />
          </h2>
          <p className="lead loc-lead">항도제일특수브러쉬, 우리에게 불가능은 없습니다.</p>
          <dl className="loc-list">
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
              <dt>이메일</dt>
              <dd>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </dd>
            </div>
          </dl>
          <div className="btn-row">
            <a className="btn btn--light btn--arrow" href={company.naverMap} target="_blank" rel="noopener noreferrer">
              <span>네이버지도에서 보기</span>
              <svg className="btn__arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              <span className="sr-only"> (새 창)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 큰 영문 타이포 + 원형 버튼 (밝은 회색 · 흑백 사진) */}
      <section id="engineering" className="xl snap" aria-labelledby="xl-title">
        <span className="xl__circle" aria-hidden="true" />
        <span className="xl__orb" aria-hidden="true">
          <Photo id="roll-knot-wire-top" sizes="(min-width: 880px) 40vw, 80vw" decorative />
        </span>
        <div className="container xl__inner reveal">
          <h2 id="xl-title" className="xl__title" translate="no">
            <span className="xl__line">CUSTOM BRUSH</span>
            <span className="xl__line">ENGINEERING</span>
          </h2>
          <Link href="/products/" className="circle-link">
            <span className="circle-link__text">VIEW MORE</span>
            <span className="sr-only"> — 브러쉬·제품 보기</span>
            <svg className="circle-link__arrow" width="44" height="12" viewBox="0 0 44 12" aria-hidden="true" focusable="false">
              <path d="M0 6h42M37 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </Link>
          <p className="xl__text">
            항도제일특수브러쉬는 고객의 공정을 먼저 이해하고,
            <br />
            그에 맞는 소재와 구조로 브러쉬를 설계·제작합니다.
          </p>
        </div>
      </section>

      {/* 04 제작문의 — 하단에 두 가지 선택지 */}
      <section id="inquiry" className="panel inquiry snap" aria-labelledby="inquiry-title">
        <div className="container">
          <div className="inquiry__head reveal">
            <p className="eyebrow">제작문의</p>
            <h2 id="inquiry-title" className="h1">
              <SplitWords lines={["어떤 브러쉬가 필요한지", "몰라도 괜찮습니다."]} />
            </h2>
            <p className="lead">편한 방법을 골라 주세요. 전화는 바로 연결되며, AI 제작상담은 2분이면 의뢰서가 만들어집니다.</p>
          </div>
          <div className="inquiry__options reveal">
            <a className="inquiry-option" href={`tel:${company.phone}`}>
              <span className="inquiry-option__photo" aria-hidden="true">
                <Photo id="machine-knot-detail" sizes="(min-width: 760px) 50vw, 100vw" decorative />
              </span>
              <span className="inquiry-option__glass" aria-hidden="true" />
              <span className="inquiry-option__label">전화 상담</span>
              <span className="inquiry-option__value">{company.phone}</span>
              <span className="inquiry-option__desc">기술 전문가와의 빠른 상담</span>
            </a>
            <Link className="inquiry-option inquiry-option--primary" href="/finder/">
              <span className="inquiry-option__photo" aria-hidden="true">
                <Photo id="roll-abrasive-grey" sizes="(min-width: 760px) 50vw, 100vw" decorative />
              </span>
              <span className="inquiry-option__glass" aria-hidden="true" />
              <span className="inquiry-option__label">AI 제작상담</span>
              <span className="inquiry-option__value">
                의뢰서 작성 <span className="inquiry-option__arrow" aria-hidden="true">→</span>
              </span>
              <span className="inquiry-option__desc">브러쉬 선택에 도움을 드리겠습니다</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 05 브러쉬·제품 */}
      <section id="brushes" className="section section--dark on-dark products-band snap" aria-labelledby="types-title">
        <div className="container">
          <div className="band-head reveal">
            <p className="eyebrow">브러쉬·제품</p>
            <h2 id="types-title" className="h1">
              <SplitWords lines={["공정마다 다른 브러쉬,", "종류별 적용 분야"]} />
            </h2>
          </div>
          <ul role="list" className="type-grid">
            {brushTypes.map((t, i) => (
              <li key={t.id} className="type-tile reveal" style={{ ["--d" as string]: `${(i % 3) * 120}ms` }}>
                <Link href={`/products/#${t.id}`} className="type-tile__link">
                  {t.photo ? (
                    <span className="type-tile__media type-tile__media--parallax">
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

      {/* 06 소재·기술 */}
      <section id="tech" className="tech-band on-dark snap" aria-labelledby="tech-title">
        <div className="marquee" aria-hidden="true" translate="no">
          <div className="marquee__track">
            <span>BRUSH SOLUTION COMPANY</span>
            <span className="marquee__dot">●</span>
            <span>SINCE {company.founded}</span>
            <span className="marquee__dot">●</span>
            <span>MADE IN BUSAN, KOREA</span>
            <span className="marquee__dot">●</span>
            <span>BRUSH SOLUTION COMPANY</span>
          </div>
        </div>
        <div className="tech-band__body">
        <div className="tech-band__media scroll-zoom-bg" aria-hidden="true">
          <Photo id="machine-knot-wheel" sizes="100vw" decorative />
        </div>
        <div className="container tech-band__copy reveal">
          <p className="eyebrow">소재·기술</p>
          <h2 id="tech-title" className="h1">
            <SplitWords lines={["소재는 공정을 보고 고르고,", "자체 설비에서 직접 만듭니다."]} />
          </h2>
          <MaterialChips items={materials} />
          <Link href="/materials/" className="btn btn--light btn--lg">
            소재·기술 자세히 보기
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
}
