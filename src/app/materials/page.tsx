import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { Photo } from "@/components/Photo";
import { materials, techItems } from "@/data/materials";
import { devProcess } from "@/data/process";
import "@/styles/home.css";
import "@/styles/pages.css";

export const metadata: Metadata = {
  title: "소재·기술",
  description: "Nylon, PP, PBT, 항균모, 연마사, 돈모, 스틸·스테인리스·황동 와이어 — 공정 조건에 맞춰 소재를 고르고 자체 설비로 제작합니다.",
};

export default function MaterialsPage() {
  const groups = [...new Set(materials.map((m) => m.group))];
  return (
    <>
      <PageHead eyebrow="Materials & Technology" title={<>소재는 공정을 보고<br />대표가 직접 제안합니다.</>}>
        <p className="lead">
          같은 세척이라도 물·약품·온도·대상 표면에 따라 맞는 모 소재가 다릅니다. 아래는 다루는 소재의 예시이며, 실제 선택은
          공정을 확인한 뒤 정합니다.
        </p>
      </PageHead>

      <section className="section" aria-labelledby="mat-title">
        <div className="container">
          <h2 id="mat-title" className="h2 band-head">
            다루는 소재
          </h2>
          <div className="mat-groups">
            {groups.map((g) => (
              <section key={g} className="mat-group" aria-label={g}>
                <h3 className="mat-group__title">{g}</h3>
                <ul role="list" className="mat-list">
                  {materials
                    .filter((m) => m.group === g)
                    .map((m) => (
                      <li key={m.id}>
                        <span className="mat-list__name">{m.name}</span>
                        <span className="small muted">{m.desc}</span>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
          <p className="small muted mat-note">
            내열·내약품·식품 적합성 등 소재별 기술 자료는 확인 후 공개합니다. 필요하면 AI 제작상담에 사용 환경을 적어 주세요.
          </p>
        </div>
      </section>

      <section className="section section--subtle" aria-labelledby="tech-title">
        <div className="container">
          <h2 id="tech-title" className="h2 band-head">
            자체 설비로 직접 만듭니다
          </h2>
          <ul role="list" className="tech-grid">
            {techItems.map((t) => (
              <li key={t.title} className="tech-card">
                <span className="tech-card__media">
                  <Photo id={t.photo} sizes="(min-width: 880px) 400px, 100vw" />
                </span>
                <h3 className="h3">{t.title}</h3>
                <p className="muted">{t.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="process-title">
        <div className="container">
          <h2 id="process-title" className="h2 band-head">
            개발 프로세스
          </h2>
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
            1단계 — AI 제작상담 시작
          </Link>
        </div>
      </section>
    </>
  );
}
