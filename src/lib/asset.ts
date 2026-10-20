// public/ 파일 경로에 basePath(/hangdo-brush)를 붙인다. next/link는 자동 처리되지만 <img>는 직접 붙여야 한다.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => `${BASE_PATH}${p}`;
export const photoSrc = (id: string, w: 800 | 1600 = 1600) => asset(`/images/photos/${id}-${w}.webp`);
export const photoSrcSet = (id: string) => `${photoSrc(id, 800)} 800w, ${photoSrc(id, 1600)} 1600w`;
