// TechTakeovers API — Cloudflare Worker
// POST /translate { "text": "..." } -> { technical_version, terms_used, note }

const MAX_INPUT_CHARS = 1000;
const MAX_BODY_BYTES = 8 * 1024;
const PROMPT_CACHE_MS = 10 * 60 * 1000;

const OUTPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["technical_version", "terms_used", "note"],
  properties: {
    technical_version: { type: "string" },
    terms_used: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["term", "in_dictionary", "why"],
        properties: {
          term: { type: "string" },
          in_dictionary: { type: "boolean" },
          why: { type: "string" },
        },
      },
    },
    note: { type: "string" },
  },
};

// Module-level cache: survives between requests on the same Worker instance.
let cachedInstructions = null;
let cachedAt = 0;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = allowedOrigins(env);
    const originOk = allowed.includes(origin);
    const cors = originOk
      ? {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        }
      : { Vary: "Origin" };

    const url = new URL(request.url);
    if (url.pathname !== "/translate") return json({ error: "Not found" }, 404, cors);
    if (!originOk) return json({ error: "Origin not allowed" }, 403, cors);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, cors);

    // Rate limit per client IP (binding is optional so local dev works without it).
    if (env.RATE_LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) return json({ error: "Too many requests. Try again in a minute." }, 429, cors);
    }

    // Validate input.
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ error: "Request too large" }, 413, cors);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ error: "Invalid JSON" }, 400, cors);
    }
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!text) return json({ error: "Please enter some text." }, 400, cors);
    if (text.length > MAX_INPUT_CHARS) {
      return json({ error: `Text must be at most ${MAX_INPUT_CHARS} characters.` }, 400, cors);
    }

    if (!env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY secret is not set");
      return json({ error: "Server is not configured." }, 500, cors);
    }

    try {
      const instructions = await getInstructions(env);
      const result = await callOpenAI(env, instructions, text);
      return json(result, 200, cors);
    } catch (err) {
      console.error(err);
      return json({ error: "Translation failed. Please try again." }, 502, cors);
    }
  },
};

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function getInstructions(env) {
  if (cachedInstructions && Date.now() - cachedAt < PROMPT_CACHE_MS) return cachedInstructions;

  const base = env.CONTENT_BASE_URL.endsWith("/") ? env.CONTENT_BASE_URL : env.CONTENT_BASE_URL + "/";
  const [prompt, dict] = await Promise.all([
    fetchText(base + "system-prompt.md"),
    fetchText(base + "dict.md"),
  ]);
  if (!prompt.includes("{{DICTIONARY}}")) throw new Error("system-prompt.md is missing {{DICTIONARY}}");

  cachedInstructions = prompt.replace("{{DICTIONARY}}", dict.trim());
  cachedAt = Date.now();
  return cachedInstructions;
}

async function fetchText(url) {
  const res = await fetch(url, { cf: { cacheTtl: 600, cacheEverything: true } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function callOpenAI(env, instructions, text) {
  const payload = {
    model: env.MODEL,
    instructions,
    input: text,
    store: false,
    max_output_tokens: 2000,
    text: {
      format: { type: "json_schema", name: "translation", strict: true, schema: OUTPUT_SCHEMA },
    },
  };
  if (env.REASONING_EFFORT) payload.reasoning = { effort: env.REASONING_EFFORT };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const outputText = (data.output || [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content || [])
    .filter((c) => c.type === "output_text")
    .map((c) => c.text)
    .join("");
  if (!outputText) throw new Error(`No output_text in response (status: ${data.status})`);

  const parsed = JSON.parse(outputText);
  return {
    technical_version: String(parsed.technical_version || ""),
    terms_used: Array.isArray(parsed.terms_used)
      ? parsed.terms_used.map((t) => ({
          term: String(t.term || ""),
          in_dictionary: Boolean(t.in_dictionary),
          why: String(t.why || ""),
        }))
      : [],
    note: String(parsed.note || ""),
  };
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}
