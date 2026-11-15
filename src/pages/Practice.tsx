import { useEffect, useState } from "react";
import type { Question, Section } from "../types";
import { SECTION_LABELS, TOPICS, examKey, exams, questions } from "../data";
import { navigate } from "../lib/router";
import { scoreOf, useProgress, type ProgressState } from "../lib/store";
import QuestionView from "../components/QuestionView";

type SetMode = "all" | "unsolved" | "wrong" | "quick";

const SET_LABELS: Record<SetMode, string> = {
  all: "Tüm sorular",
  unsolved: "Çözülmemişler",
  wrong: "Yanlışlarım",
  quick: "Hızlı test (10)",
};

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface BuildOptions {
  set: SetMode;
  exam: string;
  section: string;
  topic: string;
  n: number;
}

function buildList(options: BuildOptions, progress: ProgressState, seed: number): Question[] {
  let list = questions.slice();

  if (options.exam) list = list.filter((q) => examKey(q) === options.exam);
  if (options.section) list = list.filter((q) => q.section === options.section);
  if (options.topic) list = list.filter((q) => q.topic === options.topic);

  if (options.set === "unsolved") list = list.filter((q) => !progress.answers[q.id]);
  if (options.set === "wrong") list = list.filter((q) => progress.answers[q.id] && !progress.answers[q.id].correct);

  list.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    if (a.session !== b.session) return b.session - a.session;
    if (a.section !== b.section) return a.section === "sayisal" ? -1 : 1;
    return a.no - b.no;
  });

  if (options.set === "quick") {
    const random = mulberry32(seed);
    const shuffled = list.slice();
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    list = shuffled.slice(0, Math.max(1, options.n));
  }

  return list;
}

