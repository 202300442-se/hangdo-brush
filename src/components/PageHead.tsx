import type { ReactNode } from "react";

export function PageHead({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-head">
      <div className="container page-head__inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h1">{title}</h1>
        {children}
      </div>
    </section>
  );
}
