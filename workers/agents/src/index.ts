export interface Env { 
  AGENT_QUEUE: DurableObjectNamespace; 
  CLOUDCURIO_DB: D1Database; 
  CLOUDCURIO_BUCKET: R2Bucket; 
  OPENROUTER_API_KEY?: string;
}

async function openrouterChat(apiKey: string, messages: Array<{role:'system'|'user'|'assistant', content:string}>, model = "openai/gpt-4o-mini") {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages })
  });
  if (!r.ok) throw new Error(`OpenRouter ${r.status}`);
  const j = await r.json();
  return j.choices?.[0]?.message?.content ?? "";
}

function sse(data: string) {
  return `data: ${data.replace(/\n/g, "\\n")}\n\n`;
}

export default {
  async fetch(req: Request, env: Env) {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
    }
    const url = new URL(req.url);
    if (url.pathname === "/enqueue" && req.method === "POST") {
      const id = env.AGENT_QUEUE.idFromName("global"); const stub = env.AGENT_QUEUE.get(id);
      const r = await stub.fetch(new Request("https://do/internal/enqueue", { method: "POST", body: await req.text(), headers: req.headers }));
      return new Response(await r.text(), { status: r.status, headers: { "content-type":"application/json", "Access-Control-Allow-Origin": "*" } });
    }
    if (url.pathname === "/process" && req.method === "POST") {
      const id = env.AGENT_QUEUE.idFromName("global"); const stub = env.AGENT_QUEUE.get(id);
      const r = await stub.fetch(new Request("https://do/internal/process", { method: "POST" }));
      return new Response(await r.text(), { status: r.status, headers: { "content-type":"application/json", "Access-Control-Allow-Origin": "*" } });
    }
    if (url.pathname === "/status") {
      const id = env.AGENT_QUEUE.idFromName("global"); const stub = env.AGENT_QUEUE.get(id);
      const r = await stub.fetch(new Request("https://do/internal/status"));
      return new Response(await r.text(), { status: r.status, headers: { "content-type":"application/json", "Access-Control-Allow-Origin": "*" } });
    }
    // WebSocket live logs
    if (url.pathname === "/ws" && req.headers.get("upgrade") === "websocket") {
      const id = env.AGENT_QUEUE.idFromName("global"); const stub = env.AGENT_QUEUE.get(id);
      return stub.fetch(new Request("https://do/internal/ws", { headers: req.headers }));
    }
    return new Response("not found", { status: 404, headers: { "Access-Control-Allow-Origin": "*" } });
  }
}

type Job = { id: string; job: any; status: "queued"|"running"|"done"|"error"; created: number; logs: string[]; artifactKey?: string };

export class AgentQueue implements DurableObject {
  state: DurableObjectState; env: Env; sockets: Set<WebSocket>;
  constructor(state: DurableObjectState, env: Env){ this.state = state; this.env = env; this.sockets = new Set(); }
  private broadcast(line: string) { for (const ws of this.sockets) { try { ws.send(line); } catch {} } }
  async fetch(req: Request) {
    const url = new URL(req.url);
    // WS upgrade for live logs
    if (url.pathname.endsWith("/ws") && req.headers.get("upgrade") === "websocket") {
      const [client, server] = Object.values(new WebSocketPair());
      server.accept();
      this.sockets.add(server);
      server.addEventListener("close", () => this.sockets.delete(server));
      // On connect, send a snapshot of recent jobs
      const list = await this.state.storage.list({ reverse: true, limit: 10 });
      const snapshot = JSON.stringify({ type: "snapshot", jobs: [...list.values()] });
      server.send(snapshot);
      return new Response(null, { status: 101, webSocket: client });
    }

    if (url.pathname.endsWith("/enqueue") && req.method === "POST") {
      const body = await req.json(); const id = crypto.randomUUID();
      const job: Job = { id, job: body, status: "queued", created: Date.now(), logs: [] };
      await this.state.storage.put(id, job);
      this.broadcast(JSON.stringify({ type: "enqueued", id }));
      return new Response(JSON.stringify({ ok: true, id }), { headers: { "content-type": "application/json" } });
    }

    if (url.pathname.endsWith("/process") && req.method === "POST") {
      const list = await this.state.storage.list<Job>({});
      for (const [id, job] of list) {
        if (job.status === "queued") {
          job.status = "running";
          job.logs.push("starting execution");
          this.broadcast(JSON.stringify({ type: "update", id, status: job.status, logs: ["starting execution"] }));

          try {
            const sys = "You are a helpful research/automation agent for cloudcurio.cc.";
            const user = typeof job.job === "string" ? job.job : JSON.stringify(job.job);
            const content = await openrouterChat((this.env.OPENROUTER_API_KEY||""), [
              { role: "system", content: sys }, { role: "user", content: user }
            ]);
            job.logs.push("llm completed");
            this.broadcast(JSON.stringify({ type: "update", id, logs: ["llm completed"] }));

            // Save artifact to R2
            const key = `agent-artifacts/${id}.txt`;
            await this.env.CLOUDCURIO_BUCKET.put(key, content, { httpMetadata: { contentType: "text/plain; charset=utf-8" } });
            job.artifactKey = key;
            job.logs.push(`artifact saved: ${key}`);
            job.status = "done";
            await this.state.storage.put(id, job);
            this.broadcast(JSON.stringify({ type: "done", id, artifactKey: key }));
          } catch (e: any) {
            job.logs.push(`error: ${e?.message||String(e)}`);
            job.status = "error";
            await this.state.storage.put(id, job);
            this.broadcast(JSON.stringify({ type: "error", id, message: e?.message||String(e) }));
          }
        }
      }
      return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
    }

    if (url.pathname.endsWith("/status")) {
      const list = await this.state.storage.list({ reverse: true, limit: 20 });
      return new Response(JSON.stringify({ ok: true, jobs: [...list.values()] }), { headers: { "content-type": "application/json" } });
    }

    return new Response("bad", { status: 400 });
  }
}