export default function Practice({ params }: { params: URLSearchParams }) {
  const progress = useProgress();

  const set = (params.get("set") as SetMode) || "all";
  const exam = params.get("exam") ?? "";
  const section = params.get("section") ?? "";
  const topic = params.get("topic") ?? "";
  const n = Math.max(1, Number(params.get("n") ?? 10) || 10);
  const targetId = params.get("q") ?? "";
  const salt = params.get("r") ?? "";

  const [seed] = useState(() => Math.floor(Math.random() * 1e9));
  const options: BuildOptions = { set, exam, section, topic, n };

  const [list, setList] = useState<Question[]>(() => {
    const initial = buildList(options, progress, seed);
    return initial;
  });
  const [index, setIndex] = useState(() => {
    if (!targetId) return 0;
    const at = list.findIndex((q) => q.id === targetId);
    return at < 0 ? 0 : at;
  });
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const next = buildList(options, progress, seed);
    setList(next);
    setFinished(false);
    const at = targetId ? next.findIndex((q) => q.id === targetId) : 0;
    setIndex(at < 0 ? 0 : at);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set, exam, section, topic, n, targetId, salt, seed]);

  const changeOptions = (patch: Partial<BuildOptions>) => {
    const merged = { ...options, ...patch };
    navigate("practice", {
      set: merged.set === "all" ? undefined : merged.set,
      exam: merged.exam || undefined,
      section: merged.section || undefined,
      topic: merged.topic || undefined,
      n: merged.set === "quick" ? merged.n : undefined,
    });
  };

  const score = scoreOf(list, progress);
  const percent = list.length === 0 ? 0 : Math.round(((index + 1) / list.length) * 100);
  const current = list[index];

  const topicOptions = section ? TOPICS[section as Section] : [...TOPICS.sayisal, ...TOPICS.sozel];

  if (list.length === 0) {
    return (
      <div className="page page--narrow">
        <header className="pagehead">
          <h1>Çalış</h1>
        </header>
        <div className="card empty">
          <h2>Bu filtreyle soru bulunamadı</h2>
          <p>
            Seçtiğin ölçütlere uyan soru yok. Filtreleri sıfırlayarak tüm soru bankasıyla devam edebilirsin.
          </p>
          <button type="button" className="btn btn--primary" onClick={() => navigate("practice")}>
            Filtreleri temizle
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="page page--narrow">
        <div className="card resultcard">
          <span className="eyebrow">Test tamamlandı</span>
          <h1>
            {score.solved === 0 ? "Başlamaya hazır mısın?" : `%${score.accuracy} doğruluk`}
          </h1>
          <p>
            {score.solved} soru cevaplandı: {score.correct} doğru, {score.wrong} yanlış.
          </p>
          <div className="resultcard__grid">
            <div>
              <strong>{score.solved}</strong>
              <span>çözülen</span>
            </div>
            <div>
              <strong>{score.correct}</strong>
              <span>doğru</span>
            </div>
            <div>
              <strong>{score.wrong}</strong>
              <span>yanlış</span>
            </div>
            <div>
              <strong>%{score.accuracy}</strong>
              <span>başarı</span>
            </div>
          </div>
          <div className="resultcard__actions">
            <button type="button" className="btn btn--ghost" onClick={() => setFinished(false)}>
              Sorulara dön
            </button>
            <button
              type="button"
              className="btn btn--soft"
              onClick={() => navigate("practice", { ...(set === "quick" ? { set: "quick", n } : { set }), exam: exam || undefined, section: section || undefined, topic: topic || undefined, r: Date.now() })}
            >
              Yeniden çöz
            </button>
            <button type="button" className="btn btn--primary" onClick={() => navigate("stats")}>
              İstatistikleri gör
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--narrow">
      <header className="pagehead">
        <div>
          <h1>Çalış</h1>
          <p className="pagehead__sub">
            {exam ? `${exams.find((e) => e.key === exam)?.label ?? exam} · ` : ""}
            {section ? `${SECTION_LABELS[section as Section]} · ` : ""}
            {topic ? `${topic} · ` : ""}
            {list.length} soru
          </p>
        </div>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setFinished(true)}>
          Testi bitir
        </button>
      </header>

      <div className="toolbar card">
        <label className="field">
          <span>Test</span>
          <select value={set} onChange={(e) => changeOptions({ set: e.target.value as SetMode })}>
            {(Object.keys(SET_LABELS) as SetMode[]).map((mode) => (
              <option key={mode} value={mode}>
                {SET_LABELS[mode]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Sınav</span>
          <select value={exam} onChange={(e) => changeOptions({ exam: e.target.value })}>
            <option value="">Tüm sınavlar</option>
            {exams.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label} · {item.period}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Bölüm</span>
          <select value={section} onChange={(e) => changeOptions({ section: e.target.value, topic: "" })}>
            <option value="">Tümü</option>
            <option value="sayisal">Sayısal</option>
            <option value="sozel">Sözel</option>
          </select>
        </label>
        <label className="field">
          <span>Konu</span>
          <select value={topic} onChange={(e) => changeOptions({ topic: e.target.value })}>
            <option value="">Tüm konular</option>
            {topicOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="testbar">
        <div className="bar bar--thin">
          <span style={{ width: `${percent}%` }} />
        </div>
        <div className="testbar__meta">
          <span>
            Soru <strong>{index + 1}</strong> / {list.length}
          </span>
          <span>
            {score.solved} cevap · {score.correct} doğru · {score.wrong} yanlış
          </span>
        </div>
      </div>

      {current && (
        <QuestionView
          key={current.id}
          question={current}
          index={index}
          total={list.length}
          onPrev={index > 0 ? () => setIndex(index - 1) : undefined}
          onNext={index < list.length - 1 ? () => setIndex(index + 1) : undefined}
        >
          {index === list.length - 1 && (
            <div className="qcard__finish">
              <button type="button" className="btn btn--soft" onClick={() => setFinished(true)}>
                Testi bitir ve sonucu gör
              </button>
            </div>
          )}
        </QuestionView>
      )}

      <p className="kbdhint">
        Kısayollar: <kbd>A</kbd>–<kbd>E</kbd> seç · <kbd>Enter</kbd> cevabı göster · <kbd>S</kbd> çözüm ·{" "}
        <kbd>←</kbd> <kbd>→</kbd> gezin
      </p>
    </div>
  );
}
