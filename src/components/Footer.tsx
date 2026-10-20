import Link from "next/link";
import { company } from "@/data/company";

export function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="container site-footer__grid">
        <div>
          <p className="site-footer__name">{company.nameKo}</p>
          <p className="site-footer__en">{company.nameEn}</p>
        </div>
        <address className="site-footer__info">
          <p>
            대표 {company.ceo} · 사업자등록번호 <span className="tnum">{company.bizNo}</span>
          </p>
          <p>{company.address}</p>
          <p>
            전화 <a href={`tel:${company.phone}`}>{company.phone}</a> · 팩스 {company.fax}
          </p>
          <p>
            이메일 <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
          <p>
            <a href={company.kakaoChannel} target="_blank" rel="noopener noreferrer">
              카카오톡 채널<span className="sr-only"> (새 창)</span>
            </a>
          </p>
        </address>
        <div className="site-footer__notes small">
          <p>
            이 사이트는 2026학년도 2학기 중간 MVP 배포본입니다. 주문조회는 데모 데이터이며,
            AI 개발 의뢰서는 AI 모델 없이 규칙 기반으로 내용을 정리합니다.
          </p>
          <p>
            개인정보를 수집·저장하지 않습니다. <Link href="/contact/#privacy">자세히</Link>
          </p>
          <p>정보 갱신일 {company.dataUpdated}</p>
        </div>
      </div>
      <div className="container site-footer__bottom small">
        © {new Date().getFullYear()} {company.nameEn}
      </div>
    </footer>
  );
}
