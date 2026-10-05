// ============================================================
// EcoLeaf Exim - Front-End JavaScript
// ============================================================

// Find the contact form.
// On the homepage this will be null, which is expected.
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    // Stop the browser from refreshing the page.
    event.preventDefault();

    const submitButton = contactForm.querySelector(".submit-button");
    const formMessage = document.getElementById("formMessage");

    // Disable the button while the email is being sent.
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formMessage.textContent = "";

    // Collect values from the form.
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      reason: document.getElementById("reason").value,
      description: document.getElementById("description").value.trim()
    };

    try {
      // Send the form data to the Node.js backend.
      const response = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        formMessage.textContent =
          "Thank you! Your message has been sent successfully.";
        formMessage.className = "success-message";
        contactForm.reset();
      } else {
        formMessage.textContent =
          result.message || "Unable to send your message.";
        formMessage.className = "error-message";
      }
    } catch (error) {
      console.error("Contact form error:", error);

      formMessage.textContent =
        "Unable to send your message. Please try again later.";
      formMessage.className = "error-message";
    } finally {
      // Re-enable the button whether the request succeeded or failed.
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }
  });
}

// ------------------------------------------------------------
// Pre-fill the contact form with a product selected from the
// "Enquire Now" links on the product catalog.
// ------------------------------------------------------------

const params = new URLSearchParams(window.location.search);
const selectedProduct = params.get("product");
const descriptionField = document.getElementById("description");

if (selectedProduct && descriptionField) {
  descriptionField.value =
    `I am interested in ${selectedProduct}. Please provide more information.`;
}