import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    console.log("Configuring live SMTP transporter for NodeMailer...");
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  } else {
    console.log("No SMTP configurations found. Initializing Ethereal Mail test account fallback...");
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log("Ethereal Mail test account configured successfully.");
    } catch (error) {
      console.error("Failed to configure Ethereal Mail test account, using direct logger fallback:", error);
      // Fallback transporter that logs
      transporter = {
        async sendMail(mailOptions: any) {
          console.log("=== NODEMAILER LOGGER FALLBACK ===");
          console.log("To:", mailOptions.to);
          console.log("Subject:", mailOptions.subject);
          console.log("Body:", mailOptions.text);
          console.log("==================================");
          return { messageId: "mock-log-id" };
        }
      } as any;
    }
  }

  return transporter!;
}

export async function sendOtpMail(to: string, otp: string, userName: string): Promise<void> {
  const mailer = await getTransporter();
  const from = process.env.SMTP_FROM || '"Formu.AI" <no-reply@formu.ai>';

  const subject = "Your Verification Code - Formu.AI";
  
  const text = `Hello ${userName},\n\nYour 6-digit verification code to change your password is: ${otp}\n\nThis code will expire in 5 minutes. If you did not request this, please ignore this email.\n\nBest regards,\nThe Formu.AI Team`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 24px; font-weight: 800; color: #4f46e5; tracking-tight: -0.025em;">Formu.AI</span>
      </div>
      <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; margin-top: 0; margin-bottom: 8px;">Verify your email</h2>
      <p style="font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 24px; line-height: 1.5;">
        Hello <strong>${userName}</strong>,<br/>
        We received a request to change the password for your Formu.AI account. Use the verification code below to authorize this change:
      </p>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px;">
        <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 32px; font-weight: 800; letter-spacing: 0.15em; color: #4f46e5; display: inline-block;">${otp}</span>
      </div>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 0; margin-bottom: 24px; line-height: 1.5; text-align: center;">
        This code is valid for <strong>5 minutes</strong>. If you did not make this request, you can safely ignore this message.
      </p>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
        <span style="font-size: 11px; color: #94a3b8;">Formu.AI • Dynamic SaaS Form Builder</span>
      </div>
    </div>
  `;

  try {
    const info = await mailer.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log(`Verification code sent to ${to} (Message ID: ${info.messageId})`);

    // Log the Ethereal URL if using the test account
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`\n======================================================`);
      console.log(`📧 ETHEREAL TEST EMAIL SENT!`);
      console.log(`Preview URL: ${previewUrl}`);
      console.log(`======================================================\n`);
    }
  } catch (error) {
    console.error(`Failed to send verification code email to ${to}:`, error);
    throw new Error("Failed to send verification email. Please try again later.");
  }
}

export async function sendContactMail(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<void> {
  const mailer = await getTransporter();
  const from = process.env.SMTP_FROM || '"Formu.AI" <no-reply@formu.ai>';
  const to = process.env.ADMIN_EMAIL || "prajapatiram983@gmail.com";

  const mailSubject = `Contact Form Inquiry: ${subject} - from ${name}`;
  
  const text = `New Contact Form Submission:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
        <span style="font-size: 24px; font-weight: 800; color: #4f46e5;">Formu.AI Admin Panel</span>
        <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 8px; margin-bottom: 0;">New Contact Form Submission</h2>
      </div>
      
      <div style="margin-bottom: 24px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #475569; width: 120px; vertical-align: top;">Name:</td>
            <td style="padding: 6px 0; font-size: 14px; color: #0f172a; vertical-align: top;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #475569; vertical-align: top;">Email:</td>
            <td style="padding: 6px 0; font-size: 14px; color: #0f172a; vertical-align: top;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #475569; vertical-align: top;">Subject:</td>
            <td style="padding: 6px 0; font-size: 14px; color: #0f172a; vertical-align: top;"><strong>${subject}</strong></td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; font-weight: 700; color: #334155; margin-top: 0; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Message:</h3>
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
        <span style="font-size: 11px; color: #94a3b8;">This is an automated administrative notification from Formu.AI</span>
      </div>
    </div>
  `;

  try {
    const info = await mailer.sendMail({
      from,
      to,
      subject: mailSubject,
      text,
      html,
      replyTo: email,
    });

    console.log(`Contact form inquiry sent to admin ${to} (Message ID: ${info.messageId})`);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`\n======================================================`);
      console.log(`📧 ETHEREAL TEST EMAIL SENT!`);
      console.log(`Preview URL: ${previewUrl}`);
      console.log(`======================================================\n`);
    }
  } catch (error) {
    console.error(`Failed to send contact email:`, error);
    throw new Error("Failed to send contact inquiry. Please try again later.");
  }
}
