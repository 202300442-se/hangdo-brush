import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { company } from "@/data/company";
import "@/styles/pages.css";

export const metadata: Metadata = {
  title: "고객센터",
  description: "카카오톡 채널, 전화, 이메일로 항도제일특수브러쉬에 제작 문의를 남길 수 있습니다.",
};

export default function ContactPage() {
  return (
    <>
      <PageHead eyebrow="Customer Center" title="고객센터">
        <p className="lead">
          제작 문의는 카카오톡 채널로 가장 빠르게 받습니다. 무엇을 적어야 할지 모르시면 먼저 AI 개발 의뢰서로 내용을
          정리해 보내 주세요.
        </p>
      </PageHead>

      <section className="section">
        <div className="container contact-grid">
          <article className="contact-card contact-card--primary">
            <h2 className="h3">카카오톡 빠른 상담</h2>
            <p className="muted">사진·도면을 함께 보내기 가장 편한 창구입니다.</p>
            <a className="btn btn--kakao btn--lg" href={company.kakaoChannel} target="_blank" rel="noopener noreferrer">
              카카오톡 채널 열기<span className="sr-only"> (새 창)</span>
            </a>
          </article>
          <article className="contact-card">
            <h2 className="h3">AI 개발 의뢰서</h2>
            <p className="muted">브러쉬 이름을 몰라도 질문에 답하면 대표가 바로 검토할 의뢰서가 만들어집니다.</p>
            <Link className="btn btn--primary btn--lg" href="/finder/">
              상담 시작
            </Link>
          </article>
          <article className="contact-card">
            <h2 className="h3">전화 · 이메일</h2>
            <dl className="info-list">
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
              <div>
                <dt>주소</dt>
                <dd>{company.address}</dd>
              </div>
            </dl>
          </article>
          <article className="contact-card">
            <h2 className="h3">찾아오시는 길</h2>
            <p className="muted">{company.address}</p>
            <a className="btn btn--secondary btn--lg" href={company.naverMap} target="_blank" rel="noopener noreferrer">
              네이버지도에서 보기<span className="sr-only"> (새 창)</span>
            </a>
          </article>
        </div>
      </section>

      <section id="privacy" className="section section--subtle" aria-labelledby="privacy-title">
        <div className="container container--narrow prose">
          <h2 id="privacy-title" className="h2">개인정보와 데이터 안내</h2>
          <ul>
            <li>
              이 사이트는 이름·연락처 등 개인정보를 <strong>수집하거나 저장하지 않습니다.</strong> 로그인·회원가입·
              방문 분석 도구도 사용하지 않습니다.
            </li>
            <li>
              AI 개발 의뢰서에 입력한 내용은 사용자의 브라우저 안에서만 처리되며, &lsquo;의뢰서 복사&rsquo; 후 사용자가 직접
              카카오톡·메일로 보낼 때에만 회사에 전달됩니다.
            </li>
            <li>카카오톡·메일로 보낸 내용은 각 서비스의 개인정보 처리방침을 따릅니다.</li>
            <li>이 사이트에는 API 키 등 비밀값이 포함되어 있지 않습니다.</li>
            <li>
              회사 정보 출처: {company.nameKo} 제공 · 갱신일 {company.dataUpdated}. 제품 사진은 회사가 직접 촬영한
              자료이며 무단 사용을 금합니다.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
