/**
 * Cloudflare Worker for BotSpace Dashboard
 * Production model: Workers-first (Worker + static assets via Wrangler assets binding)
 */

function rewriteToAssetRequest(request, path) {
  const url = new URL(request.url);
  url.pathname = path;
  return new Request(url.toString(), request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Redirect legacy /bot path to /botspace
    if (url.pathname === '/bot' || url.pathname === '/bot/') {
      return Response.redirect(`${url.origin}/botspace`, 301);
    }

    // Only own /botspace paths in this Worker
    if (!url.pathname.startsWith('/botspace')) {
      return new Response('Not Found', { status: 404 });
    }

    // Serve the SPA shell for /botspace
    if (url.pathname === '/botspace' || url.pathname === '/botspace/') {
      return env.ASSETS.fetch(rewriteToAssetRequest(request, '/index.html'));
    }

    // Strip /botspace prefix and resolve assets from dist/public
    const assetPath = url.pathname.replace(/^\/botspace/, '') || '/index.html';
    return env.ASSETS.fetch(rewriteToAssetRequest(request, assetPath));
  },
};
