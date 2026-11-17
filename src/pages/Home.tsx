import { allTopics, exams, questions, SECTION_LABELS, TOPICS } from "../data";
import { BOOKLETS } from "../data/booklets";
import { officialCounts } from "../data/officialExams";
import { scoreOf, useProgress } from "../lib/store";
import { navigate } from "../lib/router";

export default function Home() {
  const progress = useProgress();
  const overall = scoreOf(questions, progress);
  const solvedIds = Object.keys(progress.answers).length;

  return (
    <div className="page">
      <section className="hero">
        <div className="hero__content">
          <span className="eyebrow">2025–2026 ALES · Güncel soru bankası</span>
          <h1>
            ALES sorularıyla
            <br />
            <em>gerçek sınav temposunda</em> çalış.
          </h1>
          <p className="hero__lead">
            Her sorunun hangi sınavdan, hangi bölümden ve hangi konudan geldiğini gör. Cevabı gizle, kendin
            dene; sonra adım adım çözümle kontrol et.
          </p>
          <div className="hero__actions">
            <button type="button" className="btn btn--primary btn--lg" onClick={() => navigate("practice", { set: "all" })}>
              Çalışmaya başla
            </button>
            <button type="button" className="btn btn--soft btn--lg" onClick={() => navigate("practice", { set: "quick", n: 10 })}>
              10 soruluk hızlı test
            </button>
          </div>
          <dl className="hero__stats">
            <div>
              <dt>Soru</dt>
              <dd>{questions.length}</dd>
            </div>
            <div>
              <dt>Sınav dönemi</dt>
              <dd>{exams.length}</dd>
            </div>
            <div>
              <dt>Konu</dt>
              <dd>{allTopics.length}</dd>
            </div>
            <div>
              <dt>Başarın</dt>
              <dd>{overall.solved === 0 ? "—" : `%${overall.accuracy}`}</dd>
            </div>
          </dl>
        </div>

        <aside className="hero__preview" aria-hidden="true">
          <div className="preview__head">
            <span className="preview__tag">2026 ALES/1</span>
            <span className="preview__tag preview__tag--soft">Sayısal</span>
          </div>
          <div className="preview__stem">
            Ardışık üç tek doğal sayının toplamı 63&apos;tür. Bu sayıların en büyüğü kaçtır?
          </div>
          <div className="preview__options">
            {["19", "21", "23", "25"].map((value, i) => (
              <div key={value} className={`preview__option${i === 2 ? " is-correct" : ""}`}>
                <span>{"ABCD"[i]}</span>
                {value}
              </div>
            ))}
          </div>
          <div className="preview__foot">Cevabı göster · Çözümü gör</div>
        </aside>
      </section>

      <section className="block">
        <div className="block__head">
          <h2>Sınav dönemleri</h2>
          <p>2026 ALES/1, 2025 ALES/2 ve 2025 ALES/1 kapsamına göre hazırlanmış sorularla dönem dönem çalış.</p>
        </div>
        <div className="grid grid--exams">
          {exams.map((exam) => {
            const list = questions.filter((q) => `${q.year}-${q.session}` === exam.key);
            const score = scoreOf(list, progress);
            const ratio = Math.round((score.solved / exam.total) * 100);
            const booklet = BOOKLETS[exam.key];
            return (
              <article className="card examcard" key={exam.key}>
                <header className="examcard__head">
                  <div>
                    <span className="examcard__year">{exam.year}</span>
                    <h3>
                      ALES/{exam.session} <span>· {exam.period}</span>
                    </h3>
                  </div>
                  <span className="examcard__count">{exam.total} soru</span>
                </header>
                <div className="examcard__split">
                  <span>Sayısal {exam.sayisal}</span>
                  <span>Sözel {exam.sozel}</span>
                </div>
                <div className="bar" role="progressbar" aria-valuenow={ratio} aria-valuemin={0} aria-valuemax={100}>
                  <span style={{ width: `${ratio}%` }} />
                </div>
                <footer className="examcard__foot">
                  <span>{score.solved === 0 ? "Henüz başlanmadı" : `${score.solved}/${exam.total} çözüldü · %${score.accuracy} doğru`}</span>
                  <span className="examcard__actions">
                    {booklet && (
                      <a
                        className="examcard__pdf"
                        href={booklet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${booklet.label} — yeni sekmede açılır (PDF)`}
                      >
                        Kitapçık ↗
                      </a>
                    )}
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate("practice", { exam: exam.key, set: "all" })}>
                      Çöz →
                    </button>
                  </span>
                </footer>
              </article>
            );
          })}
        </div>
      </section>

      <section className="block">
        <div className="block__head">
          <h2>Resmî sınav arşivi</h2>
          <p>
            {officialCounts.total} ÖSYM kitapçığının tamamı: {officialCounts.tam} tam sınav,{" "}
            {officialCounts.yuzde10} %10 kitapçık. Bağlantılar doğrudan ÖSYM'nin doküman sunucusuna gider.
          </p>
        </div>
        <div className="cta">
          <div>
            <h3>Gerçek sınavı çöz</h3>
            <p>
              Soru kitapçığını yeni sekmede aç; o sınavın soruları bankaya eklendikçe yanındaki{" "}
              <strong>Çalış</strong> düğmesiyle doğrudan o sınavın sorularına geçebilirsin. Her resmî
              sorunun kartında kitapçığın ilgili sayfasına giden PDF bağlantısı bulunur.
            </p>
          </div>
          <div className="cta__actions">
            <button type="button" className="btn btn--primary" onClick={() => navigate("official")}>
              Arşivi aç
            </button>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="block__head">
          <h2>Konuya göre çalış</h2>
          <p>Bir konu seç, yalnızca o konunun sorularıyla çalış. Sayı, o konudaki çözülen/toplam soruyu gösterir.</p>
        </div>
        <div className="grid grid--two">
          {(["sayisal", "sozel"] as const).map((section) => {
            const list = questions.filter((q) => q.section === section);
            const score = scoreOf(list, progress);
            return (
              <article className="card topicpanel" key={section}>
                <header className="topicpanel__head">
                  <h3>
                    <span className={`dot dot--${section}`} />
                    {SECTION_LABELS[section]}
                  </h3>
                  <span>
                    {list.length} soru · {TOPICS[section].length} konu
                    {score.solved > 0 ? ` · ${score.solved} çözüldü` : ""}
                  </span>
                </header>
                <div className="topicpanel__list">
                  {TOPICS[section].map((topic) => {
                    const topicList = list.filter((q) => q.topic === topic);
                    const topicScore = scoreOf(topicList, progress);
                    return (
                      <button
                        key={topic}
                        type="button"
                        className="topicchip"
                        onClick={() => navigate("practice", { section, topic, set: "all" })}
                      >
                        <span className="topicchip__name">{topic}</span>
                        <span className="topicchip__count">
                          {topicScore.solved > 0 ? `${topicScore.solved}/${topicList.length}` : topicList.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {solvedIds > 0 && (
        <section className="block">
          <div className="cta">
            <div>
              <h3>Kaldığın yerden devam et</h3>
              <p>
                {solvedIds} soru çözdün, doğruluk oranın %{overall.accuracy}. Çözülmemiş sorularla devam edebilirsin.
              </p>
            </div>
            <div className="cta__actions">
              <button type="button" className="btn btn--primary" onClick={() => navigate("practice", { set: "unsolved" })}>
                Çözülmemişleri çalış
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => navigate("practice", { set: "wrong" })}>
                Yanlışlarımı tekrar çöz
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
