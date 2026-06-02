export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const surl = url.searchParams.get('surl');
    const mode = url.searchParams.get('mode') || 'stream';
    const type = url.searchParams.get('type') || 'M3U8_AUTO_720';

    if (!surl) {
      return new Response(JSON.stringify({ error: "surl parameter missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    try {
      if (mode === 'stream') {
        return await handleStream(surl, type, request);
      } else if (mode === 'info') {
        return await handleInfo(surl, request);
      }

      return new Response("Invalid mode", { status: 400 });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }
  }
};

// Handle HLS Stream (m3u8 rewrite)
async function handleStream(surl, quality, request) {
  const teraboxUrl = `https://terabox.com/s/${surl}`;

  const response = await fetch(teraboxUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Referer": "https://terabox.com/"
    }
  });

  // Note: Real implementation needs proper extraction logic (cookie + API calls)
  // For production, better fork muxfox or saahiyo repo
  const m3u8ProxyUrl = `https://your-terabox-proxy.workers.dev/proxy?m3u8=...`; // placeholder

  return new Response(`#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=1280x720\n${m3u8ProxyUrl}`, {
    headers: {
      "Content-Type": "application/vnd.apple.mpegurl",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Range"
    }
  });
}

// Basic Info
async function handleInfo(surl) {
  return new Response(JSON.stringify({
    status: true,
    surl: surl,
    stream_url: `https://\( {WORKER_NAME}.workers.dev/?mode=stream&surl= \){surl}`
  }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}
