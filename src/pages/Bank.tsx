import { useMemo, useState } from "react";
import { LETTERS, TOPICS, exams, examKey, mathToPlain, questions, searchQuestions } from "../data";
import type { Section } from "../types";
import { useProgress } from "../lib/store";
import { navigate } from "../lib/router";
import MetaChips from "../components/MetaChips";

type Status = "all" | "solved" | "unsolved" | "wrong";

const STATUS_LABELS: Record<Status, string> = {
  all: "Tümü",
  solved: "Çözülenler",
  unsolved: "Çözülmeyenler",
  wrong: "Yanlış yapılanlar",
};

export default function Bank({ params }: { params: URLSearchParams }) {
  const progress = useProgress();
  const [search, setSearch] = useState("");
  const [exam, setExam] = useState(params.get("exam") ?? "");
  const [section, setSection] = useState(params.get("section") ?? "");
  const [topic, setTopic] = useState(params.get("topic") ?? "");
  const [status, setStatus] = useState<Status>("all");

  const results = useMemo(() => {
    let list = questions.slice();
    if (exam) list = list.filter((q) => examKey(q) === exam);
    if (section) list = list.filter((q) => q.section === section);
    if (topic) list = list.filter((q) => q.topic === topic);
    if (status === "solved") list = list.filter((q) => progress.answers[q.id]);
    if (status === "unsolved") list = list.filter((q) => !progress.answers[q.id]);
    if (status === "wrong") list = list.filter((q) => progress.answers[q.id] && !progress.answers[q.id].correct);
    list = searchQuestions(list, search);
    return list.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      if (a.session !== b.session) return b.session - a.session;
      if (a.section !== b.section) return a.section === "sayisal" ? -1 : 1;
      return a.no - b.no;
    });
  }, [exam, section, topic, status, search, progress]);

  const topicOptions = section ? TOPICS[section as Section] : [...TOPICS.sayisal, ...TOPICS.sozel];
  const hasFilters = Boolean(exam || section || topic || status !== "all" || search);

  const clearAll = () => {
    setExam("");
    setSection("");
    setTopic("");
    setStatus("all");
    setSearch("");
  };

  return (
    <div className="page">
      <header className="pagehead">
        <div>
          <h1>Soru Bankası</h1>
          <p className="pagehead__sub">
            {questions.length} soru · {exams.length} sınav dönemi · her sorunun kaynağı etiketli
          </p>
        </div>
        <button type="button" className="btn btn--soft btn--sm" onClick={() => navigate("practice", { set: "unsolved" })}>
          Çözülmemişlerle çalış
        </button>
      </header>

      <div className="card filters">
        <div className="filters__grid">
          <label className="field field--wide">
            <span>Ara</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Soru metni, konu veya sınav adı…"
            />
          </label>
          <label className="field">
            <span>Sınav</span>
            <select value={exam} onChange={(e) => setExam(e.target.value)}>
              <option value="">Tümü</option>
              {exams.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label} · {item.period}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Bölüm</span>
            <select
              value={section}
              onChange={(e) => {
                setSection(e.target.value);
                setTopic("");
              }}
            >
              <option value="">Tümü</option>
              <option value="sayisal">Sayısal</option>
              <option value="sozel">Sözel</option>
            </select>
          </label>
          <label className="field">
            <span>Konu</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="">Tümü</option>
              {topicOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Durum</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
              {(Object.keys(STATUS_LABELS) as Status[]).map((key) => (
                <option key={key} value={key}>
                  {STATUS_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="filters__foot">
          <span>
            <strong>{results.length}</strong> soru listeleniyor
          </span>
          {hasFilters && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={clearAll}>
              Filtreleri temizle
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="card empty">
          <h2>Aramanıza uygun soru yok</h2>
          <p>Filtreleri gevşetmeyi veya farklı bir anahtar sözcük denemeyi deneyin.</p>
          <button type="button" className="btn btn--ghost" onClick={clearAll}>
            Filtreleri temizle
          </button>
        </div>
      ) : (
        <ul className="qlist">
          {results.map((question) => {
            const record = progress.answers[question.id];
            return (
              <li key={question.id} className="card qrow">
                <div className="qrow__main">
                  <MetaChips question={question} />
                  <p className="qrow__stem">{mathToPlain(question.stem).replace(/\s*\n+\s*/g, " ")}</p>
                  <div className="qrow__foot">
                    {record ? (
                      <span className={`badge ${record.correct ? "badge--ok" : "badge--no"}`}>
                        {record.correct ? "Doğru" : "Yanlış"} · {LETTERS[record.choice]}
                      </span>
                    ) : (
                      <span className="badge badge--idle">Çözülmedi</span>
                    )}
                    {progress.reveals[question.id]?.solution && (
                      <span className="badge badge--idle">Çözüm açıldı</span>
                    )}
                  </div>
                </div>
                <div className="qrow__actions">
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => navigate("practice", { set: "all", q: question.id })}
                  >
                    Soruyu aç
                  </button>
                  <button
                    type="button"
                    className="btn btn--soft btn--sm"
                    onClick={() => navigate("practice", { set: "all", topic: question.topic })}
                  >
                    Konuyu çalış
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="notice notice--muted">
        <h3>Kaynak notu</h3>
        <p>
          Etiketlerdeki sınav dönemleri (2026 ALES/1, 2025 ALES/2, 2025 ALES/1) soruların hazırlanırken
          temel alındığı sınavları gösterir. “Örnek” etiketli sorular bu sınavların kapsam ve zorluk
          düzeyine göre yazılmış <strong>özgün alıştırma sorularıdır</strong>; ÖSYM kitapçıklarında bu
          hâliyle yer almazlar.
        </p>
        <p className="notice__small">
          Bu nedenle örnek sorularda kitapçık bağlantısı gösterilmez; yanlış yönlendirmemek için yalnızca
          gerçekten o kitapçıktan alınmış sorularda (<code>official: true</code>, istenirse{" "}
          <code>pdfPage</code> ile sayfa numarası) bağlantı görünür. Kitapçıkların kendisine ana sayfadaki
          sınav dönemi kartlarındaki “Kitapçık ↗” bağlantısından ulaşabilirsin; PDF'ler projede
          barındırılmaz, doğrudan ÖSYM'nin sunucusundan açılır.
        </p>
        <p className="notice__small">
          Her sorunun kendi adresi vardır: bir soruyu açtığında adres çubuğundaki bağlantı o soruyu
          gösterir, bağlantıyı kaydedip daha sonra aynı soruya dönebilirsin.
        </p>
      </div>
    </div>
  );
}
