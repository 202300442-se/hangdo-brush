// 배경 영상 생성기용 로컬 서버 (개발 전용, 저장소에서 배포되지 않음)
// GET  /            → make-hero.html
// GET  /photos/*    → public/images/photos/*
// POST /save?ext=   → public/videos/hero.<ext> 로 저장
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(".");
const PORT = Number(process.env.PORT ?? 4180);

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://x");
  try {
    if (req.method === "POST" && url.pathname === "/save") {
      const ext = url.searchParams.get("ext") === "mp4" ? "mp4" : "webm";
      const chunks = [];
      for await (const c of req) chunks.push(c);
      await mkdir(path.join(ROOT, "public/videos"), { recursive: true });
      const out = path.join(ROOT, "public/videos", `hero.${ext}`);
      await writeFile(out, Buffer.concat(chunks));
      res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
      return res.end(`saved public/videos/hero.${ext}`);
    }
    if (url.pathname === "/" || url.pathname === "/index.html") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      return res.end(await readFile(path.join(ROOT, "scripts/video/make-hero.html")));
    }
    if (url.pathname.startsWith("/photos/")) {
      const name = path.basename(url.pathname);
      res.writeHead(200, { "content-type": "image/webp" });
      return res.end(await readFile(path.join(ROOT, "public/images/photos", name)));
    }
    res.writeHead(404);
    res.end("not found");
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
}).listen(PORT, () => console.log(`video maker: http://localhost:${PORT}/`));
