import { Resend } from "resend";

let resendClient = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export async function sendBookingNotificationEmail(payload) {
  const resend = getResend();
  const toEmail = process.env.BOOKING_NOTIFY_EMAIL;

  if (!resend || !toEmail) {
    return { skipped: true };
  }

  const {
    fullName,
    phone,
    serviceLabel,
    styleLabel,
    removalLabel,
    date,
    time,
    totalPrice,
    depositAmount,
  } = payload;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;direction:rtl;text-align:right;line-height:1.9;color:#151515">
      <h2 style="margin:0 0 16px">حجز جديد في Rezo Lash</h2>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        <tr><td style="padding:8px 0;font-weight:700">الاسم</td><td style="padding:8px 0">${fullName || "-"}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700">الجوال</td><td style="padding:8px 0">${phone || "-"}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700">الخدمة</td><td style="padding:8px 0">${serviceLabel || "-"}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700">الرسمة</td><td style="padding:8px 0">${styleLabel || "-"}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700">الإزالة</td><td style="padding:8px 0">${removalLabel || "-"}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700">التاريخ</td><td style="padding:8px 0">${date || "-"}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700">الوقت</td><td style="padding:8px 0">${time || "-"}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700">الإجمالي</td><td style="padding:8px 0">${totalPrice || 0} SAR</td></tr>
        <tr><td style="padding:8px 0;font-weight:700">العربون</td><td style="padding:8px 0">${depositAmount || 0} SAR</td></tr>
      </table>
    </div>
  `;

  return resend.emails.send({
    from: process.env.EMAIL_FROM || "Rezo Lash <onboarding@resend.dev>",
    to: [toEmail],
    subject: `حجز جديد - ${fullName || "عميلة جديدة"}`,
    html,
  });
}
