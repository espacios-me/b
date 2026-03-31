# BotSpace Dashboard

BotSpace Dashboard is a React + TypeScript analytics app for WhatsApp conversations, with optional Gemini-powered AI insights.

## App structure

- `client/` — frontend app (React + TypeScript + Tailwind)
- `server/` — Express static host for production build output
- `worker.js` — Cloudflare Worker route wrapper
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

## Build and run production

```bash
pnpm build
pnpm start
```

## Cloudflare route behavior

The Worker is configured for canonical route `/bot`:

- Serves `/bot` and `/bot/` with `index.html` (primary paths)
- Serves `/bot/assets/*` and `/bot/*` static paths by stripping `/bot`
- Redirects legacy `/botspace` and `/botspace/*` to canonical `/bot` routes
- Returns `404` for paths outside `/bot`

Expected URL:

- `https://espacios.me/bot`

## Security note

For production, move API keys to environment variables and proxy sensitive requests server-side.
