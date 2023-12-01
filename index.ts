import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

async function handler(req: Request): Promise<Response> {
  console.info(req.headers);
  const url = new URL(req.url);
  const q = new URLSearchParams(url.search);
  const u = q.get("url");

  if (!u) {
    return new Response("need url=?", {
      headers: { "content-type": "text/plain", "access-control-allow-origin": "*" },
    });
  }

  const resp = await fetch(u, {
    headers: req.headers,
    method: req.method,
    body: req.body,
  });
  let headers = new Headers(resp.headers);
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-credentials", "true");
  return new Response(resp.body, {
    status: resp.status,
    headers
  });

}

serve(handler);
