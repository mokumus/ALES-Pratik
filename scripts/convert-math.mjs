/**
 * Soru bankasındaki düz metin matematik ifadelerini KaTeX'e çevirir.
 *
 *   node scripts/convert-math.mjs --dry   → değişiklikleri yazmadan rapor eder
 *   node scripts/convert-math.mjs         → questions.json dosyasını günceller
 *
 * Kurallar:
 *  - $...$ içeren metinlere dokunmaz (elle yazılmış dizgi korunur).
 *  - Yalnızca matematik işleci içeren grupları sarar; Türkçe sözcükler metin kalır.
 *  - ^, Unicode üst simgeler, √, ·, ×, ÷, ≤, ≥, ≠, % ve kesirleri TeX'e çevirir.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const file = resolve(here, "../src/data/questions.json");
const dry = process.argv.includes("--dry");

const SUP = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
  "⁻": "-", "⁺": "+", "ⁿ": "n",
};
const SUP_CHARS = Object.keys(SUP).join("");
const CONNECTORS = "+-−·×÷/=<>≤≥≠≈≡∈⊙⊕⊗∗|^()[]:,;";
const QUALIFY = /[\/^√·×÷=<>≤≥≠≈≡∈±⊙⊕⊗∗π°|+\-−*]/;

const isConnector = (t) => /^[+\-−·×÷/=<>≤≥≠≈≡∈⊙⊕⊗∗|^()[\]:,;]+$/.test(t);
const isVar = (t) => /^[()[\]]*[A-Za-z][()[\]]*$/.test(t);
/** f(x), f(a + 1), P(A) gibi fonksiyon yazımları. */
const isCall = (t) => /^[A-Za-z][A-Za-z0-9]*\([^()]*\)?$/.test(t);

function isWord(t) {
  if (t.includes("'") || t.includes("’")) return true; // 23'tür, x'i
  if (isCall(t)) return false;
  const runs = t.match(/[A-Za-zÇĞİÖŞÜçğıöşü]+/g) ?? [];
  // "ab²", "a²b" gibi kısa çarpımlar matematik; "gidiş-dönüş" sözcük.
  const mathish = /[0-9^²³⁴⁵⁶⁷⁸⁹⁰¹⁻⁺]/.test(t);
  return runs.some((w) => w.length > (mathish ? 2 : 1));
}

function isMathToken(t) {
  if (isWord(t)) return false;
  if (/[0-9]/.test(t)) return true;
  if (isCall(t)) return true;
  if (new RegExp(`[${SUP_CHARS}]`).test(t)) return true;
  if (/^[⊙⊕⊗π]$/.test(t)) return true;
  return QUALIFY.test(t) && !isConnector(t);
}

/** Bir grup matematik mi? Tek başına sayı ("12") matematik sayılmaz. */
function qualifies(text) {
  return (
    QUALIFY.test(text) ||
    /[0-9][A-Za-z]|[A-Za-z][0-9]/.test(text) ||
    new RegExp(`[${SUP_CHARS}]`).test(text)
  );
}

