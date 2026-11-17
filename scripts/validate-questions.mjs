#!/usr/bin/env node
/**
 * Soru bankası doğrulayıcı.
 * Kullanım: npm run validate
 *
 * Bir soru eklendiğinde/taşındığında yapının bozulmadığını kontrol eder:
 * benzersiz kimlik, 5 seçenek, geçerli cevap indeksi, boş alan kalmaması.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, "..", "src", "data", "questions.json");
const bookletsFile = join(here, "..", "src", "data", "booklets.ts");
const strict = process.argv.includes("--strict");

const SECTIONS = new Set(["sayisal", "sozel"]);
const DIFFICULTIES = new Set(["kolay", "orta", "zor"]);
const LETTERS = ["A", "B", "C", "D", "E"];

/** booklets.ts içinde tanımlı sınav kimlikleri ("2026-1" gibi). */
const bookletKeys = new Set(
  [...readFileSync(bookletsFile, "utf8").matchAll(/"(\d{4}-\d)":\s*\{/g)].map((match) => match[1]),
);

let questions;
try {
  questions = JSON.parse(readFileSync(file, "utf8"));
} catch (error) {
  console.error(`✖ Soru dosyası okunamadı: ${file}\n${error.message}`);
  process.exit(1);
}

if (!Array.isArray(questions) || questions.length === 0) {
  console.error("✖ Soru bankası boş bir dizi olmamalı.");
  process.exit(1);
}

const errors = [];
const ids = new Set();
const required = ["id", "year", "session", "period", "section", "topic", "no", "difficulty", "stem", "options", "answer", "solution"];

questions.forEach((q, index) => {
  const where = `#${index + 1} (${q.id ?? "kimliksiz"})`;

  for (const key of required) {
    if (q[key] === undefined || q[key] === null || q[key] === "") {
      errors.push(`${where}: "${key}" alanı eksik.`);
    }
  }

  if (typeof q.id === "string") {
    if (ids.has(q.id)) errors.push(`${where}: "${q.id}" kimliği tekrar ediyor.`);
    ids.add(q.id);
  }

  if (!Number.isInteger(q.year) || q.year < 2000) errors.push(`${where}: "year" geçerli bir yıl olmalı.`);
  if (q.session !== 1 && q.session !== 2) errors.push(`${where}: "session" 1 veya 2 olmalı.`);
  if (!["İlkbahar", "Sonbahar"].includes(q.period)) errors.push(`${where}: "period" İlkbahar/Sonbahar olmalı.`);
  if (!SECTIONS.has(q.section)) errors.push(`${where}: "section" sayisal/sozel olmalı.`);
  if (!DIFFICULTIES.has(q.difficulty)) errors.push(`${where}: "difficulty" kolay/orta/zor olmalı.`);
  if (!Number.isInteger(q.no) || q.no < 1 || q.no > 100) errors.push(`${where}: "no" 1-100 arasında olmalı.`);

  if (!Array.isArray(q.options) || q.options.length !== 5) {
    errors.push(`${where}: tam olarak 5 seçenek gerekli.`);
  } else if (q.options.some((option) => typeof option !== "string" || option.trim() === "")) {
    errors.push(`${where}: boş seçenek olamaz.`);
  } else if (new Set(q.options.map((o) => o.trim())).size !== 5) {
    errors.push(`${where}: seçenekler birbirinden farklı olmalı.`);
  }

  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 4) {
    errors.push(`${where}: "answer" 0-4 arasında bir indeks olmalı (0 = A).`);
  }

  if (typeof q.solution === "string" && q.solution.trim().length < 20) {
    errors.push(`${where}: "solution" çok kısa; adım adım çözüm yazılmalı.`);
  }

  if (typeof q.stem === "string" && q.stem.trim().length < 10) {
    errors.push(`${where}: "stem" çok kısa.`);
  }

  if (q.pdfPage !== undefined) {
    if (!Number.isInteger(q.pdfPage) || q.pdfPage < 1) {
      errors.push(`${where}: "pdfPage" pozitif bir sayfa numarası olmalı.`);
    }
    if (!q.official) {
      errors.push(`${where}: "pdfPage" yalnızca resmî sorularda (official: true) kullanılabilir.`);
    }
  }

  if (typeof q.official !== "boolean") {
    errors.push(`${where}: "official" true/false olmalı.`);
  } else if (q.official) {
    if (!Number.isInteger(q.pdfPage)) {
      errors.push(`${where}: resmî soruda "pdfPage" zorunlu (soruya PDF bağlantısı verilir).`);
    }
    if (!bookletKeys.has(`${q.year}-${q.session}`)) {
      errors.push(
        `${where}: "${q.year}-${q.session}" için src/data/booklets.ts içinde kitapçık PDF adresi yok.`,
      );
    }
  }
});

if (errors.length > 0) {
  console.error(`✖ ${errors.length} sorun bulundu:\n`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const byExam = new Map();
for (const q of questions) {
  const key = `${q.year} ALES/${q.session}`;
  const entry = byExam.get(key) ?? { total: 0, sayisal: 0, sozel: 0 };
  entry.total += 1;
  entry[q.section] += 1;
  byExam.set(key, entry);
}

console.log(`✓ ${questions.length} soru geçerli.`);
for (const [label, counts] of [...byExam.entries()].sort().reverse()) {
  console.log(`  · ${label}: ${counts.total} soru (sayısal ${counts.sayisal}, sözel ${counts.sozel})`);
}
const topics = new Set(questions.map((q) => q.topic));
const official = questions.filter((q) => q.official).length;
const sample = questions.filter((q) => !q.official).length;
console.log(`  · ${topics.size} konu, ${official} resmî soru`);
if (sample > 0) {
  console.log(`  · ${sample} örnek soru (PDF bağlantısı yok; --strict ile hata verilir)`);
}
if (strict && sample > 0) {
  console.error(`\n✖ --strict: ${sample} soru resmî değil. Tüm sorular çıkmış soru olmalı.`);
  process.exit(1);
}
