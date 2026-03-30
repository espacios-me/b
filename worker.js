/**
 * Cloudflare Worker for BotSpace Dashboard
 * Routes requests to the static dashboard
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Route /bot to the dashboard
    if (url.pathname === '/bot' || url.pathname === '/bot/') {
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
    if (url.pathname.startsWith('/bot/assets/') || 
        url.pathname.startsWith('/bot/')) {
      const assetPath = url.pathname.replace('/bot', '');
      const assetUrl = new URL(assetPath, url);
      
      return fetch(new Request(assetUrl, request));
    }

    return new Response('Not Found', { status: 404 });
  },
};
