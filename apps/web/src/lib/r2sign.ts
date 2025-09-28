// @ts-expect-error
import { env as cf } from 'cloudflare:env';
function hex(a:Uint8Array){return [...a].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function hmacRaw(key:Uint8Array|string, data:string){
  const enc = new TextEncoder(); const raw = typeof key==='string'?enc.encode(key):key;
  const k = await crypto.subtle.importKey('raw', raw, {name:'HMAC', hash:'SHA-256'}, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode(data)); return new Uint8Array(sig);
}
async function signingKey(secret:string, date:string, region:string, service:string){
  const kDate = await hmacRaw('AWS4'+secret, date); const kRegion = await hmacRaw(kDate, region);
  const kService = await hmacRaw(kRegion, service); return hmacRaw(kService, 'aws4_request');
}
export async function presignR2(method:'PUT'|'GET', key:string, expires=300){
  const ACCOUNT=(cf?.R2_ACCOUNT_ID??process.env.R2_ACCOUNT_ID) as string;
  const ACCESS=(cf?.R2_ACCESS_KEY_ID??process.env.R2_ACCESS_KEY_ID) as string;
  const SECRET=(cf?.R2_SECRET_ACCESS_KEY??process.env.R2_SECRET_ACCESS_KEY) as string;
  const BUCKET=(cf?.R2_BUCKET_NAME??process.env.R2_BUCKET_NAME??'cloudcurio-bucket') as string;
  const region='auto', service='s3'; const host=`${BUCKET}.${ACCOUNT}.r2.cloudflarestorage.com`;
  const now=new Date(); const amzdate=now.toISOString().replace(/[:-]|\.\d{3}/g,''); const date=amzdate.slice(0,8);
  const scope=`${date}/${region}/${service}/aws4_request`;
  const params=new URLSearchParams(); params.set('X-Amz-Algorithm','AWS4-HMAC-SHA256'); params.set('X-Amz-Credential',`${ACCESS}/${scope}`);
  params.set('X-Amz-Date',amzdate); params.set('X-Amz-Expires',String(expires)); params.set('X-Amz-SignedHeaders','host');
  const q=params.toString(); const canonReq=[method,`/${key}`,q,`host:${host}\n`,'host','UNSIGNED-PAYLOAD'].join('\n');
  const hash=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonReq)).then(b=>hex(new Uint8Array(b)));
  const sts=['AWS4-HMAC-SHA256', amzdate, scope, hash].join('\n'); const sk=await signingKey(SECRET, date, region, service);
  const sig=hex(await hmacRaw(sk, sts)); return `https://${host}/${encodeURI(key)}?${q}&X-Amz-Signature=${sig}`;
}
