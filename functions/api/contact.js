import { EmailMessage } from "cloudflare:email";

const TO = "Houtxsurvey@outlook.com";
const FROM = "noreply@nicksalazar.net";

function bad(status, msg) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return bad(400, "Could not read the form.");
  }
  const brief = String(body.brief || "").trim();
  const reply = String(body.reply_to || "").trim();
  const name = String(body.name || "").trim();
  if (brief.length < 20) return bad(400, "Add more detail before sending.");
  if (brief.length > 20000) return bad(400, "Brief is too long.");
  if (!env.EMAIL) return bad(503, "Mail is not wired on this host yet.");

  const subject = "Assignment brief — nicksalazar.net";
  const fromLine = name ? name.replace(/[\r\n]/g, " ") : "Website visitor";
  const replyLine = reply ? reply.replace(/[\r\n]/g, " ") : "";
  const raw = [
    "From: Nick Salazar website <" + FROM + ">",
    "To: " + TO,
    replyLine ? "Reply-To: " + replyLine : "",
    "Subject: " + subject,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "",
    "From: " + fromLine,
    replyLine ? "Reply-to: " + replyLine : "",
    "",
    brief,
  ].filter(Boolean).join("\r\n");

  try {
    await env.EMAIL.send(new EmailMessage(FROM, TO, raw));
  } catch (err) {
    const msg = String(err && err.message ? err.message : err);
    if (/verif/i.test(msg) || /destination/i.test(msg)) {
      return bad(503, "Nick still needs to confirm the destination mailbox. The brief was not sent.");
    }
    return bad(502, "Mail provider rejected the send.");
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
