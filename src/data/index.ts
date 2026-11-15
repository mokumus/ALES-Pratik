import raw from "./questions.json";
import type { ExamInfo, Question, Section } from "../types";

export const LETTERS = ["A", "B", "C", "D", "E"] as const;

export const SECTION_LABELS: Record<Section, string> = {
  sayisal: "Sayısal",
  sozel: "Sözel",
};

export const questions = raw as Question[];

export function examKey(q: Question): string {
  return `${q.year}-${q.session}`;
}

export function examLabel(q: Question): string {
  return `${q.year} ALES/${q.session}`;
}

/** Sınavları yeniden eskiye doğru listeler. */
export const exams: ExamInfo[] = (() => {
  const map = new Map<string, ExamInfo>();
  for (const q of questions) {
    const key = examKey(q);
    const current = map.get(key);
    if (current) {
      current.total += 1;
      current[q.section] += 1;
    } else {
      map.set(key, {
        key,
        label: examLabel(q),
        shortLabel: `${q.year}/${q.session}`,
        year: q.year,
        session: q.session,
        period: q.period,
        total: 1,
        sayisal: q.section === "sayisal" ? 1 : 0,
        sozel: q.section === "sozel" ? 1 : 0,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.year - a.year || b.session - a.session);
})();

export const TOPICS: Record<Section, string[]> = {
  sayisal: [...new Set(questions.filter((q) => q.section === "sayisal").map((q) => q.topic))].sort(
    (a, b) => a.localeCompare(b, "tr"),
  ),
  sozel: [...new Set(questions.filter((q) => q.section === "sozel").map((q) => q.topic))].sort((a, b) =>
    a.localeCompare(b, "tr"),
  ),
};

export const allTopics = [...TOPICS.sayisal, ...TOPICS.sozel];

export function getQuestion(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

/** KaTeX ifadelerini düz metne indirger (liste önizlemesi ve arama için). */
function texToPlain(tex: string): string {
  let out = tex;
  for (let i = 0; i < 3; i += 1) {
    out = out.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, "($1)/($2)");
  }
  return out
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, "√($1)")
    .replace(/\\text\s*\{([^{}]*)\}/g, "$1")
    .replace(/\\left|\\right/g, "")
    .replace(/\\cdot/g, "·")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\pi/g, "π")
    .replace(/\\infty/g, "∞")
    .replace(/\\le(q)?/g, "≤")
    .replace(/\\ge(q)?/g, "≥")
    .replace(/\\ne(q)?/g, "≠")
    .replace(/\\pm/g, "±")
    .replace(/\\%/g, "%")
    .replace(/[{}$]/g, "")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/[ \t]{2,}/g, " ");
}

export function mathToPlain(text: string): string {
  if (!text.includes("$")) return text;
  return text
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, tex: string) => texToPlain(tex))
    .replace(/\$([^$\n]+)\$/g, (_, tex: string) => texToPlain(tex));
}

export function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .replaceAll("ı", "i")
    .replaceAll("İ", "i")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function searchQuestions(list: Question[], term: string): Question[] {
  const needle = normalizeText(term.trim());
  if (!needle) return list;
  return list.filter((q) =>
    normalizeText(
      `${mathToPlain(q.stem)} ${q.topic} ${examLabel(q)} ${q.options.map(mathToPlain).join(" ")}`,
    ).includes(needle),
  );
}
