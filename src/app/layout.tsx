import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver } from "@/components/Reveal";
import { company } from "@/data/company";
import "@/styles/globals.css";
import "@/styles/layout.css";

export const metadata: Metadata = {
  title: {
    default: `${company.nameKo} | 산업용 브러쉬 주문제작`,
    template: `%s | ${company.nameKo}`,
  },
  description:
    "항도제일특수브러쉬(Hangdo Jeil Special Brush)는 1995년부터 부산에서 산업용 롤·휠·컵 브러쉬를 고객 공정에 맞춰 주문제작합니다. 브러쉬 이름을 몰라도 AI 제작상담으로 문의를 정리할 수 있습니다.",
  applicationName: company.nameKo,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: company.nameKo,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b382b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard — SIL Open Font License 1.1 */}
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
