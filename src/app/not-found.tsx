import Link from "next/link";
import { PageHead } from "@/components/PageHead";

export default function NotFound() {
  return (
    <PageHead eyebrow="404" title="페이지를 찾을 수 없습니다.">
      <p className="lead">주소가 바뀌었거나 아직 준비 중인 페이지입니다.</p>
      <div className="btn-row">
        <Link href="/" className="btn btn--primary">
          홈으로
        </Link>
        <Link href="/finder/" className="btn btn--secondary">
          AI 제작상담
        </Link>
      </div>
    </PageHead>
  );
}
