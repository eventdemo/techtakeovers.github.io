// TechTakeovers frontend
// Set this to your deployed Worker URL (see worker/README.md).
const WORKER_URL = "https://techtakeovers-api.YOUR-SUBDOMAIN.workers.dev/translate";

const EXAMPLES = [
  "It works on my machine but breaks in prod",
  "The site gets super slow when lots of people use it at once",
  "We had to go back to the old version after the update broke checkout",
  "That test fails randomly and passes when I re-run it",
  "If that one server dies, everything goes down",
  "Every morning someone restarts the worker by hand",
];

const STORAGE_KEY = "techtakeovers:v1";
const $ = (id) => document.getElementById(id);

// ---------- Storage (safe if localStorage is unavailable) ----------
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (s && Array.isArray(s.unlocked)) return s;
  } catch {}
  return { unlocked: [], streak: 0, lastDay: null };
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}
let state = loadState();

// ---------- Dictionary parsing ----------
// dict.md format: "## Section", then "### Term" followed by "- **Field:** value" lines.
let terms = [];             // [{ id, name, section, fields: {Definition, Example, ...} }]
const lookup = new Map();   // normalized name/alias -> term

function norm(s) { return s.toLowerCase().replace(/\s+/g, " ").trim(); }

function parseDict(md) {
  const out = [];
  let section = "";
  let current = null;
  for (const line of md.split("\n")) {
    if (line.startsWith("## ")) { section = line.slice(3).trim(); continue; }
    if (line.startsWith("### ")) {
      current = { id: norm(line.slice(4)), name: line.slice(4).trim(), section, fields: {} };
      out.push(current);
      continue;
    }
    const m = current && line.match(/^- \*\*(.+?):\*\*\s*(.*)$/);
    if (m) current.fields[m[1]] = m[2];
  }
  return out;
}

// Names a term can appear as in text: "SLA (Service Level Agreement)" -> full, "SLA", "Service Level Agreement".
function aliases(name) {
  const list = [name];
  const m = name.match(/^(.*?)\s*\((.*)\)$/);
  if (m) {
    list.push(m[1]);
    if (!m[2].includes(",")) list.push(m[2]);
  }
  return list.filter((a) => a.length > 1);
}

function findTerm(name) { return lookup.get(norm(name)) || null; }

// ---------- Rendering helpers ----------
// Renders "**bold**", "*italic*" and "`code`" from dict.md safely as DOM nodes.
function renderInline(text, parent) {
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    parent.append(text.slice(last, m.index));
    const tok = m[0];
    const el = tok.startsWith("**") ? document.createElement("strong")
      : tok.startsWith("`") ? document.createElement("code")
      : document.createElement("em");
    el.textContent = tok.replace(/^\*\*|\*\*$|^\*|\*$|^`|`$/g, "");
    parent.append(el);
    last = m.index + tok.length;
  }
  parent.append(text.slice(last));
}

function el(tag, props = {}, text) {
  const e = document.createElement(tag);
  Object.assign(e, props);
  if (text != null) e.textContent = text;
  return e;
}

function showTerm(term) {
  $("d-section").textContent = term.section;
  $("d-title").textContent = term.name;
  const dl = $("d-fields");
  dl.replaceChildren();
  for (const [k, v] of Object.entries(term.fields)) {
    dl.append(el("dt", {}, k));
    const dd = el("dd");
    renderInline(v, dd);
    dl.append(dd);
  }
  $("term-dialog").showModal();
}

let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add("hidden"), 2500);
}

