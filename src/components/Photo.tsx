import { photoById } from "@/data/photos";
import { photoSrc, photoSrcSet } from "@/lib/asset";

type Props = {
  id: string;
  /** 레이아웃에서 이미지가 차지하는 폭 (반응형 sizes 속성) */
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** 장식용이면 빈 alt */
  decorative?: boolean;
};

export function Photo({ id, sizes = "100vw", className, priority = false, decorative = false }: Props) {
  const p = photoById(id);
  return (
    <img
      className={className}
      src={photoSrc(id)}
      srcSet={photoSrcSet(id)}
      sizes={sizes}
      alt={decorative ? "" : p.alt}
      width={1600}
      height={Math.round(1600 / p.ratio)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
