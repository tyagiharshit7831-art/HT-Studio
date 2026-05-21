// Shared interactions for the portfolio website.
const body = document.body;
const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");
const themeToggle = document.getElementById("themeToggle");
const whatsAppUrl = "https://wa.me/919205264288?text=Hi%20HT%20Studio%2C%20I%20saw%20your%20portfolio%20website%20and%20want%20to%20discuss%20a%20creative%20project.";

const whatsAppFloat = document.createElement("a");
whatsAppFloat.className = "whatsapp-float";
whatsAppFloat.href = whatsAppUrl;
whatsAppFloat.target = "_blank";
whatsAppFloat.rel = "noreferrer";
whatsAppFloat.setAttribute("aria-label", "Chat with HT Studio on WhatsApp");
whatsAppFloat.setAttribute("data-label", "HT Studio");
whatsAppFloat.innerHTML = `
  <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <path d="M16 3.5A12.4 12.4 0 0 0 5.3 22.1L4 28l6-1.3A12.5 12.5 0 1 0 16 3.5Zm0 2.4a10.1 10.1 0 0 1 8.6 15.4A10 10 0 0 1 10.4 24l-.4-.2-3 .7.7-2.9-.2-.5A10 10 0 0 1 16 5.9Zm-4.3 5.5c-.2 0-.5.1-.7.4-.3.3-.9 1-.9 2.4s.9 2.8 1.1 3c.1.2 1.9 3.1 4.7 4.2 2.3.9 2.8.7 3.3.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.2-.3-.2-.6-.4l-1.9-.9c-.3-.1-.5-.2-.7.2l-.8 1c-.2.3-.4.3-.8.1-.3-.2-1.4-.5-2.7-1.7-1-1-1.7-2.1-1.9-2.4-.2-.4 0-.5.2-.7l.5-.6c.1-.2.2-.3.3-.5.1-.2.1-.4 0-.6l-.9-2.1c-.2-.5-.4-.5-.7-.5h-.5Z"/>
  </svg>
`;
document.body.appendChild(whatsAppFloat);

window.addEventListener("load", () => {
  body.classList.add("loaded");
});

const savedTheme = localStorage.getItem("harshit-theme");
if (savedTheme === "light") {
  document.documentElement.dataset.theme = "light";
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme === "light" ? "light" : "";
  localStorage.setItem("harshit-theme", nextTheme);
});

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    navToggle?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const onScroll = () => {
  const scrolled = window.scrollY > 24;
  header?.classList.toggle("scrolled", scrolled);
  backToTop?.classList.toggle("show", window.scrollY > 500);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const number = entry.target;
    const target = Number(number.dataset.count || 0);
    const duration = 1300;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      number.textContent = `${Math.floor(target * eased)}+`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    countObserver.unobserve(number);
  });
}, { threshold: 0.55 });

document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

// Portfolio filters and modal.
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioCards = document.querySelectorAll(".portfolio-card");
const portfolioSections = document.querySelectorAll(".portfolio-category");
const lightbox = document.getElementById("lightbox");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxVideo = document.getElementById("lightboxVideo");
const lightboxYoutube = document.getElementById("lightboxYoutube");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalYear = document.getElementById("modalYear");
const modalSoftware = document.getElementById("modalSoftware");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;

    portfolioCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !shouldShow);
    });

    portfolioSections.forEach((section) => {
      const shouldShow = filter === "all" || section.dataset.categorySection === filter;
      section.classList.toggle("hidden", !shouldShow);
    });
  });
});

portfolioCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("video") || event.target.closest("iframe:not(.lightbox-youtube)")) return;
    if (card.classList.contains("empty-slot")) return;

    const cardImg = card.querySelector(".graphic-card-img");
    const image = cardImg ? "url('" + cardImg.src + "')" : card.style.getPropertyValue("--img");
    const video = card.dataset.video;
    const youtubeUrl = card.dataset.youtubeUrl;
    if (lightboxImage) lightboxImage.style.setProperty("--img", image);
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute("src");
      lightboxVideo.load();
    }
    if (lightboxYoutube) {
      lightboxYoutube.removeAttribute("src");
    }
    lightbox?.classList.toggle("has-video", Boolean(video));
    lightbox?.classList.toggle("has-youtube", Boolean(youtubeUrl));
    if (video && lightboxVideo) {
      lightboxVideo.src = video;
      lightboxVideo.load();
    }
    if (youtubeUrl && lightboxYoutube) {
      const watchUrl = new URL(youtubeUrl);
      const videoId = watchUrl.searchParams.get("v");
      const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
      embedUrl.searchParams.set("rel", "0");
      embedUrl.searchParams.set("autoplay", "1");
      embedUrl.searchParams.set("playsinline", "1");
      embedUrl.searchParams.set("enablejsapi", "1");
      if (window.location.origin && window.location.origin !== "null") {
        embedUrl.searchParams.set("origin", window.location.origin);
      }
      lightboxYoutube.src = embedUrl.toString();
      lightboxYoutube.title = card.dataset.title || "YouTube video player";
    }
    if (modalCategory) modalCategory.textContent = card.dataset.category || "";
    if (modalTitle) modalTitle.textContent = card.dataset.title || "";
    if (modalDesc) modalDesc.textContent = card.dataset.desc || "";
    if (modalYear) modalYear.textContent = card.dataset.year || "";
    if (modalSoftware) modalSoftware.textContent = card.dataset.software || "";
    lightbox?.classList.add("open");
    lightbox?.setAttribute("aria-hidden", "false");
  });
});

const closeLightbox = () => {
  if (lightboxVideo) {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
  }
  if (lightboxYoutube) {
    lightboxYoutube.removeAttribute("src");
  }
  lightbox?.classList.remove("open");
  lightbox?.classList.remove("has-video");
  lightbox?.classList.remove("has-youtube");
  lightbox?.setAttribute("aria-hidden", "true");
};

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

// Contact form validation and animated success message.
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...contactForm.querySelectorAll("input, select, textarea")];
  let isValid = true;

  fields.forEach((field) => {
    const row = field.closest(".form-row");
    const valid = field.checkValidity();
    row?.classList.toggle("error", !valid);
    if (!valid) isValid = false;
  });

  if (!isValid) {
    formStatus.textContent = "Please complete the highlighted fields.";
    formStatus.style.color = "#ff8a8a";
    return;
  }

  const submitButton = contactForm.querySelector(".submit-btn");
  const formEndpoint = contactForm.getAttribute("action");

  if (!formEndpoint) {
    formStatus.style.color = "#ff8a8a";
    formStatus.textContent = "Form endpoint is missing. Please try email or WhatsApp.";
    return;
  }

  if (submitButton) submitButton.disabled = true;
  formStatus.style.color = "var(--muted)";
  formStatus.textContent = "Sending your project brief...";

  fetch(formEndpoint, {
    method: "POST",
    body: new FormData(contactForm),
    headers: { Accept: "application/json" },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Form submission failed");
      formStatus.style.color = "var(--success)";
      formStatus.textContent = "Thank you. Your project brief has been sent.";
      contactForm.reset();
    })
    .catch(() => {
      formStatus.style.color = "#ff8a8a";
      formStatus.textContent = "Message could not be sent. Please try email or WhatsApp.";
    })
    .finally(() => {
      if (submitButton) submitButton.disabled = false;
    });
});