// ---------- Streak, progress, term of the day ----------
function today(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function currentStreak() {
  return state.lastDay === today() || state.lastDay === today(-1) ? state.streak : 0;
}

function bumpStreak() {
  if (state.lastDay === today()) return;
  state.streak = state.lastDay === today(-1) ? state.streak + 1 : 1;
  state.lastDay = today();
  if (state.streak > 1) toast(`🔥 ${state.streak}-day streak!`);
}

function renderStats() {
  const known = new Set(terms.map((t) => t.id));
  const unlocked = state.unlocked.filter((id) => known.has(id)).length;
  const pct = terms.length ? Math.round((unlocked / terms.length) * 100) : 0;
  $("streak").textContent = `🔥 ${currentStreak()}`;
  $("progress-pill").textContent = `🧠 ${unlocked} / ${terms.length}`;
  $("progress-text").textContent = `${unlocked} of ${terms.length} terms unlocked`;
  $("bar-fill").style.width = `${pct}%`;
}

function renderVocab() {
  const box = $("vocab");
  box.replaceChildren();
  const unlocked = new Set(state.unlocked);
  const sections = [...new Set(terms.map((t) => t.section))];
  for (const section of sections) {
    const wrap = el("div", { className: "vocab-section" });
    wrap.append(el("h3", {}, section));
    const chips = el("div", { className: "chips" });
    for (const t of terms.filter((x) => x.section === section)) {
      const isOpen = unlocked.has(t.id);
      const b = el("button", { className: "vocab-term" + (isOpen ? "" : " locked") }, (isOpen ? "" : "🔒 ") + t.name);
      b.addEventListener("click", () => showTerm(t));
      chips.append(b);
    }
    wrap.append(chips);
    box.append(wrap);
  }
}

function renderTermOfTheDay() {
  if (!terms.length) return;
  let h = 0;
  for (const c of today()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const t = terms[h % terms.length];
  const btn = $("totd");
  btn.replaceChildren(el("strong", {}, t.name));
  const def = el("span");
  renderInline(t.fields.Definition || "", def);
  btn.append(def);
  btn.onclick = () => showTerm(t);
}

// ---------- Translation ----------
function renderResult(data) {
  const found = data.terms_used
    .map((u) => ({ ...u, entry: u.in_dictionary ? findTerm(u.term) : null }));

  // Highlight dictionary terms inside the technical version.
  const out = $("output");
  out.replaceChildren();
  const names = [];
  for (const f of found) if (f.entry) for (const a of aliases(f.entry.name)) names.push({ a, entry: f.entry });
  names.sort((x, y) => y.a.length - x.a.length);
  const text = data.technical_version;
  if (names.length) {
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b(${names.map((n) => esc(n.a)).join("|")})\\b`, "gi");
    let last = 0;
    for (const m of text.matchAll(re)) {
      out.append(text.slice(last, m.index));
      const hit = names.find((n) => norm(n.a) === norm(m[0]));
      const b = el("button", { className: "term", title: "See definition" }, m[0]);
      b.addEventListener("click", () => showTerm(hit.entry));
      out.append(b);
      last = m.index + m[0].length;
    }
    out.append(text.slice(last));
  } else {
    out.textContent = text;
  }

  // Term chips + unlocks.
  const chips = $("terms");
  chips.replaceChildren();
  const newly = [];
  for (const f of found) {
    if (f.entry) {
      const isNew = !state.unlocked.includes(f.entry.id);
      if (isNew) { state.unlocked.push(f.entry.id); newly.push(f.entry.name); }
      const b = el("button", { className: "chip" + (isNew ? " new" : ""), title: f.why }, f.entry.name);
      b.addEventListener("click", () => showTerm(f.entry));
      chips.append(b);
    } else {
      chips.append(el("span", { className: "chip outside", title: f.why + " (not in the dictionary yet)" }, f.term));
    }
  }

  $("note").textContent = data.note || "";
  $("note").classList.toggle("hidden", !data.note);
  $("result").classList.remove("hidden");

  bumpStreak();
  saveState();
  renderStats();
  renderVocab();
  if (newly.length) toast(`✨ Unlocked: ${newly.join(", ")}`);
}

async function translate() {
  const text = $("input").value.trim();
  const btn = $("translate");
  $("error").classList.add("hidden");
  if (!text) { $("input").focus(); return; }

  btn.disabled = true;
  btn.firstChild.textContent = "Translating… ";
  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    renderResult(data);
  } catch (err) {
    $("error").textContent = err.message === "Failed to fetch"
      ? "Couldn't reach the translation service. Check your connection and try again."
      : err.message;
    $("error").classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.firstChild.textContent = "Translate ";
  }
}

// ---------- Init ----------
function initUI() {
  const input = $("input");
  const counter = () => { $("counter").textContent = `${input.value.length} / 1000`; };
  input.addEventListener("input", counter);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); translate(); }
  });
  $("translate").addEventListener("click", translate);

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  $("translate").querySelector("kbd").textContent = isMac ? "⌘↵" : "Ctrl+↵";

  for (const ex of EXAMPLES) {
    const b = el("button", { className: "chip example" }, ex);
    b.addEventListener("click", () => { input.value = ex; counter(); input.focus(); });
    $("examples").append(b);
  }

  $("copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("output").textContent);
      toast("Copied to clipboard");
    } catch {
      toast("Couldn't copy — select the text instead");
    }
  });
}

async function init() {
  initUI();
  try {
    const res = await fetch("dict.md");
    if (!res.ok) throw new Error(res.status);
    terms = parseDict(await res.text());
    for (const t of terms) for (const a of aliases(t.name)) if (!lookup.has(norm(a))) lookup.set(norm(a), t);
  } catch {
    $("error").textContent = "Couldn't load the dictionary.";
    $("error").classList.remove("hidden");
  }
  renderStats();
  renderVocab();
  renderTermOfTheDay();
}

init();
