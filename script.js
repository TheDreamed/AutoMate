// Navbar scroll effect
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});

// Mobile nav toggle
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close mobile nav on link click
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Contact form handling
const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());

  // Validate required fields
  if (!data.name || !data.email) {
    showNotification("Please fill in all required fields.", "error");
    return;
  }

  // Submit to Formspree
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  fetch(contactForm.action, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        showNotification(
          "Thank you! We'll be in touch within 24 hours.",
          "success"
        );
        contactForm.reset();
      } else {
        showNotification(
          "Something went wrong. Please try again.",
          "error"
        );
      }
    })
    .catch(() => {
      showNotification(
        "Network error. Please try again later.",
        "error"
      );
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
});

// Notification system
function showNotification(message, type) {
  const existing = document.querySelector(".notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  Object.assign(notification.style, {
    position: "fixed",
    top: "90px",
    right: "24px",
    padding: "16px 24px",
    borderRadius: "8px",
    fontWeight: "500",
    fontSize: "0.95rem",
    zIndex: "9999",
    animation: "slideIn 0.3s ease",
    background: type === "success" ? "#059669" : "#dc2626",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  });

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.3s";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Add slideIn animation
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);

// Scroll-reveal animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(
  ".service-card, .step, .pricing-card, .testimonial-card, .faq-item"
).forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

// FAQ accordion
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const answer = item.querySelector(".faq-answer");
    const isOpen = item.classList.contains("open");

    // Close all
    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      openItem.classList.remove("open");
      openItem.querySelector(".faq-answer").style.maxHeight = null;
    });

    // Open clicked (if it wasn't already open)
    if (!isOpen) {
      item.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// Lead magnet form
const leadForm = document.getElementById("lead-magnet-form");
if (leadForm) {
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = leadForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = "Sending...";
    btn.disabled = true;

    setTimeout(() => {
      showNotification(
        "Check your inbox! Your free checklist is on its way.",
        "success"
      );
      leadForm.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1200);
  });
}
