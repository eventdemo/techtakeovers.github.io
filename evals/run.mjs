// Regression tests for the translator: run after every change to system-prompt.md or dict.md.
//
//   node evals/run.mjs                       # against the deployed Worker (uses the *published* prompt + dict)
//   WORKER_URL=http://localhost:8787/translate node evals/run.mjs   # against `wrangler dev`
//   node evals/run.mjs rollback              # only cases whose input contains "rollback"
//
// Each request costs a fraction of a cent. Requests are spaced out to stay under the
// Worker's rate limit (10/min per IP); override with DELAY_MS.
//
// Case fields (evals/cases.json):
//   expect      dictionary terms that must all be returned
//   expectAny   at least one of these terms must be returned
//   forbid      look-alike terms that must NOT be returned
//   noDictTerms true if no dictionary term should be returned at all
// Every case is also checked for: dictionary terms that don't exist in dict.md, and numbers
// in the output that weren't in the input (a sign the model added facts).

import { readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url);
const WORKER_URL = process.env.WORKER_URL || "https://api.techtakeovers-api.workers.dev/translate";
const ORIGIN = process.env.ORIGIN || "https://techalt.github.io";
const DELAY_MS = Number(process.env.DELAY_MS ?? (WORKER_URL.includes("localhost") ? 0 : 6500));
const filter = (process.argv[2] || "").toLowerCase();

const norm = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
// "SLA (Service Level Agreement)" -> ["sla (service level agreement)", "sla", "service level agreement"]
const keys = (name) => {
  const out = [norm(name)];
  const m = name.match(/^(.*?)\s*\((.*)\)$/);
  if (m) { out.push(norm(m[1])); if (!m[2].includes(",")) out.push(norm(m[2])); }
  return out;
};

const dictTerms = readFileSync(new URL("dict.md", ROOT), "utf8")
  .split("\n").filter((l) => l.startsWith("### ")).map((l) => l.slice(4).trim());
const known = new Map();
for (const t of dictTerms) for (const k of keys(t)) known.set(k, t);
const canonical = (name) => { for (const k of keys(name)) if (known.has(k)) return known.get(k); return null; };

const cases = JSON.parse(readFileSync(new URL("evals/cases.json", ROOT), "utf8"))
  .filter((c) => !filter || c.input.toLowerCase().includes(filter));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const numbers = (s) => new Set((s.match(/\d+(?:[.,]\d+)?/g) || []));

let passed = 0;
console.log(`Running ${cases.length} cases against ${WORKER_URL}\n`);

for (const [i, c] of cases.entries()) {
  if (i > 0 && DELAY_MS) await sleep(DELAY_MS);
  const problems = [];
  let data;
  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: ORIGIN },
      body: JSON.stringify({ text: c.input }),
    });
    data = await res.json();
    if (!res.ok) problems.push(`HTTP ${res.status}: ${data.error}`);
  } catch (e) {
    problems.push(`request failed: ${e.message}`);
  }

  if (data && !problems.length) {
    const returned = data.terms_used.filter((t) => t.in_dictionary);
    const got = new Set();
    for (const t of returned) {
      const name = canonical(t.term);
      if (name) got.add(name);
      else problems.push(`claims "${t.term}" is in the dictionary, but it isn't`);
    }
    for (const e of c.expect || []) if (!got.has(canonical(e))) problems.push(`missing expected term "${e}"`);
    if (c.expectAny && !c.expectAny.some((e) => got.has(canonical(e)))) problems.push(`expected one of: ${c.expectAny.join(", ")}`);
    for (const f of c.forbid || []) if (got.has(canonical(f))) problems.push(`used look-alike term "${f}"`);
    if (c.noDictTerms && got.size) problems.push(`expected no dictionary terms, got: ${[...got].join(", ")}`);

    const inNums = numbers(c.input);
    const added = [...numbers(data.technical_version)].filter((n) => !inNums.has(n));
    if (added.length) problems.push(`added numbers not in the input: ${added.join(", ")}`);
  }

  const ok = problems.length === 0;
  if (ok) passed++;
  console.log(`${ok ? "✅" : "❌"} ${c.input}`);
  if (data?.technical_version) console.log(`   → ${data.technical_version}`);
  if (data?.terms_used?.length) console.log(`   terms: ${data.terms_used.map((t) => t.term + (t.in_dictionary ? "" : " (outside)")).join(", ")}`);
  if (data?.note) console.log(`   note: ${data.note}`);
  for (const p of problems) console.log(`   ⚠️  ${p}`);
  console.log();
}

console.log(`${passed}/${cases.length} passed`);
process.exit(passed === cases.length ? 0 : 1);