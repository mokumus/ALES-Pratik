import { Fragment, useMemo } from "react";
import katex from "katex";

/**
 * Metin içindeki matematik ifadelerini kitapçıktaki gibi dizgiye çevirir.
 *
 * Kullanım:
 *   "$\frac{-3x-1}{4} = 2$"     satır içi (inline)
 *   "$$\frac{1}{2} + \frac{1}{3}$$"  ayrı satır (blok)
 *
 * Dolar işareti olmayan metin olduğu gibi yazılır; böylece mevcut sorular
 * (², √, · gibi Unicode işaretler kullananlar) değişmeden çalışır.
 */

type Part = { kind: "text"; value: string } | { kind: "inline" | "block"; value: string };

function tokenize(input: string): Part[] {
  const parts: Part[] = [];
  let buffer = "";
  let i = 0;

  while (i < input.length) {
    if (input.startsWith("$$", i)) {
      const end = input.indexOf("$$", i + 2);
      if (end === -1) break;
      if (buffer) {
        parts.push({ kind: "text", value: buffer });
        buffer = "";
      }
      parts.push({ kind: "block", value: input.slice(i + 2, end) });
      i = end + 2;
      continue;
    }

    if (input[i] === "$") {
      const end = input.indexOf("$", i + 1);
      if (end === -1) break;
      if (buffer) {
        parts.push({ kind: "text", value: buffer });
        buffer = "";
      }
      parts.push({ kind: "inline", value: input.slice(i + 1, end) });
      i = end + 1;
      continue;
    }

    buffer += input[i];
    i += 1;
  }

  if (buffer) parts.push({ kind: "text", value: buffer });
  return parts;
}

/** Çok satırlı düz metni <br /> ile birleştirir. */
function TextRun({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

export default function MathText({ text, className }: { text: string; className?: string }) {
  const parts = useMemo(() => {
    const raw = tokenize(text);
    return raw
      .map((part, i) => {
        if (part.kind !== "text") return part;
        let value = part.value;
        // Matematik bloğunun kendi boşluğu var; etrafındaki fazla satır sonlarını at.
        if (raw[i - 1] && raw[i - 1].kind !== "text") value = value.replace(/^\n+/, "");
        if (raw[i + 1] && raw[i + 1].kind !== "text") value = value.replace(/\n+$/, "");
        return { kind: "text" as const, value };
      })
      .filter((part) => part.kind !== "text" || part.value.length > 0);
  }, [text]);

  return (
    <span className={["mathtext", className].filter(Boolean).join(" ")}>
      {parts.map((part, i) => {
        if (part.kind === "text") return <TextRun key={i} text={part.value} />;

        const html = katex.renderToString(part.value, {
          displayMode: part.kind === "block",
          throwOnError: false,
          strict: false,
          output: "html",
        });

        return (
          <span
            key={i}
            className={part.kind === "block" ? "mathblock" : "mathinline"}
            // KaTeX çıktısı güvenilir bir kütüphaneden gelir; kaçış yapılmış HTML üretir.
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
}
