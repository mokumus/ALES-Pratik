import type { Question } from "../types";
import { SECTION_LABELS } from "../data";

const DIFFICULTY_LABEL: Record<Question["difficulty"], string> = {
  kolay: "Kolay",
  orta: "Orta",
  zor: "Zor",
};

export default function MetaChips({
  question,
  showStatus = false,
  solved,
}: {
  question: Question;
  showStatus?: boolean;
  solved?: boolean;
}) {
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
      {!question.official && <span className="chip chip--ghost" title="ALES formatına göre hazırlanmış özgün alıştırma sorusu">Örnek</span>}
      {showStatus && (
        <span className={`chip ${solved ? "chip--solved" : "chip--ghost"}`}>
          {solved ? "Çözüldü" : "Çözülmedi"}
        </span>
      )}
    </div>
  );
}
