import nodemailer, { type Transporter } from "nodemailer";

interface EnquiryEmailData {
  enquiryId: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  program?: string;
  city?: string;
  state?: string;
  budget?: string;
  message?: string;
  aiSummary?: string;
}

// Lazy-initialized transporter
let transporter: Transporter | null = null;

export function isSmtpConfigured(): boolean {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  return Boolean(user && pass);
}

export function getEmailTransporter(): Transporter | null {
  if (transporter) return transporter;

  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  const host = process.env.SMTP_HOST || (user.includes("@gmail.com") ? "smtp.gmail.com" : undefined);
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;

  try {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
    console.log(`[EmailService] Nodemailer SMTP transporter initialized for ${user} (${host}:${port})`);
    return transporter;
  } catch (err) {
    console.error("[EmailService] Failed to create nodemailer transporter:", err);
    return null;
  }
}

/**
 * Sends a confirmation email to the applicant who submitted the form.
 */
export async function sendApplicantConfirmationEmail(data: EnquiryEmailData): Promise<{ success: boolean; messageId?: string; reason?: string }> {
  const mailer = getEmailTransporter();
  const fromAddress = process.env.SMTP_FROM || `\"KIPS Kinderbee\" <${process.env.SMTP_USER || "kinderbeeschools@gmail.com"}>`;
  const programTitle = data.program || data.type || "School Partnership & Educational Programs";

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Confirmation - KIPS Kinderbee</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F6F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917; line-height: 1.6;">
  <div style="max-width: 600px; margin: 24px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
    
    <!-- Top Header -->
    <div style="background: linear-gradient(135deg, #200213 0%, #12010B 50%, #2A041A 100%); padding: 32px 28px; text-align: center; border-bottom: 3px solid #E1007A;">
      <div style="display: inline-block; background: #ffffff; padding: 8px 16px; border-radius: 12px; margin-bottom: 16px;">
        <span style="font-size: 20px; font-weight: 900; color: #E1007A; letter-spacing: 1px;">KIPS</span>
        <span style="font-size: 13px; font-weight: 700; color: #44403c; margin-left: 6px;">KINDERBEE</span>
      </div>
      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">We Received Your Enquiry</h1>
      <p style="margin: 8px 0 0; color: #fbcfe8; font-size: 14px;">Inquiry Reference: <strong style="color: #FFD400;">#${data.enquiryId.slice(-6).toUpperCase()}</strong></p>
    </div>

    <!-- Body Content -->
    <div style="padding: 28px 28px 24px;">
      <p style="font-size: 16px; margin: 0 0 16px; color: #1c1917;">
        Dear <strong>${data.name}</strong>,
      </p>
      <p style="font-size: 14px; margin: 0 0 20px; color: #44403c; line-height: 1.6;">
        Thank you for your interest in <strong>Kinderbee Integrated Partnership System (KIPS)</strong>. We have received your inquiry regarding <strong>${programTitle}</strong>.
      </p>

      <!-- Details Summary Card -->
      <div style="background: #fafaf9; border-radius: 12px; border: 1px solid #e7e5e4; padding: 18px 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #78716c; font-weight: 700;">Submission Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #78716c; width: 38%;"><strong>Program of Interest:</strong></td>
            <td style="padding: 6px 0; color: #1c1917; font-weight: 600;">${programTitle}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #78716c;"><strong>Applicant Name:</strong></td>
            <td style="padding: 6px 0; color: #1c1917;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #78716c;"><strong>Contact Number:</strong></td>
            <td style="padding: 6px 0; color: #1c1917;">${data.phone}</td>
          </tr>
          ${data.city ? `
          <tr>
            <td style="padding: 6px 0; color: #78716c;"><strong>Target City / State:</strong></td>
            <td style="padding: 6px 0; color: #1c1917;">${data.city}${data.state ? `, ${data.state}` : ""}</td>
          </tr>
          ` : ""}
          ${data.message ? `
          <tr>
            <td style="padding: 6px 0; color: #78716c; vertical-align: top;"><strong>Your Note / Space:</strong></td>
            <td style="padding: 6px 0; color: #1c1917; font-style: italic;">"${data.message}"</td>
          </tr>
          ` : ""}
        </table>
      </div>

      <!-- What Happens Next -->
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #1c1917; margin: 0 0 12px;">What Happens Next?</h3>
        <div style="display: flex; margin-bottom: 10px;">
          <div style="background: #fdf2f8; color: #E1007A; font-weight: 800; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 12px; flex-shrink: 0;">1</div>
          <div style="font-size: 13px; color: #44403c;"><strong>Territory & Program Audit:</strong> Our academic development team checks regional availability and feasibility for your locality.</div>
        </div>
        <div style="display: flex; margin-bottom: 10px;">
          <div style="background: #fdf2f8; color: #E1007A; font-weight: 800; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 12px; flex-shrink: 0;">2</div>
          <div style="font-size: 13px; color: #44403c;"><strong>Senior Advisor Contact:</strong> A Senior School Planner will contact you directly via phone or WhatsApp within <strong>24 business hours</strong>.</div>
        </div>
        <div style="display: flex;">
          <div style="background: #fdf2f8; color: #E1007A; font-weight: 800; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 12px; flex-shrink: 0;">3</div>
          <div style="font-size: 13px; color: #44403c;"><strong>Comprehensive Plan:</strong> Receive curriculum samples, the Zero Royalty franchise prospectus, and setup guidance.</div>
        </div>
      </div>

      <!-- Urgent Contact Callout -->
      <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 14px 16px; margin-bottom: 20px;">
        <div style="font-size: 13px; color: #92400e; font-weight: 700; margin-bottom: 4px;">Need Immediate Assistance?</div>
        <div style="font-size: 13px; color: #78350f;">
          Call our central advisory line at <a href="tel:+918122344040" style="color: #b45309; font-weight: 700; text-decoration: none;">+91 81223 44040</a> or WhatsApp us directly.
        </div>
      </div>

      <p style="font-size: 13px; color: #78716c; margin: 0 0 4px;">Warm regards,</p>
      <p style="font-size: 14px; font-weight: 800; color: #1c1917; margin: 0;">Central Advisory Team</p>
      <p style="font-size: 12px; color: #78716c; margin: 0;">Kinderbee Integrated Partnership System (KIPS)</p>
    </div>

    <!-- Footer -->
    <div style="background: #f5f5f4; padding: 18px 28px; text-align: center; border-top: 1px solid #e7e5e4; font-size: 11px; color: #78716c;">
      <p style="margin: 0 0 6px;">Corporate Office: No. 1, Old UCO Bank Road, Ramamurthy Nagar, Bengaluru – 560016</p>
      <p style="margin: 0;">Website: <a href="https://kinderbeeschools.com" style="color: #E1007A; text-decoration: none; font-weight: 600;">kinderbeeschools.com</a> | Email: <a href="mailto:kinderbeeschools@gmail.com" style="color: #E1007A; text-decoration: none;">kinderbeeschools@gmail.com</a></p>
    </div>
  </div>
</body>
</html>
  `;

  if (!mailer) {
    console.log(`[EmailService] Simulated Applicant Confirmation Email to: ${data.email}`);
    console.log(`[EmailService] (To enable real email dispatch, set SMTP_USER and SMTP_PASS in environment variables)`);
    return { success: true, reason: "Simulated: SMTP credentials not configured yet" };
  }

  try {
    const info = await mailer.sendMail({
      from: fromAddress,
      to: data.email,
      subject: `Thank you for contacting KIPS | Inquiry Received (#${data.enquiryId.slice(-6).toUpperCase()})`,
      html: htmlContent,
    });
    console.log(`[EmailService] Applicant confirmation email sent successfully to ${data.email}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[EmailService] Error sending applicant confirmation email to ${data.email}:`, err);
    return { success: false, reason: err.message };
  }
}

