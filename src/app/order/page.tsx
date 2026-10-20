import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { OrderTracker } from "@/features/order/OrderTracker";
import "@/styles/finder.css";
import "@/styles/pages.css";

export const metadata: Metadata = {
  title: "주문조회 (데모)",
  description: "주문번호로 제작 진행 단계를 확인하는 기능의 데모입니다.",
};

export default function OrderPage() {
  return (
    <>
      <PageHead eyebrow="Order Tracking" title="주문하신 제품의 제작 현황을 확인하세요.">
        <div className="notice notice--warning">
          <p className="notice__title">MVP 데모 기능입니다</p>
          <p>
            현재 생산 일정은 사내에서 별도로 관리되고 있어 실제 주문은 조회되지 않습니다. 데모 번호 HJ-DEMO-001~003으로
            화면을 확인할 수 있습니다.
          </p>
        </div>
      </PageHead>
      <section className="section">
        <div className="container container--narrow">
          <OrderTracker />
        </div>
      </section>
    </>
  );
}
