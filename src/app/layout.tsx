import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver } from "@/components/Reveal";
import { company } from "@/data/company";
import "@/styles/globals.css";
import "@/styles/layout.css";

export const metadata: Metadata = {
  title: {
    default: `${company.nameKo} | 맞춤형 산업용 브러쉬 개발`,
    template: `%s | ${company.nameKo}`,
  },
  description:
    "항도제일특수브러쉬(Hangdo Jeil Special Brush)는 1995년부터 부산에서 시중 브러쉬로 해결되지 않는 산업 공정을 위해 맞춤형 브러쉬를 개발·제작합니다. 철도 차량·버스·신발·수산물·농산물 세척, 철강 표면 세척과 물기 제거, 연마용 브러쉬.",
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
