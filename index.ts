import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { S3, S3Bucket } from "https://deno.land/x/s3@0.5.0/mod.ts";

async function handler(req: Request): Promise<Response> {
  console.info(req.headers);
  // const key = new URL(req.key);
  // // const q = new URLSearchParams(url.search);
  // // const u = q.get("url");
  

  // if (!key) {
  //   return new Response("need url=?", {
  //     headers: { "content-type": "text/plain", "access-control-allow-origin": "*" },
  //   });
  // }
  let v = {
    "msg":"msg_中文",
    "date":new Date()
  }
  await s3upload("tvbox/test.json",JSON.stringify(v))
  

  return new Response("ok");

}

async function s3upload(key,body) {
// Create a S3 instance.
const s3 = new S3({
  accessKeyID: Deno.env.get("AWS_ACCESS_KEY_ID")!,
  secretKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
  region: "cn-east-1",
  endpointURL: Deno.env.get("S3_ENDPOINT_URL"),
});
let bucket = s3.getBucket("tvbox-config");
  const encoder = new TextEncoder();
  
await bucket.putObject(key, encoder.encode(body), {
  contentType: "text/json",
});  
}

serve(handler);
