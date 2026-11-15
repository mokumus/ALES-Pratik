import { useMemo, useState } from "react";
import { SECTION_LABELS, TOPICS, exams, examKey, questions } from "../data";
import { resetProgress, scoreOf, useProgress } from "../lib/store";
import { navigate } from "../lib/router";
import type { Section } from "../types";

export default function Stats() {
  const progress = useProgress();
  const [confirming, setConfirming] = useState(false);

  const overall = scoreOf(questions, progress);
  const total = questions.length;
  const ratio = Math.round((overall.solved / total) * 100);

  const bySection = useMemo(
    () =>
      (["sayisal", "sozel"] as Section[]).map((section) => ({
        section,
        score: scoreOf(
          questions.filter((q) => q.section === section),
          progress,
        ),
        total: questions.filter((q) => q.section === section).length,
      })),
    [progress],
  );

  const byExam = useMemo(
    () =>
      exams.map((exam) => ({
        exam,
        score: scoreOf(
          questions.filter((q) => examKey(q) === exam.key),
          progress,
        ),
      })),
    [progress],
  );

  const byTopic = useMemo(() => {
    const topics = [...TOPICS.sayisal, ...TOPICS.sozel];
    return topics
      .map((topic) => {
        const list = questions.filter((q) => q.topic === topic);
        return { topic, total: list.length, section: list[0]?.section, score: scoreOf(list, progress) };
      })
      .sort((a, b) => {
        if (b.score.solved !== a.score.solved) return b.score.solved - a.score.solved;
        return a.topic.localeCompare(b.topic, "tr");
      });
  }, [progress]);

  const started = overall.solved > 0;

  return (
    <div className="page">
      <header className="pagehead">
        <div>
          <h1>İstatistik</h1>
          <p className="pagehead__sub">Bu cihazda kaydedilen çalışma verileri. Sunucuya hiçbir şey gönderilmez.</p>
        </div>
        {started &&
          (confirming ? (
            <div className="inline-confirm">
              <span>Emin misiniz?</span>
              <button
                type="button"
                className="btn btn--danger btn--sm"
                onClick={() => {
                  resetProgress();
                  setConfirming(false);
                }}
              >
                Evet, sil
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirming(false)}>
                Vazgeç
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirming(true)}>
              İlerlemeyi sıfırla
            </button>
          ))}
      </header>

      <div className="statgrid">
        <div className="card stat">
          <span className="stat__label">Çözülen soru</span>
          <strong className="stat__value">
            {overall.solved}
            <small> / {total}</small>
          </strong>
          <div className="bar bar--thin">
            <span style={{ width: `${ratio}%` }} />
          </div>
          <span className="stat__note">Bankanın %{ratio} kadarı</span>
        </div>
        <div className="card stat">
          <span className="stat__label">Doğru</span>
          <strong className="stat__value stat__value--ok">{overall.correct}</strong>
          <span className="stat__note">Doğru cevaplanan sorular</span>
        </div>
        <div className="card stat">
          <span className="stat__label">Yanlış</span>
          <strong className="stat__value stat__value--no">{overall.wrong}</strong>
          <span className="stat__note">Tekrar çalışılacak sorular</span>
        </div>
        <div className="card stat">
          <span className="stat__label">Başarı</span>
          <strong className="stat__value">{started ? `%${overall.accuracy}` : "—"}</strong>
          <span className="stat__note">{started ? "Doğru / çözülen" : "Henüz soru çözülmedi"}</span>
        </div>
      </div>

      {!started ? (
        <div className="card empty">
          <h2>Henüz veri yok</h2>
          <p>İlk soruyu çözdüğünde konu bazlı başarın burada birikmeye başlar.</p>
          <button type="button" className="btn btn--primary" onClick={() => navigate("practice", { set: "all" })}>
            İlk soruya git
          </button>
        </div>
      ) : (
        <>
          <section className="block">
            <div className="block__head">
              <h2>Bölüm bazında</h2>
              <p>Sayısal ve sözel performansını karşılaştır.</p>
            </div>
            <div className="grid grid--two">
              {bySection.map(({ section, score, total: sectionTotal }) => (
                <div className="card meter" key={section}>
                  <div className="meter__head">
                    <h3>{SECTION_LABELS[section]}</h3>
                    <span>
                      {score.solved}/{sectionTotal} soru
                    </span>
                  </div>
                  <div className="bar">
                    <span style={{ width: `${Math.round((score.solved / sectionTotal) * 100)}%` }} />
                  </div>
                  <div className="meter__foot">
                    <span>Doğru: {score.correct}</span>
                    <span>Yanlış: {score.wrong}</span>
                    <span>Başarı: {score.solved ? `%${score.accuracy}` : "—"}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => navigate("practice", { section, set: "all" })}
                  >
                    Bu bölümü çalış
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="block">
            <div className="block__head">
              <h2>Sınav bazında</h2>
              <p>Her sınav dönemindeki ilerlemen.</p>
            </div>
            <div className="card table">
              <div className="table__row table__row--head">
                <span>Sınav</span>
                <span>Çözülen</span>
                <span>Doğru</span>
                <span>Yanlış</span>
                <span>Başarı</span>
              </div>
              {byExam.map(({ exam, score }) => (
                <div className="table__row" key={exam.key}>
                  <span>
                    <strong>{exam.label}</strong>
                    <small>{exam.period}</small>
                  </span>
                  <span>
                    {score.solved}/{exam.total}
                  </span>
                  <span className="pos">{score.correct}</span>
                  <span className="neg">{score.wrong}</span>
                  <span>{score.solved ? `%${score.accuracy}` : "—"}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="block">
            <div className="block__head">
              <h2>Konu bazında</h2>
              <p>En çok çalıştığın konular üstte. Düşük başarılı konular tekrar için iyi aday.</p>
            </div>
            <div className="topics">
              {byTopic.map(({ topic, total: topicTotal, section, score }) => (
                <div className="card topicrow" key={topic}>
                  <div className="topicrow__head">
                    <h3>
                      {topic} <span className={`dot dot--${section}`} />
                    </h3>
                    <span className="topicrow__meta">
                      {score.solved}/{topicTotal} · {score.solved ? `%${score.accuracy}` : "—"}
                    </span>
                  </div>
                  <div className="bar bar--thin">
                    <span
                      className={score.solved && score.accuracy < 50 ? "bar--low" : undefined}
                      style={{ width: `${Math.round((score.solved / topicTotal) * 100)}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    className="topicrow__link"
                    onClick={() => navigate("practice", { topic, set: "all" })}
                  >
                    Konuyu çalış →
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
