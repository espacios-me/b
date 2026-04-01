# BotSpace Dashboard

BotSpace Dashboard is a React + TypeScript analytics app for WhatsApp conversations, with optional Gemini-powered AI insights.

## Production deployment model (source of truth)

This repository uses a **Workers-first** model.

- `worker.js` is the production entrypoint for all `/botspace` traffic.
- `wrangler.toml` deploys the Worker and binds static frontend files from `dist/public`.
- GitHub Actions (`.github/workflows/deploy-worker.yml`) deploys only the Worker and the static assets path expected by Wrangler.
- Cloudflare Pages is **not** used as the production source of truth for this project.

## App structure

- `client/` — frontend app (React + TypeScript + Tailwind)
- `server/` — Express static host for production build output (local/non-Cloudflare hosting)
- `worker.js` — Cloudflare Worker route wrapper for `/botspace`
- `wrangler.toml` — Cloudflare Worker deployment + static assets binding
- `package.json` — scripts for dev/build/check/format

## Run locally

```bash
pnpm install
pnpm dev
```

## Quality checks

```bash
pnpm check
```

## Build and run production locally

```bash
pnpm build
pnpm start
```

## Cloudflare route behavior

The Worker owns `/botspace`:

- Redirects legacy `/bot` and `/bot/` to `/botspace`
- Serves `/botspace` and `/botspace/` with `index.html`
- Serves `/botspace/assets/*` and `/botspace/*` by stripping `/botspace`
- Returns `404` for paths outside `/botspace`

Expected URL:

- `https://espacios.me/botspace`

## Security note

For production, move API keys to environment variables and proxy sensitive requests server-side.
