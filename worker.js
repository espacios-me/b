const DEFAULT_BOT_ID = "botspace_5ed2f2b9-d7e2-444f-9dee-3411273c5848";
const BOTSPACE_API_BASE = "https://public-api.bot.space";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function fetchBotspace(path) {
  const target = `${BOTSPACE_API_BASE}${path}`;
  const response = await fetch(target, {
    headers: { accept: "application/json,text/plain,*/*" },
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    url: target,
    data,
  };
}

async function callGemini(prompt) {
  if (typeof GEMINI_API_KEY === "undefined" || !GEMINI_API_KEY) {
    return {
      ok: false,
      status: 500,
      error: "GEMINI_API_KEY is not configured on this Worker yet.",
    };
  }

  const target = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  const response = await fetch(target, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  let text = "";
  try {
    text = data.candidates[0].content.parts
      .map((part) => part.text || "")
      .join("\n")
      .trim();
  } catch {
    text = "";
  }

  return {
    ok: response.ok,
    status: response.status,
    text,
    data,
  };
}

function buildPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>BotSpace AI Dashboard</title>
  <style>
    :root {
      --bg: #08101f;
      --panel: #121a33;
      --panel-2: #0f1730;
      --line: #263252;
      --text: #e8eeff;
      --muted: #96a9d7;
      --accent: #8dd6ff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: linear-gradient(180deg, #08101f 0%, #0b1020 100%);
      color: var(--text);
      font: 14px/1.45 Inter, system-ui, sans-serif;
    }
    main {
      max-width: 1220px;
      margin: 0 auto;
      padding: 24px;
    }
    .hero, .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 18px;
      margin: 14px 0;
    }
    .hero h1, .panel h2 {
      margin: 0 0 10px;
    }
    .sub {
      color: var(--muted);
      margin: 0;
    }
    .grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 14px;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 10px;
      margin-bottom: 12px;
    }
    input, textarea, button {
      width: 100%;
      background: var(--panel-2);
      color: var(--text);
      border: 1px solid #334268;
      border-radius: 12px;
      padding: 12px 14px;
      font: inherit;
    }
    textarea {
      min-height: 150px;
      resize: vertical;
    }
    button {
      cursor: pointer;
      font-weight: 700;
    }
    .chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin: 12px 0;
    }
    .chip {
      border-radius: 999px;
      border: 1px solid var(--line);
      background: var(--panel-2);
      color: var(--accent);
      padding: 8px 12px;
      cursor: pointer;
      user-select: none;
    }
    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      background: #0a1125;
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 14px;
      max-height: 64vh;
      overflow: auto;
    }
    @media (max-width: 920px) {
      .grid, .row {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <h1>BotSpace AI Dashboard</h1>
      <p class="sub">Frontend and backend on one Cloudflare Worker. BotSpace explorer on the left, Gemini assistant on the right. Gemini runs server-side only.</p>
    </section>

    <div class="grid">
      <section class="panel">
        <h2>BotSpace Explorer</h2>
        <div class="row">
          <input id="botId" value="${escapeHtml(DEFAULT_BOT_ID)}" placeholder="Bot ID" />
          <input id="path" value="/bots/{id}" placeholder="/bots/{id} or /bots/{id}/stats" />
          <button id="loadBtn">Load</button>
        </div>
        <div class="chips">
          <span class="chip" data-path="/bots/{id}">/bots/{id}</span>
          <span class="chip" data-path="/bot/{id}">/bot/{id}</span>
          <span class="chip" data-path="/v1/bots/{id}">/v1/bots/{id}</span>
          <span class="chip" data-path="/bots/{id}/stats">/bots/{id}/stats</span>
          <span class="chip" data-path="/v1/bots/{id}/stats">/v1/bots/{id}/stats</span>
        </div>
        <pre id="botOutput">Loading…</pre>
      </section>

      <section class="panel">
        <h2>Gemini Assistant</h2>
        <p class="sub" style="margin-bottom:12px">Use it to summarize responses, suggest next endpoints, or explain payloads.</p>
        <textarea id="prompt" placeholder="Summarize this bot response and suggest the next endpoint to try."></textarea>
        <div class="row" style="grid-template-columns:1fr auto; margin-top:12px;">
          <input id="context" placeholder="Optional context from the BotSpace response" />
          <button id="askBtn">Ask Gemini</button>
        </div>
        <pre id="aiOutput">Ready.</pre>
      </section>
    </div>
  </main>

  <script>
    const $ = (selector) => document.querySelector(selector);

    async function loadBotspace() {
      const botId = $("#botId").value.trim();
      const rawPath = $("#path").value.trim() || "/bots/{id}";
      const path = rawPath.replaceAll("{id}", botId);
      const response = await fetch(
        "/botspace/api?bot=" +
          encodeURIComponent(botId) +
          "&path=" +
          encodeURIComponent(path)
      );
      const data = await response.json();
      $("#botOutput").textContent = JSON.stringify(data, null, 2);
    }

    async function askGemini() {
      const prompt = $("#prompt").value.trim();
      const context = $("#context").value.trim();
      const combined = context ? prompt + "\\n\\nContext:\\n" + context : prompt;
      const response = await fetch("/botspace/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: combined }),
      });
      const data = await response.json();
      $("#aiOutput").textContent = JSON.stringify(data, null, 2);
    }

    document.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        $("#path").value = chip.dataset.path;
        loadBotspace();
      });
    });

    $("#loadBtn").addEventListener("click", loadBotspace);
    $("#askBtn").addEventListener("click", askGemini);
    loadBotspace();
  </script>
</body>
</html>`;
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...JSON_HEADERS,
        "access-control-allow-methods": "GET,POST,OPTIONS",
        "access-control-allow-headers": "Content-Type",
      },
    });
  }

  if (url.pathname === "/botspace/api") {
    const botId = url.searchParams.get("bot") || DEFAULT_BOT_ID;
    const rawPath = url.searchParams.get("path") || "/bots/{id}";
    const path = rawPath.replaceAll("{id}", botId);
    const result = await fetchBotspace(path);
    return new Response(JSON.stringify(result, null, 2), {
      status: result.ok ? 200 : result.status || 502,
      headers: JSON_HEADERS,
    });
  }

  if (url.pathname === "/botspace/ai" && request.method === "POST") {
    let body = {};
    try {
      body = await request.json();
    } catch {}
    const result = await callGemini(body.prompt || "");
    return new Response(JSON.stringify(result, null, 2), {
      status: result.ok ? 200 : result.status || 500,
      headers: JSON_HEADERS,
    });
  }

  if (url.pathname !== "/botspace") {
    return new Response("Not found", { status: 404 });
  }

  return new Response(buildPage(), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