function balanced(text) {
  let depth = 0;
  for (const ch of text) {
    if (ch === "(" || ch === "[") depth += 1;
    if (ch === ")" || ch === "]") depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
}

/** Matematik grubunu TeX'e çevirir. */
function toTex(src) {
  let s = src;

  // Üst simgeler: 2² → 2^{2}
  s = s.replace(/([0-9A-Za-z)])([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿ]+)/g, (_, base, sup) => {
    const exp = [...sup].map((c) => SUP[c]).join("");
    return `${base}^{${exp}}`;
  });

  // Şapka: 2^x, 4^(x+1)
  s = s.replace(/([0-9A-Za-z)}])\^\(([^()]*)\)/g, "$1^{$2}");
  s = s.replace(/([0-9A-Za-z)}])\^([0-9A-Za-z])/g, "$1^{$2}");

  // Kökler (kesirden önce, çünkü √(16·3) sadeleşir)
  s = s.replace(/√\s*\(([^()]+)\)/g, "\\sqrt{$1}");
  s = s.replace(/√\s*([0-9]+(?:[.,][0-9]+)?)/g, "\\sqrt{$1}");
  s = s.replace(/√\s*([A-Za-z])/g, "\\sqrt{$1}");
  s = s.replace(/√/g, "\\sqrt");

  // Kesirler: (a)/(b), (a)/b, a/b, 1/x^{2}
  const atom = String.raw`(?:[0-9A-Za-z]+(?:\^\{[^{}]*\})?|\{[^{}]*\})`;
  for (let i = 0; i < 3; i += 1) {
    s = s.replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g, "\\frac{$1}{$2}");
  }
  s = s.replace(/\(([^()]+)\)\s*\/\s*([0-9A-Za-z]+(?:\^\{[^{}]*\})?)/g, "\\frac{$1}{$2}");
  s = s.replace(/([0-9A-Za-z]+)\s*\/\s*\(([^()]*)\)/g, "\\frac{$1}{$2}");
  s = s.replace(
    new RegExp(`(${atom})\\s*\\/\\s*(${atom})`, "g"),
    "\\frac{$1}{$2}",
  );

  // İşaretler
  s = s.replace(/·/g, "\\cdot ");
  s = s.replace(/×/g, "\\times ");
  s = s.replace(/÷/g, "\\div ");
  s = s.replace(/≤/g, "\\le ");
  s = s.replace(/≥/g, "\\ge ");
  s = s.replace(/≠/g, "\\ne ");
  s = s.replace(/≡/g, "\\equiv ");
  s = s.replace(/∈/g, "\\in ");
  s = s.replace(/±/g, "\\pm ");
  s = s.replace(/⊙/g, "\\odot ");
  s = s.replace(/⊕/g, "\\oplus ");
  s = s.replace(/⊗/g, "\\otimes ");
  s = s.replace(/∗/g, "\\ast ");
  s = s.replace(/≈/g, "\\approx ");
  s = s.replace(/π/g, "\\pi ");
  s = s.replace(/°/g, "^{\\circ}");
  s = s.replace(/%/g, "\\%");
  s = s.replace(/−/g, "-");
  s = s.replace(/([0-9]),([0-9])/g, "$1{,}$2");
  s = s.replace(/ {2,}/g, " ");
  // Birimler dik yazılır: cm² → \mathrm{cm}^{2}; km/sa kesir olarak değil, eğik çizgiyle.
  s = s.replace(/(?<![A-Za-z\\])(cm|km|kg|mm|TL|sa|dk)(?![A-Za-z])/g, "\\mathrm{$1}");
  s = s.replace(/\\frac\{\\mathrm\{([a-z]+)\}\}\{\\mathrm\{([a-z]+)\}\}/g, "\\mathrm{$1}/\\mathrm{$2}");
  return s.trim();
}

