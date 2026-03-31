/**
 * Cloudflare Worker for BotSpace Dashboard
 * Routes requests to the static dashboard at /botspace
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Redirect legacy /bot path to /botspace
    if (url.pathname === '/bot' || url.pathname === '/bot/') {
      return Response.redirect(`${url.origin}/botspace`, 301);
    }

    // Route /botspace to the dashboard
    if (url.pathname === '/botspace' || url.pathname === '/botspace/') {
      return new Response(
        await fetch(new Request(new URL('/index.html', url), request)),
        {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        }
      );
    }

    // Serve static assets
    if (url.pathname.startsWith('/botspace/assets/') ||
        url.pathname.startsWith('/botspace/')) {
      const assetPath = url.pathname.replace('/botspace', '');
      const assetUrl = new URL(assetPath, url);

      return fetch(new Request(assetUrl, request));
    }

    return new Response('Not Found', { status: 404 });
  },
};
