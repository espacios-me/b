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

The Worker is configured for `/botspace`:

- Redirects legacy `/bot` and `/bot/` to `/botspace`
- Serves `/botspace` and `/botspace/` with `index.html`
- Serves `/botspace/assets/*` and `/botspace/*` static paths by stripping `/botspace`
- Returns `404` for paths outside `/botspace`

Expected URL:

- `https://espacios.me/botspace`

## Security note

For production, move API keys to environment variables and proxy sensitive requests server-side.
