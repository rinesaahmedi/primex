const { transporter } = require("../config/email");

// Helper must be defined before use
const formatText = (text) => {
  if (!text) return "<em>Not provided</em>";
  return text.replace(/\n/g, "<br>");
};

// ==================================================================
// 1. JOB APPLICATION CONTROLLER
// ==================================================================
exports.sendApplyForm = async (req, res) => {
  try {
    const {
      name = "N/A",
      email = "N/A",
      phone = "N/A",
      linkedin = "N/A",
      country = "N/A",
      position = "General",
      description = "",
    } = req.body;

    console.log("Received Application from:", name);

    // --- A. HTML for the COMPANY (Owner) - PROFESSIONAL CARD STYLE ---
    const ownerHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="background-color: #2563eb; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">New Job Application</h2>
          <p style="color: #dbeafe; margin: 5px 0 0; font-size: 14px; font-weight: 500;">Position: ${position}</p>
        </div>
        
        <!-- Content Body -->
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; width: 30%; vertical-align: top;">Candidate</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; vertical-align: top;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; vertical-align: top;">Phone</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; vertical-align: top;">Country</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;">${country}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; vertical-align: top;">LinkedIn</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;">
                 <a href="${linkedin}" target="_blank" style="background-color: #f1f5f9; color: #2563eb; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: 600;">View Profile &rarr;</a>
              </td>
            </tr>
          </table>

          <div style="margin-top: 24px;">
            <p style="color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Candidate Introduction</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; color: #334155; font-size: 14px; line-height: 1.6;">
              ${formatText(description)}
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
           <p style="margin: 0; color: #94a3b8; font-size: 12px;">See attachment for CV</p>
        </div>
      </div>
    `;

    // --- B. HTML for the APPLICANT (Client) ---
    const applicantHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2563eb; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Application Received</h2>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #333; margin-top: 0;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            Thank you for applying to PrimEx for the <strong style="color: #2563eb;">${position}</strong> role.
          </p>
          <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #555; font-size: 14px;">
              Our team will review your application and get back to you shortly if your profile matches our needs.
            </p>
          </div>
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>PrimEx HR Team</strong></p>
        </div>
      </div>
    `;

    // Prepare attachment if file exists
    const attachments = req.file
      ? [{ filename: req.file.originalname, content: req.file.buffer }]
      : [];

    // 1. Send to Owner
    await transporter.sendMail({
      from: `"PrimEx Careers" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `Job Application: ${name} - ${position}`,
      html: ownerHtml,
      replyTo: email,
      attachments: attachments,
    });

    // 2. Send to Applicant
    if (email) {
      await transporter.sendMail({
        from: `"PrimEx Careers" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "We received your application - PrimEx",
        html: applicantHtml,
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("/send-apply-form error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================================================================
// 2. BUSINESS INQUIRY CONTROLLER
// ==================================================================
exports.sendBusinessInquiry = async (req, res) => {
  try {
    const {
      companyName = "N/A",
      contactPerson = "N/A",
      email = "N/A",
      phone = "N/A",
      businessType = "General Inquiry",
      message = "",
    } = req.body;

    // --- A. HTML for the COMPANY (Owner) - PROFESSIONAL CARD STYLE ---
    const ownerHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="background-color: #0f172a; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">New Business Inquiry</h2>
          <p style="color: #94a3b8; margin: 5px 0 0; font-size: 14px; font-weight: 500;">${companyName}</p>
        </div>

        <!-- Content Body -->
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; width: 30%; vertical-align: top;">Contact</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px; font-weight: 500;">${contactPerson}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; vertical-align: top;">Company</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;">${companyName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; vertical-align: top;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; vertical-align: top;">Phone</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; vertical-align: top;">Interest</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;">
                <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase;">${businessType}</span>
              </td>
            </tr>
          </table>

          <!-- Message Section -->
          <div style="margin-top: 24px;">
            <p style="color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Inquiry Message</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; color: #334155; font-size: 14px; line-height: 1.6;">
              ${formatText(message)}
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
           <p style="margin: 0; color: #94a3b8; font-size: 12px;">Lead generated via PrimEx Website</p>
        </div>
      </div>
    `;

    const clientHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Inquiry Received</h2>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #333; margin-top: 0;">Hi <strong>${contactPerson}</strong>,</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            Thank you for reaching out to PrimEx regarding <strong>${businessType}</strong>.
          </p>
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>PrimEx Business Team</strong></p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"PrimEx Business" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      replyTo: email,
      subject: `Business Inquiry: ${companyName} (${businessType})`,
      html: ownerHtml,
    });

    if (email) {
      await transporter.sendMail({
        from: `"PrimEx Solutions" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "We received your inquiry - PrimEx",
        html: clientHtml,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("/send-business-inquiry error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};