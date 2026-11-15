import { allTopics, exams, questions, SECTION_LABELS } from "../data";
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
            Geçmiş ALES sorularıyla
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
          <p>Son bir yılın sınavlarından derlenen sorularla dönem dönem çalış.</p>
        </div>
        <div className="grid grid--exams">
          {exams.map((exam) => {
            const list = questions.filter((q) => `${q.year}-${q.session}` === exam.key);
            const score = scoreOf(list, progress);
            const ratio = Math.round((score.solved / exam.total) * 100);
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
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate("practice", { exam: exam.key, set: "all" })}>
                    Çöz →
                  </button>
                </footer>
              </article>
            );
          })}
        </div>
      </section>

      <section className="block">
        <div className="block__head">
          <h2>Nasıl çalışılır?</h2>
          <p>Araç, sınavda karşılaşacağın akışı birebir taklit eder.</p>
        </div>
        <div className="grid grid--features">
          <article className="card feature">
            <span className="feature__num">01</span>
            <h3>Filtrele</h3>
            <p>Yıla, bölüme ve konuya göre çalış. Eksik olduğun konuyu, sadece o konunun sorularıyla kapat.</p>
          </article>
          <article className="card feature">
            <span className="feature__num">02</span>
            <h3>Önce kendin dene</h3>
            <p>Seçeneği işaretle. Doğru cevap hemen açılmaz; böylece gerçek sınav koşulunda düşünmeye devam edersin.</p>
          </article>
          <article className="card feature">
            <span className="feature__num">03</span>
            <h3>Cevabı ve çözümü aç</h3>
            <p>Tek tuşla doğru cevabı, ardından adım adım çözümü gör. Doğru/yanlış durumun cihazında saklanır.</p>
          </article>
        </div>
      </section>

      <section className="block">
        <div className="notice">
          <h3>Soru bankası hakkında</h3>
          <p>
            Bu sürümdeki sorular, 2025–2026 ALES sınavlarının konu dağılımına ve zorluk düzeyine göre
            hazırlanmış <strong>özgün alıştırma sorularıdır</strong>; resmî ÖSYM kitapçıklarından birebir
            alınmamıştır. Banka, resmî sorular eklendiğinde aynı arayüzle çalışacak şekilde tasarlandı.
          </p>
          <p className="notice__small">
            Yeni soru eklemek için <code>src/data/questions.json</code> dosyasına aynı yapıda kayıt eklemek
            yeterli. <code>official: true</code> alanı, sorunun resmî kaynaktan geldiğini belirtir.
          </p>
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
              <button type="button" className="btn btn--ghost" onClick={() => navigate("stats")}>
                İstatistikler
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="block block--tight">
        <div className="quicklinks">
          {(["sayisal", "sozel"] as const).map((section) => (
            <button
              type="button"
              key={section}
              className="quicklink"
              onClick={() => navigate("practice", { section, set: "all" })}
            >
              <span className={`dot dot--${section}`} />
              <span>
                <strong>{SECTION_LABELS[section]} bölüm</strong>
                <small>{questions.filter((q) => q.section === section).length} soru</small>
              </span>
              <span className="quicklink__arrow">→</span>
            </button>
          ))}
          <button type="button" className="quicklink" onClick={() => navigate("bank")}>
            <span className="dot dot--neutral" />
            <span>
              <strong>Tüm soru bankası</strong>
              <small>Filtrele ve ara</small>
            </span>
            <span className="quicklink__arrow">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
