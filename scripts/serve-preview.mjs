// GitHub Pages와 같은 경로(/hangdo-brush/)로 out/ 폴더를 띄우는 미리보기 서버 (의존성 없음)
// 사용: npm run build:pages && npm run preview  →  http://localhost:4173/hangdo-brush/
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("out");
const BASE = "/hangdo-brush";
const PORT = Number(process.env.PORT ?? 4173);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".txt": "text/plain; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2" };

async function resolveFile(urlPath) {
  let p = path.join(ROOT, decodeURIComponent(urlPath));
  if (!p.startsWith(ROOT)) return null;
  try {
    const s = await stat(p);
    if (s.isDirectory()) p = path.join(p, "index.html");
    await stat(p);
    return p;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://x");
  if (url.pathname === "/" ) { res.writeHead(302, { location: `${BASE}/` }); return res.end(); }
  if (!url.pathname.startsWith(BASE)) { res.writeHead(404); return res.end("not found"); }
  const file = await resolveFile(url.pathname.slice(BASE.length) || "/");
  const target = file ?? path.join(ROOT, "404.html");
  res.writeHead(file ? 200 : 404, { "content-type": TYPES[path.extname(target)] ?? "application/octet-stream" });
  res.end(await readFile(target));
}).listen(PORT, () => console.log(`preview: http://localhost:${PORT}${BASE}/`));