/** Satırı token'lara ayırıp bitişik matematik parçalarını gruplar. */
function convertLine(line, mode) {
  const tokens = [];
  for (const m of line.matchAll(/\S+/g)) {
    // "23'tür" → "23" + "'tür": sayı matematik kalır, Türkçe ek metin olur.
    let offset = 0;
    for (const part of m[0].split(/(?=['’])/)) {
      if (part) {
        tokens.push({
          text: part,
          core: part.replace(/^[,;:.]+|[,;:.]+$/g, ""),
          start: m.index + offset,
          end: m.index + offset + part.length,
        });
      }
      offset += part.length;
    }
  }

  const groups = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    const startsGroup = isMathToken(t.core) || isVar(t.core) || isConnector(t.core);
    if (!startsGroup) {
      i += 1;
      continue;
    }

    let j = i;
    let sawMath = isMathToken(t.core) || isVar(t.core);
    while (j + 1 < tokens.length) {
      const next = tokens[j + 1];
      if (isWord(next.core)) break;
      if (!(isMathToken(next.core) || isVar(next.core) || isConnector(next.core))) break;
      if (isMathToken(next.core) || isVar(next.core)) sawMath = true;
      j += 1;
    }

    if (!sawMath) {
      i = j + 1;
      continue;
    }

    let start = tokens[i].start;
    let end = tokens[j].end;
    let raw = line.slice(start, end);

    // Baştaki/sondaki noktalama ve işleç artıklarını taşır (parantez ve eksi korunur).
    const LEAD_TRIM = ",;:=+·×÷≤≥≠≈≡/^";
    const TAIL_TRIM = ",;:.+-−·×÷/=<>≤≥≠≈≡^";
    let lead = 0;
    while (lead < raw.length && LEAD_TRIM.includes(raw[lead])) lead += 1;
    let tail = raw.length;
    while (tail > lead && TAIL_TRIM.includes(raw[tail - 1])) tail -= 1;
    raw = raw.slice(lead, tail);
    start += lead;

    // Parantezi kapanmamış grup: sondaki açık parantezi dışarıda bırak.
    if (!balanced(raw)) {
      let depth = 0;
      let cut = -1;
      for (let k = 0; k < raw.length; k += 1) {
        const ch = raw[k];
        if (ch === "(" || ch === "[") depth += 1;
        if (ch === ")" || ch === "]") depth -= 1;
        if (depth === 0) cut = k;
      }
      if (cut === -1) {
        i = j + 1;
        continue;
      }
      raw = raw.slice(0, cut + 1);
    }

    if (raw && balanced(raw) && qualifies(raw)) {
      groups.push({ start, end: start + raw.length, raw });
    }
    i = j + 1;
  }

  if (groups.length === 0) return { text: line, changed: false };

  let out = "";
  let cursor = 0;
  for (const g of groups) {
    if (g.start < cursor) continue;
    out += line.slice(cursor, g.start);
    const tex = toTex(g.raw);
    const whole = line.trim() === g.raw;
    const display = mode !== "option" && whole && /\\frac|\\sqrt|=/.test(tex);
    if (display) {
      out += `$$${tex}$$`;
    } else {
      // Satır içinde kesirler tam boy görünsün (kitapçıktaki gibi).
      out += `$${tex.replace(/\\frac/g, "\\dfrac")}$`;
    }
    cursor = g.end;
  }
  out += line.slice(cursor);
  return { text: out, changed: true };
}

/** Metin içindeki tek harfli değişkenleri (x, y, a, b…) eğik dizgiye alır. */
function italicVars(line) {
  return line
    .split(/(\$\$[\s\S]*?\$\$|\$[^$]*\$)/g)
    .map((part) => {
      if (part.startsWith("$")) return part;
      return part.replace(
        /(?<![A-Za-zÇĞİÖŞÜçğıöşüâîûÂÎÛ$])([xyzabcfgnmprt])(?![A-Za-zÇĞİÖŞÜçğıöşüâîûÂÎÛ$])/g,
        "$$$1$",
      );
    })
    .join("");
}

function convertText(value, mode) {
  if (value.includes("$")) return { text: value, changed: false };
  let changed = false;
  const text = value
    .split("\n")
    .map((line) => {
      const r = convertLine(line, mode);
      if (r.changed) changed = true;
      return italicVars(r.text);
    })
    .join("\n");
  return { text, changed };
}

const questions = JSON.parse(readFileSync(file, "utf8"));
const report = [];
let touched = 0;

for (const q of questions) {
  let local = false;
  const stem = convertText(q.stem, "stem");
  if (stem.changed) {
    report.push({ id: q.id, field: "stem", before: q.stem, after: stem.text });
    q.stem = stem.text;
    local = true;
  }
  q.options = q.options.map((opt, idx) => {
    const r = convertText(opt, "option");
    if (r.changed) {
      report.push({ id: q.id, field: `option ${idx + 1}`, before: opt, after: r.text });
      local = true;
    }
    return r.text;
  });
  const sol = convertText(q.solution, "solution");
  if (sol.changed) {
    report.push({ id: q.id, field: "solution", before: q.solution, after: sol.text });
    q.solution = sol.text;
    local = true;
  }
  if (local) touched += 1;
}

if (dry) {
  console.log(`${touched} soru, ${report.length} alan değişecek\n`);
  for (const r of report) {
    console.log(`--- ${r.id} · ${r.field}`);
    console.log(`  ÖNCE : ${r.before.replace(/\n/g, " ⏎ ")}`);
    console.log(`  SONRA: ${r.after.replace(/\n/g, " ⏎ ")}`);
    console.log();
  }
} else {
  writeFileSync(file, `${JSON.stringify(questions, null, 2)}\n`, "utf8");
  console.log(`${touched} soru güncellendi (${report.length} alan).`);
}
