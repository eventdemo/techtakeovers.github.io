# TechTakeovers API (Cloudflare Worker)

One endpoint: `POST /translate` with `{ "text": "..." }`.
It loads `system-prompt.md` + `dict.md` from the GitHub Pages site (cached ~10 min), calls the OpenAI Responses API and returns:

```json
{ "technical_version": "...", "terms_used": [{ "term": "...", "in_dictionary": true, "why": "..." }], "note": "" }
```

## Deploy

```sh
npm i -g wrangler
wrangler login
cd worker
wrangler secret put OPENAI_API_KEY   # paste your key when prompted
wrangler deploy
```

`wrangler deploy` prints the Worker URL: `https://api.techtakeovers-api.workers.dev`.
`WORKER_URL` at the top of `../app.js` must be `<that URL>/translate`.

## Settings (`wrangler.toml` → `[vars]`)

| Var | Purpose |
|---|---|
| `CONTENT_BASE_URL` | Where `system-prompt.md` and `dict.md` are published |
| `ALLOWED_ORIGINS` | Sites allowed to call the API (CORS) |
| `MODEL` | OpenAI model name |
| `REASONING_EFFORT` | Only for reasoning models; delete it for others |

Rate limit: 10 requests/minute per IP (`[[ratelimits]]`).

## Protect your key

- Set a monthly **budget limit** on the OpenAI project that owns the key.
- The origin check only stops other websites; scripts can still call the Worker directly. The rate limit and budget are the real guards. If you see abuse, add Cloudflare Turnstile.

## Local development

```sh
cp .dev.vars.example .dev.vars   # then put your real key in .dev.vars
wrangler dev                     # API on http://localhost:8787
```

Serve the frontend from the repo root with `python3 -m http.server 8000` and temporarily set `WORKER_URL` to `http://localhost:8787/translate`.
