import type { Question } from "../types";
import { SECTION_LABELS } from "../data";
import { bookletOf, bookletUrlFor } from "../data/booklets";

const DIFFICULTY_LABEL: Record<Question["difficulty"], string> = {
  kolay: "Kolay",
  orta: "Orta",
  zor: "Zor",
};

function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 17v-4h1.5a1.5 1.5 0 0 1 0 3H9" />
    </svg>
  );
}

export default function MetaChips({
  question,
  showStatus = false,
  solved,
}: {
  question: Question;
  showStatus?: boolean;
  solved?: boolean;
}) {
  const booklet = bookletOf(question);
  const bookletUrl = bookletUrlFor(question);

  return (
    <div className="chips">
      <span className="chip chip--exam">
        {question.year} ALES/{question.session}
        <span className="chip__sub">{question.period}</span>
      </span>
      <span className={`chip chip--${question.section}`}>{SECTION_LABELS[question.section]}</span>
      <span className="chip chip--topic">{question.topic}</span>
      <span className="chip chip--ghost">Soru {question.no}</span>
      <span className={`chip chip--diff chip--diff-${question.difficulty}`}>
        {DIFFICULTY_LABEL[question.difficulty]}
      </span>
      {question.official && (
        <span className="chip chip--official" title="Resmî ÖSYM soru kitapçığından alınmış soru">
          Resmî
        </span>
      )}
      {bookletUrl && (
        <a
          className="chip chip--link"
          href={bookletUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`${booklet?.label ?? "Soru kitapçığı"}${
            question.pdfPage ? ` — s. ${question.pdfPage}` : ""
          } (yeni sekmede açılır)`}
        >
          <PdfIcon />
          {question.pdfPage ? `Kitapçık s. ${question.pdfPage}` : "Kitapçık PDF"}
        </a>
      )}
      {showStatus && (
        <span className={`chip ${solved ? "chip--solved" : "chip--ghost"}`}>
          {solved ? "Çözüldü" : "Çözülmedi"}
        </span>
      )}
    </div>
  );
}
