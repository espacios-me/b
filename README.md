# BotSpace Dashboard

BotSpace Dashboard is a React + TypeScript analytics app for WhatsApp conversations, with optional Gemini-powered AI insights.

## App structure

- `client/` — frontend app (React + TypeScript + Tailwind)
- `server/` — Express app for API proxy routes and static hosting in production
- `worker.js` — Cloudflare Worker route wrapper
- `package.json` — scripts for dev/build/check/format

## Environment variables

Create a `.env` file in the project root with:

```bash
BOTSPACE_API_KEY=your_botspace_api_key
BOTSPACE_CHANNEL_ID=your_botspace_channel_id
GEMINI_API_KEY=your_gemini_api_key
```

These are required by the backend proxy routes:

- `GET /api/botspace/conversations`
- `GET /api/botspace/conversations/:conversationId`
- `POST /api/gemini/generate`

## Run locally

```bash
pnpm install
pnpm build
pnpm start
```

This runs the Express server, which serves the frontend and proxies BotSpace/Gemini requests using server-side environment variables.

## Development note

`pnpm dev` runs only the Vite frontend dev server and does not include the Express API proxy.
Use `pnpm build && pnpm start` when testing BotSpace/Gemini integrations end-to-end.

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
