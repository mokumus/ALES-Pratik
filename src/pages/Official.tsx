import { useEffect, useMemo, useState } from "react";
import {
  officialCounts,
  officialExamById,
  officialExams,
  type OfficialExam,
  type OfficialLink,
} from "../data/officialExams";
import {
  clearExamResult,
  saveExamResult,
  useExamResults,
  type ExamResult,
  type SectionScore,
} from "../lib/store";
import { navigate } from "../lib/router";

const LETTERS = ["A", "B", "C", "D", "E"] as const;
const PER_SECTION = 50;

type SectionKey = "sayisal" | "sozel";
type Marks = Record<string, string>;

const SECTION_LABELS: Record<SectionKey, string> = {
  sayisal: "Sayısal Testi",
  sozel: "Sözel Testi",
};

const KIND_LABELS = {
  all: "Tümü",
  tam: "Tam sınav",
  yuzde10: "%10 kitapçık",
} as const;

type KindFilter = keyof typeof KIND_LABELS;

function draftKey(examId: string): string {
  return `ales-pratik:sheet:${examId}`;
}

function loadDraft(examId: string): Marks {
  try {
    const raw = localStorage.getItem(draftKey(examId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Marks;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveDraft(examId: string, marks: Marks): void {
  try {
    localStorage.setItem(draftKey(examId), JSON.stringify(marks));
  } catch {
    /* yoksay */
  }
}

function formatNet(value: number): string {
  return value.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function scoreSection(
  answers: string | undefined,
  marks: Marks,
  section: SectionKey,
): SectionScore {
  let correct = 0;
  let wrong = 0;
  let empty = 0;

  for (let no = 1; no <= PER_SECTION; no += 1) {
    const mark = marks[`${section}-${no}`];
    if (!mark || !answers) {
      empty += 1;
      continue;
    }
    if (answers[no - 1] === mark) correct += 1;
    else wrong += 1;
  }

  return { correct, wrong, empty };
}

function shortLinkLabel(link: OfficialLink): string {
  const label = link.label.toLocaleLowerCase("tr");
  if (label.includes("cevap")) return "Cevap anahtarı";
  if (label.includes("duyuru")) return "Duyuru";
  return "Kitapçık";
}

export default function Official({ params }: { params: URLSearchParams }) {
  const id = params.get("e");
  const exam = id ? officialExamById(id) : undefined;
  return exam ? <ExamDetail key={exam.id} exam={exam} /> : <Archive />;
}

/* ---------- arşiv listesi ---------- */

function Archive() {
  const results = useExamResults();
  const [kind, setKind] = useState<KindFilter>("all");
  const [year, setYear] = useState("");

  const years = useMemo(() => [...new Set(officialExams.map((exam) => exam.year))], []);

  const list = useMemo(
    () =>
      officialExams.filter(
        (exam) => (kind === "all" || exam.kind === kind) && (!year || exam.year === Number(year)),
      ),
    [kind, year],
  );

  return (
    <div className="page">
      <header className="pagehead">
        <div>
          <h1>Resmî sınav arşivi</h1>
          <p className="pagehead__sub">
            {officialCounts.total} ÖSYM kitapçığı · {officialCounts.tam} tam sınav ·{" "}
            {officialCounts.yuzde10} %10 kitapçık · {officialCounts.graded} sınavda optik form
          </p>
        </div>
        <button type="button" className="btn btn--soft btn--sm" onClick={() => navigate("practice", { set: "all" })}>
          Soru bankasına dön
        </button>
      </header>

      <div className="notice notice--muted">
        <h3>Bu sayfa ne yapar?</h3>
        <p>
          Aşağıdaki bağlantılar soruları <strong>doğrudan ÖSYM'nin doküman sunucusundan</strong> açar; PDF'ler bu
          uygulamada barındırılmaz, kopyalanmaz. 2019–2021 tam kitapçıklarının sonunda yer alan resmî cevap
          anahtarı okunmuştur: bu sınavlar için işaretlemelerini girip net hesaplayabilirsin.
        </p>
        <p className="notice__small">
          %10'luk kitapçıklarda her sorunun doğru cevabı, sorunun hemen altında yazılıdır; bu yüzden ayrı optik
          form yoktur. Eski yıllarda (2006–2008) sözel ve sayısal testler ayrı dosyalar hâlindedir.
        </p>
      </div>

      <div className="archivebar">
        <div className="segmented" role="group" aria-label="Kitapçık türü">
          {(Object.keys(KIND_LABELS) as KindFilter[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`segmented__btn${kind === key ? " is-active" : ""}`}
              onClick={() => setKind(key)}
              aria-pressed={kind === key}
            >
              {KIND_LABELS[key]}
            </button>
          ))}
        </div>
        <label className="field field--inline">
          <span>Yıl</span>
          <select value={year} onChange={(event) => setYear(event.target.value)}>
            <option value="">Tümü</option>
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <span className="archivebar__count">{list.length} kitapçık</span>
      </div>

      <ul className="examlists">
        {list.map((exam) => {
          const result = results[exam.id];
          return (
            <li className="examrow" key={exam.id}>
              <div className="examrow__main">
                <div className="examrow__title">
                  <strong>{exam.label}</strong>
                  <span className={`tag ${exam.kind === "tam" ? "tag--tam" : "tag--y10"}`}>
                    {exam.kind === "tam" ? "Tam sınav · 100 soru" : "%10 kitapçık"}
                  </span>
                  {exam.date && <span className="examrow__date">{exam.date}</span>}
                </div>
                <div className="examrow__links">
                  {exam.links.map((link) => (
                    <a
                      key={link.url}
                      className="examrow__link"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {shortLinkLabel(link)} ↗
                    </a>
                  ))}
                </div>
              </div>
              <div className="examrow__side">
                {result && <span className="examrow__score">Net {formatNet(result.net)}</span>}
                {exam.answers ? (
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => navigate("official", { e: exam.id })}
                  >
                    Optik form
                  </button>
                ) : (
                  <span className="examrow__hint">Cevap sorunun altında</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="archivefoot">
        Kaynak: ÖSYM doküman sunucusu. Bağlantılar ÖSYM'nin yayımladığı duyuru sayfalarından derlenmiştir;
        dosyalar kaldırılırsa bağlantı çalışmayabilir. Soruların telif hakkı ÖSYM'ye aittir.
      </p>
    </div>
  );
}

/* ---------- tek sınav: optik form ---------- */

function ExamDetail({ exam }: { exam: OfficialExam }) {
  const results = useExamResults();
  const [marks, setMarks] = useState<Marks>(() => loadDraft(exam.id));
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setMarks(loadDraft(exam.id));
    setChecked(false);
  }, [exam.id]);

  useEffect(() => {
    saveDraft(exam.id, marks);
  }, [exam.id, marks]);

  const saved = results[exam.id];
  const filled = Object.values(marks).filter(Boolean).length;

  const live = useMemo(() => {
    if (!exam.answers) return null;
    const sayisal = scoreSection(exam.answers.sayisal, marks, "sayisal");
    const sozel = scoreSection(exam.answers.sozel, marks, "sozel");
    return {
      sayisal,
      sozel,
      net:
        sayisal.correct + sozel.correct - (sayisal.wrong + sozel.wrong) / 4,
    };
  }, [exam.answers, marks]);

  const pick = (section: SectionKey, no: number, letter: string) => {
    const key = `${section}-${no}`;
    setMarks((previous) => ({
      ...previous,
      [key]: previous[key] === letter ? "" : letter,
    }));
    setChecked(false);
  };

  const grade = () => {
    if (!live) return;
    const result: ExamResult = {
      examId: exam.id,
      sayisal: live.sayisal,
      sozel: live.sozel,
      net: live.net,
      at: Date.now(),
    };
    saveExamResult(result);
    setChecked(true);
  };

  const clearSheet = () => {
    setMarks({});
    setChecked(false);
    clearExamResult(exam.id);
    try {
      localStorage.removeItem(draftKey(exam.id));
    } catch {
      /* yoksay */
    }
  };

  return (
    <div className="page">
      <button type="button" className="backlink" onClick={() => navigate("official")}>
        ← Resmî sınav arşivi
      </button>

      <header className="pagehead">
        <div>
          <h1>{exam.label}</h1>
          <p className="pagehead__sub">
            {exam.kind === "tam" ? "Tam soru kitapçığı · 100 soru" : "%10 temel soru kitapçığı"}
            {exam.date ? ` · ${exam.date}` : ""}
          </p>
        </div>
        <div className="pagehead__actions">
          {exam.links.map((link) => (
            <a
              key={link.url}
              className={`btn btn--sm ${link.label.includes("Cevap") ? "btn--ghost" : "btn--soft"}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortLinkLabel(link)} ↗
            </a>
          ))}
        </div>
      </header>

      {!exam.answers ? (
        <div className="notice notice--muted">
          <h3>Bu kitapçıkta optik form yok</h3>
          <p>
            %10'luk kitapçıklarda soruların yalnızca bir bölümü yayımlanır ve her sorunun doğru cevabı sorunun
            hemen altında yazılıdır. Soruları ÖSYM'nin PDF'inden çözebilirsin.
          </p>
        </div>
      ) : (
        <>
          <div className="sheetnote">
            <p>
              Soruları yukarıdaki <strong>Kitapçık</strong> bağlantısından aç, işaretlemelerini buraya gir.
              Değerlendirince cevapların resmî anahtarla karşılaştırılır; 4 yanlış 1 doğruyu götürür.
            </p>
            <span className="sheetnote__count">{filled} / 100 işaretlendi</span>
          </div>

          <div className="sheet">
            {(["sayisal", "sozel"] as const).map((section) => {
              const answers = exam.answers?.[section];
              const sectionScore = checked && live ? live[section] : null;
              return (
                <section className="sheet__col" key={section}>
                  <header className="sheet__head">
                    <h3>
                      <span className={`dot dot--${section}`} />
                      {SECTION_LABELS[section]}
                    </h3>
                    {sectionScore ? (
                      <span className="sheet__scoreline">
                        {sectionScore.correct} D · {sectionScore.wrong} Y · {sectionScore.empty} B
                      </span>
                    ) : (
                      <span className="sheet__scoreline">
                        {Array.from({ length: PER_SECTION }, (_, i) => marks[`${section}-${i + 1}`]).filter(Boolean)
                          .length}{" "}
                        / {PER_SECTION}
                      </span>
                    )}
                  </header>

                  <ol className="sheet__list">
                    {Array.from({ length: PER_SECTION }, (_, index) => index + 1).map((no) => {
                      const key = `${section}-${no}`;
                      const picked = marks[key];
                      const answer = answers?.[no - 1];
                      const state =
                        checked && answer
                          ? !picked
                            ? " empty"
                            : picked === answer
                              ? " ok"
                              : " no"
                          : "";
                      return (
                        <li key={no} className={`sheetrow${state}`}>
                          <span className="sheetrow__no">{no}</span>
                          <span className="sheetrow__letters">
                            {LETTERS.map((letter) => (
                              <button
                                key={letter}
                                type="button"
                                className={`letterbtn${picked === letter ? " is-picked" : ""}${
                                  checked && answer === letter ? " is-answer" : ""
                                }`}
                                onClick={() => pick(section, no, letter)}
                                aria-pressed={picked === letter}
                                aria-label={`${SECTION_LABELS[section]} ${no}. soru ${letter}`}
                              >
                                {letter}
                              </button>
                            ))}
                          </span>
                          {checked && picked && answer && picked !== answer && (
                            <span className="sheetrow__key">{answer}</span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </section>
              );
            })}
          </div>

          <div className="sheetbar">
            <div className="sheetbar__info">
              {checked && live ? (
                <>
                  <strong>Net {formatNet(live.net)}</strong>
                  <span>
                    Doğru {live.sayisal.correct + live.sozel.correct} · Yanlış{" "}
                    {live.sayisal.wrong + live.sozel.wrong} · Boş {live.sayisal.empty + live.sozel.empty}
                  </span>
                </>
              ) : (
                <>
                  <strong>{filled} işaret</strong>
                  <span>Değerlendirmek için işaretlemelerini tamamla</span>
                </>
              )}
            </div>
            <div className="sheetbar__actions">
              <button type="button" className="btn btn--ghost btn--sm" onClick={clearSheet}>
                Temizle
              </button>
              <button type="button" className="btn btn--primary" onClick={grade}>
                Değerlendir
              </button>
            </div>
          </div>

          {saved && !checked && (
            <p className="sheetnote sheetnote--saved">
              Bu sınav için kayıtlı sonucun: <strong>Net {formatNet(saved.net)}</strong> (
              {new Date(saved.at).toLocaleDateString("tr-TR")}). Yeniden değerlendirmek için işaretlemelerini
              güncelle.
            </p>
          )}
        </>
      )}
    </div>
  );
}
