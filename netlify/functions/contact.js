const nodemailer = require("nodemailer");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: false,
        message: "Method not allowed."
      })
    };
  }

  try {
    const { name, email, phone, reason, description } =
      JSON.parse(event.body || "{}");

    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim();
    const cleanPhone = String(phone || "").trim();
    const cleanReason = String(reason || "").trim();
    const cleanDescription = String(description || "").trim();

    if (
      !cleanName ||
      !cleanEmail ||
      !cleanReason ||
      !cleanDescription
    ) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          success: false,
          message: "Please fill in all required fields."
        })
      };
    }

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

    if (!emailIsValid) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          success: false,
          message: "Please enter a valid email address."
        })
      };
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("Email environment variables are missing.");

      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          success: false,
          message: "Email service is not configured."
        })
      };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"EcoLeaf Exim Website" <${process.env.EMAIL_USER}>`,
      to:
        process.env.OWNER_EMAIL ||
        "ecoleafexim@gmail.com",
      replyTo: cleanEmail,
      subject:
        `EcoLeaf Exim Website Inquiry - ${cleanReason}`,

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
          <h2 style="color:#356859">
            New EcoLeaf Exim Website Inquiry
          </h2>

          <hr>

          <p>
            <strong>Name:</strong><br>
            ${escapeHtml(cleanName)}
          </p>

          <p>
            <strong>Email:</strong><br>
            ${escapeHtml(cleanEmail)}
          </p>

          <p>
            <strong>Phone:</strong><br>
            ${escapeHtml(cleanPhone || "Not provided")}
          </p>

          <p>
            <strong>Reason:</strong><br>
            ${escapeHtml(cleanReason)}
          </p>

          <p>
            <strong>Description:</strong><br>
            ${escapeHtml(cleanDescription).replace(/\n/g, "<br>")}
          </p>
        </div>
      `
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true,
        message:
          "Thank you! Your message has been sent successfully."
      })
    };

  } catch (error) {
    console.error("Email error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: false,
        message:
          "Unable to send your message right now. Please try again later."
      })
    };
  }
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}