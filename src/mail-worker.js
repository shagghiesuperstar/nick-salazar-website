import { EmailMessage } from "cloudflare:email";

const TO = "houtxsurvey@outlook.com";
const FROM = "noreply@nicksalazar.net";
const ALLOW = new Set([
  "https://nicksalazar.net",
  "https://www.nicksalazar.net",
  "https://nicksalazar.pages.dev",
]);

function cors(origin) {
  const allow = ALLOW.has(origin) ? origin : "https://nicksalazar.net";
  return {
    "access-control-allow-origin": allow,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  };
}

function json(status, obj, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...cors(origin) },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }
    if (request.method !== "POST") {
      return json(405, { ok: false, error: "POST only" }, origin);
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return json(400, { ok: false, error: "Could not read the form." }, origin);
    }
    const brief = String(body.brief || "").trim();
    const reply = String(body.reply_to || "").trim();
    const name = String(body.name || "").trim();
    if (brief.length < 20) return json(400, { ok: false, error: "Add more detail before sending." }, origin);
    if (brief.length > 20000) return json(400, { ok: false, error: "Brief is too long." }, origin);
    if (!env.EMAIL) return json(503, { ok: false, error: "Mail is not wired on this host yet." }, origin);

    const fromLine = name ? name.replace(/[\r\n]/g, " ") : "Website visitor";
    const replyLine = reply ? reply.replace(/[\r\n]/g, " ") : "";
    const raw = [
      "From: Nick Salazar website <" + FROM + ">",
      "To: " + TO,
      replyLine ? "Reply-To: " + replyLine : null,
      "Subject: Assignment brief — nicksalazar.net",
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "",
      "From: " + fromLine,
      replyLine ? "Reply-to: " + replyLine : null,
      "",
      brief,
    ].filter((x) => x !== null).join("\r\n");

    try {
      await env.EMAIL.send(new EmailMessage(FROM, TO, raw));
    } catch (err) {
      const msg = String(err && err.message ? err.message : err);
      return json(502, { ok: false, error: "Mail provider rejected the send.", detail: msg.slice(0, 160) }, origin);
    }
    return json(200, { ok: true }, origin);
  },
};
