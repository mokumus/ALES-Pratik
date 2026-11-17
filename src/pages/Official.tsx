import { useMemo, useState } from "react";
import {
  officialCounts,
  officialExams,
  type OfficialLink,
} from "../data/officialExams";
import { examKey, questions } from "../data";
import { navigate } from "../lib/router";

const KIND_LABELS = {
  all: "Tümü",
  tam: "Tam sınav",
  yuzde10: "%10 kitapçık",
} as const;

type KindFilter = keyof typeof KIND_LABELS;

function shortLinkLabel(link: OfficialLink): string {
  const label = link.label.toLocaleLowerCase("tr");
  if (label.includes("cevap")) return "Cevap anahtarı";
  if (label.includes("duyuru")) return "Duyuru";
  return "Kitapçık";
}

function questionCount(examId: string, counts: Map<string, number>): number {
  return counts.get(examId) ?? 0;
}

export default function Official() {
  const [kind, setKind] = useState<KindFilter>("all");
  const [year, setYear] = useState("");

  const years = useMemo(() => [...new Set(officialExams.map((exam) => exam.year))], []);

  /** Soru bankasındaki sınav kimliği → soru sayısı */
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const question of questions) {
      const key = examKey(question);
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, []);

  const list = useMemo(
    () =>
      officialExams.filter(
        (exam) => (kind === "all" || exam.kind === kind) && (!year || exam.year === Number(year)),
      ),
    [kind, year],
  );

  const totalQuestions = useMemo(
    () => list.reduce((sum, exam) => sum + questionCount(exam.id, counts), 0),
    [list, counts],
  );

  return (
    <div className="page">
      <header className="pagehead">
        <div>
          <h1>Resmî sınav arşivi</h1>
          <p className="pagehead__sub">
            {officialCounts.total} ÖSYM kitapçığı · {officialCounts.tam} tam sınav ·{" "}
            {officialCounts.yuzde10} %10 kitapçık
          </p>
        </div>
        <button
          type="button"
          className="btn btn--soft btn--sm"
          onClick={() => navigate("practice", { set: "all" })}
        >
          Soru bankasına dön
        </button>
      </header>

      <div className="notice notice--muted">
        <h3>Nasıl çalışır?</h3>
        <p>
          Her sınavın yanındaki <strong>Çalış</strong> düğmesi, o sınav için soru bankasına eklenmiş
          soruları açar. Sorular ÖSYM'nin resmî kitapçıklarından alınır ve her sorunun kartında
          kitapçığın ilgili sayfasına giden bir <strong>PDF bağlantısı</strong> bulunur.
        </p>
        <p className="notice__small">
          Kitapçık ve duyuru bağlantıları doğrudan ÖSYM'nin doküman sunucusuna gider; PDF'ler bu
          uygulamada barındırılmaz. Bir sınavın soruları henüz eklenmediyse Çalış ekranı bunu söyler ve
          kitapçığı açman için bağlantı verir. %10'luk kitapçıklarda her sorunun doğru cevabı sorunun
          hemen altında yazılıdır.
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
        <span className="archivebar__count">
          {list.length} kitapçık · {totalQuestions} soru
        </span>
      </div>

      <ul className="examlists">
        {list.map((exam) => {
          const count = questionCount(exam.id, counts);
          return (
            <li className="examrow" key={exam.id}>
              <div className="examrow__main">
                <div className="examrow__title">
                  <strong>{exam.label}</strong>
                  <span className={`tag ${exam.kind === "tam" ? "tag--tam" : "tag--y10"}`}>
                    {exam.kind === "tam" ? "Tam sınav" : "%10 kitapçık"}
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
                <span className={`examrow__count${count === 0 ? " is-empty" : ""}`}>
                  {count === 0 ? "Soru eklenmedi" : `${count} soru`}
                </span>
                <button
                  type="button"
                  className={`btn btn--sm ${count > 0 ? "btn--primary" : "btn--soft"}`}
                  onClick={() => navigate("practice", { exam: exam.id, set: "all" })}
                  title={
                    count > 0
                      ? `${exam.label} sorularını çalış`
                      : `${exam.label} soruları henüz eklenmedi — kitapçığı PDF'ten açabilirsin`
                  }
                >
                  Çalış
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="archivefoot">
        Kaynak: ÖSYM doküman sunucusu. Bağlantılar ÖSYM'nin yayımladığı duyuru sayfalarından
        derlenmiştir; dosyalar kaldırılırsa bağlantı çalışmayabilir. Soruların telif hakkı ÖSYM'ye
        aittir.
      </p>
    </div>
  );
}
