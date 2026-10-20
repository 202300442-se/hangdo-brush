import type { Metadata } from "next";
import { Photo } from "@/components/Photo";
import { OrderTracker } from "@/features/order/OrderTracker";
import "@/styles/finder.css";
import "@/styles/pages.css";
import "@/styles/order.css";

export const metadata: Metadata = {
  title: "주문조회",
  description: "거래처 전용 — 주문번호와 조회 코드로 제작 진행 현황을 확인합니다.",
  robots: { index: false },
};

const features = [
  { icon: "doc", label: "주문 확인" },
  { icon: "gear", label: "제작 현황" },
  { icon: "cal", label: "납기 확인" },
] as const;

function Icon({ name }: { name: (typeof features)[number]["icon"] }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" as const };
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {name === "doc" && (
        <>
          <path {...p} d="M12 6h18l8 8v28H12z" />
          <path {...p} d="M30 6v8h8M17 22h14M17 28h14M17 34h8" />
          <path {...p} d="M28 34l3 3 6-6" />
        </>
      )}
      {name === "gear" && (
        <>
          <circle {...p} cx="24" cy="24" r="6" />
          <path
            {...p}
            d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M11.3 36.7l4.2-4.2M32.5 15.5l4.2-4.2"
          />
        </>
      )}
      {name === "cal" && (
        <>
          <path {...p} d="M8 12h32v28H8zM8 20h32M16 6v10M32 6v10" />
          <path {...p} d="M18 30l4 4 8-8" />
        </>
      )}
    </svg>
  );
}

export default function OrderPage() {
  return (
    <>
      <section className="order-hero on-dark" aria-labelledby="order-hero-title">
        <div className="order-hero__bg" aria-hidden="true">
          <Photo id="roll-blue-filament-stack" sizes="100vw" decorative priority />
        </div>
        <div className="container order-hero__inner">
          <div className="order-hero__intro">
            <p className="order-hero__badge">
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5z" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              거래처 전용
            </p>
            <h1 id="order-hero-title" className="h1">
              주문하신 제품의
              <br />
              제작 현황을 확인하세요.
            </h1>
            <p className="lead">
              주문번호와 조회 코드가 모두 맞을 때만 주문 내용이 표시됩니다. 다른 회사는 어떤 거래처의 주문이 있는지 알 수
              없습니다.
            </p>
            <ul role="list" className="order-features">
              {features.map((f) => (
                <li key={f.label}>
                  <span className="order-features__circle">
                    <Icon name={f.icon} />
                  </span>
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-hero__panel">
            <OrderTracker />
          </div>
        </div>
      </section>

      <section className="section section--subtle" aria-labelledby="order-security-title">
        <div className="container container--narrow prose">
          <h2 id="order-security-title" className="h3">
            주문 정보 보호 방식
          </h2>
          <ul>
            <li>주문번호만으로는 조회되지 않습니다. 주문 확정 시 거래처에만 알려 드리는 6자리 조회 코드가 함께 필요합니다.</li>
            <li>틀렸을 때 &lsquo;없는 주문번호&rsquo;인지 &lsquo;틀린 코드&rsquo;인지 알려 주지 않아, 거래 여부를 짐작할 수 없습니다.</li>
            <li>5회 연속 틀리면 30초 동안 조회가 제한됩니다.</li>
            <li>
              현재는 MVP 데모로, 실제 주문은 조회되지 않습니다. 정식 서비스에서는 주문 정보를 서버 데이터베이스에만 두고, 거래처
              로그인 또는 조회 코드를 서버에서 확인한 뒤 해당 주문만 보여 줍니다.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
