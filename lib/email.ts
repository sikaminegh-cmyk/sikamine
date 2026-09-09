import "server-only";
import nodemailer from "nodemailer";

function getTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends via the Sikamine-owned SMTP account. If SMTP env vars are not yet
 * configured (e.g. local development before the client provisions a
 * mailbox), this logs instead of throwing so form submissions still persist
 * to the database.
 */
export async function sendEmail({ to, subject, html }: SendEmailInput) {
  const transport = getTransport();
  const fromName = process.env.SMTP_FROM_NAME ?? "Sikamine Gold Trading Ltd";
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER;

  if (!transport || !fromEmail) {
    console.warn(`[email] SMTP not configured — skipped email to ${to}: ${subject}`);
    return { sent: false as const };
  }

  await transport.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
  });
  return { sent: true as const };
}

export function acknowledgementEmail(name: string, kind: "enquiry" | "partnership enquiry") {
  return `
    <p>Dear ${escapeHtml(name)},</p>
    <p>Thank you for contacting Sikamine Gold Trading Ltd. We have received your ${kind} and a member of our team will respond shortly.</p>
    <p>Regards,<br/>Sikamine Gold Trading Ltd</p>
  `;
}

export function internalNotificationEmail(title: string, fields: Record<string, string | null | undefined>) {
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:600;">${escapeHtml(k)}</td><td>${escapeHtml(String(v))}</td></tr>`)
    .join("");
  return `<h3>${escapeHtml(title)}</h3><table>${rows}</table>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
