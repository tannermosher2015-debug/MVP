import { Resend } from "resend";
import { SITE } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Escape user-supplied text before embedding it in the HTML email. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
  company?: string; // honeypot — must stay empty
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success and send nothing.
  if (body.company && body.company.trim()) {
    return Response.json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const interest = (body.interest ?? "").trim() || "General inquiry";
  const message = (body.message ?? "").trim();

  if (!name || !email || !EMAIL_RE.test(email) || !message) {
    return Response.json(
      { ok: false, error: "Please provide your name, a valid email, and a message." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set — cannot send lead email.");
    return Response.json(
      {
        ok: false,
        error: "Email service is not configured.",
        // TEMP diagnostic (names only, never values) — remove after debugging.
        _debug: {
          vercelEnv: process.env.VERCEL_ENV ?? null,
          resendVarNames: Object.keys(process.env).filter((k) => /resend/i.test(k)),
        },
      },
      { status: 503 },
    );
  }

  // Inquiries go to Dayna, sent FROM the Resend-verified realestateonmolokai.com
  // domain — the only sender able to deliver to external inboxes like iCloud.
  // (Hardcoded rather than env-driven so a stale Vercel var can't misroute leads;
  // requires the realestateonmolokai.com domain to stay verified in Resend.)
  const to = SITE.email; // dayna.harris@icloud.com
  const from = `${SITE.name} <inquiries@realestateonmolokai.com>`;

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Interested in", interest],
  ];

  const html = `
    <div style="font-family:system-ui,'Segoe UI',Arial,sans-serif;color:#211814;line-height:1.6;max-width:560px">
      <h2 style="font-family:Georgia,serif;color:#6f5125;margin:0 0 14px">New inquiry — ${SITE.name}</h2>
      <table style="border-collapse:collapse;font-size:15px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#8a7c6d;white-space:nowrap">${k}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:18px 0 4px;color:#8a7c6d;font-size:13px">Message</p>
      <p style="white-space:pre-wrap;margin:0;font-size:15px">${esc(message)}</p>
      <hr style="border:none;border-top:1px solid #e4d9c6;margin:22px 0"/>
      <p style="font-size:12px;color:#8a7c6d">Sent from the ${SITE.name} website. Reply directly to reach ${esc(name)} at ${esc(email)}.</p>
    </div>`;

  const text = `New inquiry — ${SITE.name}

Name: ${name}
Email: ${email}
Phone: ${phone || "—"}
Interested in: ${interest}

Message:
${message}
`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New website inquiry — ${name} (${interest})`,
      html,
      text,
    });
    if (error) {
      console.error("[contact] Resend error:", error);
      return Response.json(
        { ok: false, error: "Could not send your message." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return Response.json(
      { ok: false, error: "Could not send your message." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
