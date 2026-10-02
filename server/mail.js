import nodemailer from "nodemailer";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { pool, transaction } from "./db.js";

export const siteUrl = (process.env.APP_URL || "https://lenk.tr").replace(
  /\/$/,
  "",
);
const escape = (value) =>
  String(value || "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
export function renderMail({ title, intro, button, url, details = "" }) {
  const html = `<!doctype html><html lang="tr"><body style="margin:0;background:#f4f6fa;font-family:Arial,sans-serif;color:#172036"><table role="presentation" width="100%"><tr><td style="padding:32px 16px"><table role="presentation" width="100%" style="max-width:560px;margin:auto;background:white;border-radius:20px"><tr><td style="padding:32px"><a href="${siteUrl}" style="color:#2563eb;font-size:28px;font-weight:bold;text-decoration:none">lenk.tr</a><h1 style="font-size:24px;margin-top:32px">${escape(title)}</h1><p style="font-size:16px;line-height:1.7">${escape(intro)}</p>${details ? `<p style="line-height:1.7;white-space:pre-wrap">${escape(details)}</p>` : ""}${url ? `<p style="margin:28px 0"><a href="${escape(url)}" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:bold">${escape(button)}</a></p><p style="font-size:12px;color:#64748b;word-break:break-all">Bağlantı açılmıyorsa tarayıcınıza yapıştırın:<br>${escape(url)}</p>` : ""}<p style="font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:20px">Bu mesaj LENK.TR hesabınız veya talebiniz hakkında gönderildi. Şifrenizi e-postayla istemeyiz.</p></td></tr></table></td></tr></table></body></html>`;
  return {
    html,
    text: `${title}\n\n${intro}\n\n${details}\n\n${url ? `${button}: ${url}\n\n` : ""}LENK.TR — ${siteUrl}`,
  };
}
export async function enqueueMail(
  connection,
  {
    userId = null,
    to,
    kind,
    subject,
    content,
    replyTo = null,
    expiresAt = null,
  },
) {
  const id = randomUUID(),
    message = renderMail(content);
  await connection.execute(
    "INSERT INTO mail_outbox(id,user_id,recipient,kind,subject,html_body,text_body,reply_to,expires_at) VALUES(?,?,?,?,?,?,?,?,?)",
    [
      id,
      userId,
      to,
      kind,
      subject,
      message.html,
      message.text,
      replyTo,
      expiresAt,
    ],
  );
  return id;
}
export function createMailTransport() {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD ||
    !process.env.MAIL_FROM_ADDRESS
  )
    return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    requireTLS: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    tls: {
      servername: process.env.SMTP_SERVERNAME || process.env.SMTP_HOST,
      ...(process.env.SMTP_CA_FILE
        ? { ca: readFileSync(process.env.SMTP_CA_FILE) }
        : {}),
      rejectUnauthorized: true,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
}
export async function deliverMailBatch(transport, batchSize = 10) {
  if (!transport) return 0;
  let delivered = 0;
  for (let index = 0; index < batchSize; index++) {
    const mail = await transaction(async (connection) => {
      await connection.execute(
        "UPDATE mail_outbox SET status='failed',html_body=NULL,text_body=NULL,last_error='expired' WHERE status IN ('pending','sending') AND expires_at IS NOT NULL AND expires_at<UTC_TIMESTAMP()",
      );
      await connection.execute(
        "UPDATE mail_outbox SET status=IF(attempts>=5,'failed','pending'),html_body=IF(attempts>=5,NULL,html_body),text_body=IF(attempts>=5,NULL,text_body) WHERE status='sending' AND locked_at<DATE_SUB(UTC_TIMESTAMP(),INTERVAL 2 MINUTE)",
      );
      const [rows] = await connection.execute(
        "SELECT * FROM mail_outbox WHERE status='pending' AND next_attempt_at<=UTC_TIMESTAMP() ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED",
      );
      if (!rows[0]) return null;
      await connection.execute(
        "UPDATE mail_outbox SET status='sending',attempts=attempts+1,locked_at=UTC_TIMESTAMP() WHERE id=?",
        [rows[0].id],
      );
      return rows[0];
    });
    if (!mail) break;
    try {
      const result = await transport.sendMail({
        from: {
          name: process.env.MAIL_FROM_NAME || "LENK.TR",
          address: process.env.MAIL_FROM_ADDRESS,
        },
        to: mail.recipient,
        subject: mail.subject,
        html: mail.html_body,
        text: mail.text_body,
        ...(mail.reply_to ? { replyTo: mail.reply_to } : {}),
        messageId: `<${mail.id}@${process.env.MAIL_FROM_ADDRESS.split("@")[1]}>`,
      });
      if (result.rejected?.length)
        throw Object.assign(new Error("Recipient rejected"), {
          code: "RECIPIENT_REJECTED",
        });
      await pool.execute(
        "UPDATE mail_outbox SET status='sent',sent_at=UTC_TIMESTAMP(),html_body=NULL,text_body=NULL,last_error=NULL WHERE id=?",
        [mail.id],
      );
      delivered++;
    } catch (error) {
      const attempts = mail.attempts + 1;
      await pool.execute(
        "UPDATE mail_outbox SET status=?,next_attempt_at=DATE_ADD(UTC_TIMESTAMP(),INTERVAL ? SECOND),last_error=?,html_body=IF(? >=5,NULL,html_body),text_body=IF(? >=5,NULL,text_body) WHERE id=?",
        [
          attempts >= 5 ? "failed" : "pending",
          Math.min(3600, 30 * 2 ** attempts),
          String(error.code || "SMTP_ERROR").slice(0, 100),
          attempts,
          attempts,
          mail.id,
        ],
      );
    }
  }
  return delivered;
}
export function startMailWorker() {
  const transport = createMailTransport();
  if (!transport) {
    console.warn("SMTP is not configured; mail remains in the delivery queue.");
    return () => {};
  }
  let active = false;
  const tick = async () => {
    if (active) return;
    active = true;
    try {
      await deliverMailBatch(transport);
    } catch (error) {
      console.error("Mail worker:", error.code || "WORKER_ERROR");
    } finally {
      active = false;
    }
  };
  const timer = setInterval(tick, 15000);
  timer.unref();
  void tick();
  return () => {
    clearInterval(timer);
    transport.close();
  };
}
