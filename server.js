// ============================================================
// EcoLeaf Exim - Backend Server
// Handles the contact form and sends submissions by email.
// ============================================================

const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// The business email that receives every contact-form submission.
// It can still be overridden with OWNER_EMAIL in the .env file.
const OWNER_EMAIL = process.env.OWNER_EMAIL || "ecoleafexim@gmail.com";

// Read JSON and regular form submissions.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the website from the public folder.
app.use(express.static(path.join(__dirname, "public")));

// Email transporter.
// For Gmail, use a Google App Password instead of your normal password.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Contact form endpoint.
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, reason, description } = req.body;

  // Trim text fields so accidental spaces do not become part of the email.
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim();
  const cleanPhone = String(phone || "").trim();
  const cleanReason = String(reason || "").trim();
  const cleanDescription = String(description || "").trim();

  // Validate required fields.
  if (!cleanName || !cleanEmail || !cleanReason || !cleanDescription) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields."
    });
  }

  // Basic email validation.
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
  if (!emailIsValid) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address."
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: OWNER_EMAIL,
      replyTo: cleanEmail,
      subject: `EcoLeaf Exim Website Inquiry - ${cleanReason}`,
      text: `
New inquiry received from the EcoLeaf Exim website.

Name: ${cleanName}
Email: ${cleanEmail}
Phone: ${cleanPhone || "Not provided"}
Reason: ${cleanReason}

Description:
${cleanDescription}
      `,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2 style="color:#356859">New EcoLeaf Exim Website Inquiry</h2>
          <hr>
          <p><strong>Name:</strong><br>${escapeHtml(cleanName)}</p>
          <p><strong>Email:</strong><br>${escapeHtml(cleanEmail)}</p>
          <p><strong>Phone:</strong><br>${escapeHtml(cleanPhone || "Not provided")}</p>
          <p><strong>Reason:</strong><br>${escapeHtml(cleanReason)}</p>
          <p><strong>Description:</strong><br>${escapeHtml(cleanDescription).replace(/\n/g, "<br>")}</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: "Thank you! Your message has been sent successfully."
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to send your message right now. Please try again later."
    });
  }
});

// Escape user input before inserting it into HTML email.
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.listen(PORT, () => {
  console.log(`EcoLeaf Exim website running at http://localhost:${PORT}`);
});