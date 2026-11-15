import { useCallback, useEffect, type ReactNode } from "react";
import type { Question } from "../types";
import { LETTERS } from "../data";
import MetaChips from "./MetaChips";
import MathText from "./MathText";
import { recordAnswer, revealQuestion, useProgress } from "../lib/store";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function QuestionView({
  question,
  index,
  total,
  onPrev,
  onNext,
  children,
}: {
  question: Question;
  index: number;
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
  children?: ReactNode;
}) {
  const progress = useProgress();
  const answer = progress.answers[question.id];
  const reveal = progress.reveals[question.id] ?? {};
  const answerShown = Boolean(reveal.answer);
  const solutionShown = Boolean(reveal.solution);

  const select = useCallback(
    (choice: number) => {
      if (answerShown) return;
      recordAnswer(question.id, choice, choice === question.answer);
    },
    [answerShown, question.answer, question.id],
  );

  const showAnswer = useCallback(() => {
    revealQuestion(question.id, "answer");
  }, [question.id]);

  const showSolution = useCallback(() => {
    revealQuestion(question.id, "solution");
  }, [question.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) {
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const key = event.key.toLocaleLowerCase("tr");
      const letterIndex = ["a", "b", "c", "d", "e"].indexOf(key);
      if (letterIndex >= 0) {
        event.preventDefault();
        select(letterIndex);
      } else if (key === "enter" || event.key === " ") {
        event.preventDefault();
        showAnswer();
      } else if (key === "s") {
        event.preventDefault();
        showSolution();
      } else if (event.key === "ArrowRight" && onNext) {
        event.preventDefault();
        onNext();
      } else if (event.key === "ArrowLeft" && onPrev) {
        event.preventDefault();
        onPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select, showAnswer, showSolution, onNext, onPrev]);

  return (
    <article className="card qcard" aria-labelledby={`stem-${question.id}`}>
      <div className="qcard__top">
        <MetaChips question={question} />
        <span className="qcard__counter">
          {index + 1} / {total}
        </span>
      </div>

      <h2 className="qcard__stem" id={`stem-${question.id}`}>
        <MathText text={question.stem} />
      </h2>

      <div className="options" role="radiogroup" aria-label="Cevap seçenekleri">
        {question.options.map((option, i) => {
          const selected = answer?.choice === i;
          const isCorrect = answerShown && i === question.answer;
          const isWrong = answerShown && selected && i !== question.answer;
          const classes = [
            "option",
            selected ? "is-selected" : "",
            isCorrect ? "is-correct" : "",
            isWrong ? "is-wrong" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              type="button"
              key={i}
              className={classes}
              onClick={() => select(i)}
              disabled={answerShown}
              role="radio"
              aria-checked={selected}
            >
              <span className="option__letter">{LETTERS[i]}</span>
              <span className="option__text">
                <MathText text={option} />
              </span>
              {isCorrect && <span className="option__mark" aria-label="doğru cevap">✓</span>}
              {isWrong && <span className="option__mark" aria-label="yanlış cevap">✕</span>}
            </button>
          );
        })}
      </div>

      <div className="qcard__actions">
        <button type="button" className="btn btn--primary" onClick={showAnswer} disabled={answerShown}>
          {answerShown ? "Cevap gösterildi" : "Cevabı Göster"}
          {!answerShown && <kbd>Enter</kbd>}
        </button>
        <button type="button" className="btn btn--soft" onClick={showSolution} disabled={solutionShown}>
          {solutionShown ? "Çözüm açık" : "Çözümü Göster"}
          {!solutionShown && <kbd>S</kbd>}
        </button>
        <div className="qcard__nav">
          <button type="button" className="btn btn--ghost" onClick={onPrev} disabled={!onPrev} aria-label="Önceki soru">
            <Chevron dir="left" />
            Önceki
          </button>
          <button type="button" className="btn btn--ghost" onClick={onNext} disabled={!onNext} aria-label="Sonraki soru">
            Sonraki
            <Chevron dir="right" />
          </button>
        </div>
      </div>

      {answerShown && (
        <div
          className={`verdict ${
            !answer ? "verdict--neutral" : answer.correct ? "verdict--correct" : "verdict--wrong"
          }`}
          role="status"
        >
          <span className="verdict__icon">{!answer ? "ℹ" : answer.correct ? "✓" : "✕"}</span>
          <div>
            <strong>
              {!answer
                ? `Doğru cevap: ${LETTERS[question.answer]}`
                : answer.correct
                  ? `Doğru! Cevabınız: ${LETTERS[answer.choice]}`
                  : `Yanlış. Cevabınız: ${LETTERS[answer.choice]} · Doğru cevap: ${LETTERS[question.answer]}`}
            </strong>
            <p>
              <MathText text={question.options[question.answer]} />
            </p>
          </div>
        </div>
      )}

      {solutionShown && (
        <section className="solution" aria-label="Çözüm">
          <header className="solution__head">
            <h3>Çözüm</h3>
            <span className="solution__answer">Doğru cevap: {LETTERS[question.answer]}</span>
          </header>
          {question.solution.split("\n\n").map((paragraph, i) => (
            <p key={i}>
              <MathText text={paragraph} />
            </p>
          ))}
        </section>
      )}

      {children}
    </article>
  );
}
