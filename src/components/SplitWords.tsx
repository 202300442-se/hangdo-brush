import { Fragment } from "react";

/**
 * 제목을 단어 단위로 나눠, 화면에 들어오면 단어가 아래에서 위로 차례로 떠오르게 한다.
 * - 부모(또는 자신)에 .reveal 이 있고 .is-visible 이 붙으면 재생 (motion.css)
 * - 스크린리더에는 원문 한 줄로 읽히도록 aria-label 대신 sr-only 원문 + aria-hidden 조각을 쓴다.
 */
export function SplitWords({ lines }: { lines: string[] }) {
  let i = 0;
  return (
    <>
      <span className="sr-only">{lines.join(" ")}</span>
      <span className="words" aria-hidden="true">
        {lines.map((line, li) => (
          <Fragment key={li}>
            {line.split(" ").map((w, wi) => {
              const idx = i++;
              return (
                <Fragment key={wi}>
                  <span className="words__mask">
                    <span className="words__word" style={{ ["--i" as string]: idx }}>
                      {w}
                    </span>
                  </span>
                  {wi < line.split(" ").length - 1 ? " " : null}
                </Fragment>
              );
            })}
            {li < lines.length - 1 && <br />}
          </Fragment>
        ))}
      </span>
    </>
  );
}
