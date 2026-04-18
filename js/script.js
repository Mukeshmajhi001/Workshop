// ─── 3D CURSOR (desktop only) ───
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  ) || window.innerWidth <= 768;
const cursorOuter = document.getElementById("cursorOuter");
const cursorInner = document.getElementById("cursorInner");

if (!isMobile && cursorOuter && cursorInner) {
  let outerX = 0,
    outerY = 0,
    innerX = 0,
    innerY = 0;
  let targetX = 0,
    targetY = 0;

  document.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    cursorInner.style.left = e.clientX + "px";
    cursorInner.style.top = e.clientY + "px";
  });

  // Smooth trailing for outer cursor (3D lag effect)
  function animateCursor() {
    outerX += (targetX - outerX) * 0.12;
    outerY += (targetY - outerY) * 0.12;
    cursorOuter.style.left = outerX + "px";
    cursorOuter.style.top = outerY + "px";
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Click effect
  document.addEventListener("mousedown", () =>
    cursorOuter.classList.add("clicked"),
  );
  document.addEventListener("mouseup", () =>
    cursorOuter.classList.remove("clicked"),
  );

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll(
    "a, button, .skill-tag, .project-card, .social-btn, input, textarea",
  );
  hoverEls.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      cursorOuter.classList.add("hovered"),
    );
    el.addEventListener("mouseleave", () =>
      cursorOuter.classList.remove("hovered"),
    );
  });

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    cursorOuter.style.opacity = "0";
    cursorInner.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursorOuter.style.opacity = "1";
    cursorInner.style.opacity = "1";
  });
}

// Loader
window.addEventListener("load", () => {
  const loading = document.getElementById("loader");
  if (loading) {
    setTimeout(() => loading.classList.add("hide"), 1200);
  }
});

// Mobile menu toggle
const ham = document.getElementById("hamburger");
const mob = document.getElementById("mobileNav");
if (ham && mob) {
  ham.addEventListener("click", () => {
    mob.classList.toggle("open");
    const expanded =
      ham.getAttribute("aria-expanded") === "true" ? false : true;
    ham.setAttribute("aria-expanded", expanded);
  });
}
function closeMobile() {
  if (mob) {
    mob.classList.remove("open");
    ham.setAttribute("aria-expanded", false);
  }
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      closeMobile();
    }
  });
});

// Form validation
const contactForm = document.querySelector("#contact form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const msg = document.getElementById("message")?.value;
    if (!name || !email || !msg) {
      e.preventDefault();
      alert("Please fill in all required fields");
    }
  });
}

// Float nav active link
function setActive(el) {
  document
    .querySelectorAll(".mfn-link")
    .forEach((l) => l.classList.remove("active"));
  el.classList.add("active");
}

// Auto-highlight float nav on scroll
const sections = document.querySelectorAll("section[id]");
window.addEventListener(
  "scroll",
  () => {
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    document.querySelectorAll('.mfn-link[href^="#"]').forEach((l) => {
      l.classList.toggle("active", l.getAttribute("href") === "#" + current);
    });
  },
  { passive: true },
);

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