/**
 * Sends an alert email to the KIPS Administrator whenever a new lead arrives.
 */
export async function sendAdminLeadAlertEmail(data: EnquiryEmailData): Promise<{ success: boolean; messageId?: string; reason?: string }> {
  const mailer = getEmailTransporter();
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER || "kinderbeeschools@gmail.com";
  const fromAddress = process.env.SMTP_FROM || `\"KIPS Lead Alerts\" <${process.env.SMTP_USER || "kinderbeeschools@gmail.com"}>`;
  const programTitle = data.program || data.type || "Direct Contact Form";
  const cleanPhone = data.phone.replace(/[^0-9]/g, "");

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Lead Notification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #1c1917; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f5f5f4; line-height: 1.5;">
  <div style="max-width: 600px; margin: 20px auto; background: #292524; border-radius: 16px; overflow: hidden; border: 1px solid #44403c;">
    
    <!-- Top Alert Banner -->
    <div style="background: linear-gradient(135deg, #E1007A 0%, #be123c 100%); padding: 20px 24px; text-align: left;">
      <span style="background: rgba(0,0,0,0.3); color: #ffffff; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
        🔥 NEW LEAD ALERT
      </span>
      <h2 style="margin: 10px 0 0; color: #ffffff; font-size: 20px; font-weight: 800;">
        ${data.name} &bull; ${programTitle}
      </h2>
    </div>

    <!-- Lead Info Body -->
    <div style="padding: 24px;">
      
      <!-- Lead Summary Card -->
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #44403c;">
          <td style="padding: 8px 0; color: #a8a29e; width: 35%;">Applicant Name:</td>
          <td style="padding: 8px 0; color: #ffffff; font-weight: 700;">${data.name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #44403c;">
          <td style="padding: 8px 0; color: #a8a29e;">Phone:</td>
          <td style="padding: 8px 0; color: #38bdf8; font-weight: 700;">
            <a href="tel:${data.phone}" style="color: #38bdf8; text-decoration: none;">${data.phone}</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #44403c;">
          <td style="padding: 8px 0; color: #a8a29e;">Email:</td>
          <td style="padding: 8px 0; color: #ffffff;">
            <a href="mailto:${data.email}" style="color: #f472b6; text-decoration: none;">${data.email}</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #44403c;">
          <td style="padding: 8px 0; color: #a8a29e;">Program:</td>
          <td style="padding: 8px 0; color: #fde047; font-weight: 600;">${programTitle}</td>
        </tr>
        ${data.city ? `
        <tr style="border-bottom: 1px solid #44403c;">
          <td style="padding: 8px 0; color: #a8a29e;">City / State:</td>
          <td style="padding: 8px 0; color: #ffffff;">${data.city}${data.state ? `, ${data.state}` : ""}</td>
        </tr>
        ` : ""}
        ${data.budget ? `
        <tr style="border-bottom: 1px solid #44403c;">
          <td style="padding: 8px 0; color: #a8a29e;">Investment Budget:</td>
          <td style="padding: 8px 0; color: #4ade80; font-weight: 700;">${data.budget}</td>
        </tr>
        ` : ""}
        ${data.message ? `
        <tr>
          <td style="padding: 8px 0; color: #a8a29e; vertical-align: top;">Notes / Requirements:</td>
          <td style="padding: 8px 0; color: #e7e5e4; font-style: italic;">"${data.message}"</td>
        </tr>
        ` : ""}
      </table>

      ${data.aiSummary ? `
      <!-- AI Strategic Insights -->
      <div style="background: #1c1917; border: 1px solid #78350f; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 14px; margin-bottom: 24px;">
        <div style="font-size: 11px; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
          🤖 Gemini AI Lead Assessment
        </div>
        <div style="font-size: 13px; color: #fef3c7; line-height: 1.5;">
          ${data.aiSummary}
        </div>
      </div>
      ` : ""}

      <!-- Quick Action Buttons -->
      <div style="text-align: center; padding-top: 8px;">
        <a href="tel:${data.phone}" style="display: inline-block; background: #E1007A; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 20px; border-radius: 8px; margin: 4px 6px;">
          📞 Call Applicant
        </a>
        <a href="https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}" style="display: inline-block; background: #22c55e; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 20px; border-radius: 8px; margin: 4px 6px;">
          💬 WhatsApp
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #1c1917; padding: 14px 24px; text-align: center; border-top: 1px solid #44403c; font-size: 11px; color: #78716c;">
      KIPS Central Portal &bull; Automated Lead Dispatch Service &bull; ID: ${data.enquiryId}
    </div>

  </div>
</body>
</html>
  `;

  if (!mailer) {
    console.log(`[EmailService] Simulated Admin Alert Email to: ${adminEmail}`);
    return { success: true, reason: "Simulated: SMTP credentials not configured yet" };
  }

  try {
    const info = await mailer.sendMail({
      from: fromAddress,
      to: adminEmail,
      subject: `🚨 New Lead: ${data.name} (${programTitle})`,
      html: htmlContent,
    });
    console.log(`[EmailService] Admin alert email sent successfully to ${adminEmail}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[EmailService] Error sending admin alert email to ${adminEmail}:`, err);
    return { success: false, reason: err.message };
  }
}
