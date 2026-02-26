// Mobile menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("show");
    const expanded =
      mobileMenuButton.getAttribute("aria-expanded") === "true" ? false : true;
    mobileMenuButton.setAttribute("aria-expanded", expanded);
  });
}

// Loading screen
window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  if (loading) {
    setTimeout(() => {
      loading.classList.add("fade-out");
    }, 1000);
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      // Close mobile menu if open
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("show");
      }
    }
  });
});

// Form validation
const contactForm = document.querySelector("#contact form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const message = document.getElementById("message")?.value;

    if (!name || !email || !message) {
      e.preventDefault();
      alert("Please fill in all required fields");
    }
  });
}

 // Reverse order of project cards
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector("#projects .grid");
    const cards = Array.from(grid.children);
    cards.reverse().forEach(card => grid.appendChild(card));
  });
