// 회사 제공 원본 사진(photos-raw/, 저장소 제외)을 웹용 WebP로 변환한다.
// 크기 조정·압축만 하며 색·형태 보정이나 합성은 하지 않는다.
// 사용: node scripts/optimize-photos.mjs
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "photos-raw";
const OUT = "public/images/photos";
const WIDTHS = [800, 1600];

await mkdir(OUT, { recursive: true });
for (const file of (await readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f))) {
  const name = file.replace(/^\d+-/, "").replace(/\.jpe?g$/i, "");
  for (const w of WIDTHS) {
    await sharp(path.join(SRC, file))
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  console.log("✓", name);
}
