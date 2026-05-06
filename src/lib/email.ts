import "server-only";
import { Resend } from "resend";

const ADMIN_TO = "mail@purpleheartpros.com";
const FROM = process.env.RESEND_FROM || "Domustack <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://domustack.com";

let cached: Resend | null = null;
function client() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

export type LeadNotification = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  project_type: string;
  description: string;
  budget_range: string;
  inspiration_images: string[];
};

export async function sendLeadNotificationEmail(lead: LeadNotification) {
  const resend = client();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not configured; skipping notification");
    return { skipped: true };
  }

  const subject = `New lead: ${lead.full_name} — ${lead.project_type} (${lead.budget_range})`;
  const text = [
    `A new project inquiry was submitted on Domustack.`,
    ``,
    `Name:        ${lead.full_name}`,
    `Phone:       ${lead.phone}`,
    `Email:       ${lead.email}`,
    `Project:     ${lead.project_type}`,
    `Budget:      ${lead.budget_range}`,
    `Pictures:    ${lead.inspiration_images.length}`,
    ``,
    `Description:`,
    lead.description,
    ``,
    lead.inspiration_images.length > 0 ? `Inspiration images:\n${lead.inspiration_images.join("\n")}\n` : ``,
    `View in admin: ${SITE_URL}/admin`,
  ].join("\n");

  const html = `
<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1a1f2e;background:#f7f8fa;padding:24px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #dfe4ec;border-radius:12px;overflow:hidden">
    <div style="background:#0f2940;color:#fff;padding:18px 24px">
      <div style="font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:#a8c0a4;font-weight:700">New project inquiry</div>
      <div style="font-size:20px;font-weight:700;margin-top:4px">${escapeHtml(lead.full_name)} — ${escapeHtml(lead.project_type)}</div>
    </div>
    <div style="padding:22px 24px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px">Phone</td><td><a href="tel:${escapeAttr(lead.phone)}" style="color:#0f2940">${escapeHtml(lead.phone)}</a></td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Email</td><td><a href="mailto:${escapeAttr(lead.email)}" style="color:#0f2940">${escapeHtml(lead.email)}</a></td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Project type</td><td>${escapeHtml(lead.project_type)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Budget</td><td>${escapeHtml(lead.budget_range)}</td></tr>
      </table>

      <div style="margin-top:18px">
        <div style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:6px">Description</div>
        <div style="font-size:14.5px;line-height:1.55;white-space:pre-wrap">${escapeHtml(lead.description)}</div>
      </div>

      ${lead.inspiration_images.length > 0 ? `
      <div style="margin-top:18px">
        <div style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:8px">Inspiration images (${lead.inspiration_images.length})</div>
        ${lead.inspiration_images.map((u) => `<a href="${escapeAttr(u)}" style="display:inline-block;margin:0 6px 6px 0"><img src="${escapeAttr(u)}" alt="" style="width:96px;height:96px;object-fit:cover;border-radius:6px;border:1px solid #dfe4ec"/></a>`).join("")}
      </div>` : ""}

      <div style="margin-top:24px">
        <a href="${SITE_URL}/admin" style="display:inline-block;padding:11px 18px;background:#0f2940;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700">Open in admin</a>
      </div>
    </div>
    <div style="padding:14px 24px;border-top:1px solid #dfe4ec;color:#6b7280;font-size:11px">
      Sent automatically by Domustack · Purple Heart Pros LLC
    </div>
  </div>
</body></html>`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: ADMIN_TO,
    replyTo: lead.email,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("[email] resend error", error);
    return { error: error.message ?? "send failed" };
  }
  return { ok: true };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}
function escapeAttr(s: string) {
  return escapeHtml(s).replace(/'/g, "&#39;");
}
