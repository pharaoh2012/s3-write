import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { S3, S3Bucket } from "https://deno.land/x/s3@0.5.0/mod.ts";

async function handler(req: Request): Promise<Response> {

    let v = await get_all_tasks()
    let txtv = JSON.stringify(v);
    await s3upload("tvbox/tasks.json", txtv)
    return new Response(txtv);

}

async function s3upload(key, body) {
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

async function get_all_tasks() {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${Deno.env.get("vika_api")}`);
    //myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
    //myHeaders.append("Accept", "*/*");
    myHeaders.append("Host", "api.vika.cn");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let res = await fetch(Deno.env.get("vika_url"), requestOptions)
    let ret = await res.json();
    let channels = ret.data.records.map(d => {
        let name = d.fields.name + "_" + d.fields.清晰度
        let urls = [d.fields.urls];
        return { name, urls }
    })

    return {
        "t":new Date(),
        "lives": [
            {
                "group": "电视",
                channels
            }
        ]
    }

}
