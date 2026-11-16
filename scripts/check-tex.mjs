/** Soru bankasındaki tüm $...$ / $$...$$ ifadelerini KaTeX ile derler. */
import katex from "katex";
import { readFileSync } from "node:fs";

const file = "src/data/questions.json";
const questions = JSON.parse(readFileSync(file, "utf8"));

let total = 0;
let bad = 0;

function scan(id, field, text) {
  const re = /\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g;
  let m;
  while ((m = re.exec(text))) {
    const tex = m[1] ?? m[2];
    const display = m[1] !== undefined;
    total += 1;
    try {
      katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: false });
    } catch (err) {
      bad += 1;
      console.log(`✗ ${id} · ${field}\n   ${tex}\n   ${err.message}`);
    }
  }
  // Kapanmamış dolar işareti kontrolü
  const dollars = (text.match(/\$/g) ?? []).length;
  if (dollars % 2 !== 0) {
    bad += 1;
    console.log(`✗ ${id} · ${field} → kapanmamış $ (${dollars} adet)`);
    console.log(`   ${text.slice(0, 160).replace(/\n/g, " ⏎ ")}`);
  }
}

for (const q of questions) {
  scan(q.id, "stem", q.stem);
  q.options.forEach((opt, i) => scan(q.id, `option ${i + 1}`, opt));
  scan(q.id, "solution", q.solution);
}

console.log(`\n${total} matematik ifadesi, ${bad} hata`);
process.exit(bad === 0 ? 0 : 1);
