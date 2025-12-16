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
    // 1. Check if file exists (Optional, depending on if you want it mandatory on backend too)
    // Note: React 'validateForm' already checks this, but good to be safe.

    const {
      name = "N/A",
      email = "N/A",
      phone = "N/A",
      linkedin = "N/A",
      country = "N/A",
      position = "General",
      description = "",
    } = req.body;

    console.log("Received Application from:", name); // Debugging

    // --- A. HTML for the COMPANY (Owner) ---
    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2563eb; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">New Job Application</h2>
          <p style="color: #e0e7ff; margin: 5px 0 0;">Position: ${position}</p>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #555; width: 30%;">Name:</td><td style="padding: 8px; color: #333;">${name}</td></tr>
            <tr style="background-color: #f3f4f6;"><td style="padding: 8px; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px; color: #333;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone:</td><td style="padding: 8px; color: #333;">${phone}</td></tr>
            <tr style="background-color: #f3f4f6;"><td style="padding: 8px; font-weight: bold; color: #555;">Country:</td><td style="padding: 8px; color: #333;">${country}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #555;">LinkedIn:</td><td style="padding: 8px; color: #333;"><a href="${linkedin}" target="_blank" style="color: #2563eb;">View Profile</a></td></tr>
          </table>
          <div style="margin-top: 20px; background: #fff; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #555;">Cover Letter:</p>
            <p style="margin-top: 10px; color: #333; line-height: 1.6;">${formatText(
              description
            )}</p>
          </div>
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

    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #333; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">New Business Inquiry</h2>
          <p style="color: #93c5fd; margin: 5px 0 0;">${companyName}</p>
        </div>
        <div style="padding: 20px; background-color: #fff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #555; width: 35%;">Contact Person:</td><td style="padding: 8px;">${contactPerson}</td></tr>
            <tr style="background-color: #f3f4f6;"><td style="padding: 8px; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone:</td><td style="padding: 8px;">${phone}</td></tr>
            <tr style="background-color: #f3f4f6;"><td style="padding: 8px; font-weight: bold; color: #555;">Service Interest:</td><td style="padding: 8px; color: #1e3a8a; font-weight: bold;">${businessType}</td></tr>
          </table>
          <div style="margin-top: 20px; background: #f9fafb; padding: 15px; border: 1px solid #e5e7eb; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #555;">Message:</p>
            <p style="margin: 0; color: #333; white-space: pre-line;">${formatText(
              message
            )}</p>
          </div>
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
