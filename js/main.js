// Nephi Trunnell Homes — shared site behavior

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Lightbox gallery ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var lightbox = document.querySelector(".lightbox");

  if (galleryItems.length && lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCaption = lightbox.querySelector("figcaption");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-prev");
    var nextBtn = lightbox.querySelector(".lightbox-next");
    var current = 0;

    function show(index) {
      current = (index + galleryItems.length) % galleryItems.length;
      var item = galleryItems[current];
      lbImg.src = item.getAttribute("data-full") || item.querySelector("img").src;
      lbImg.alt = item.querySelector("img").alt || "";
      lbCaption.textContent = item.getAttribute("data-caption") || "";
    }

    galleryItems.forEach(function (item, index) {
      item.addEventListener("click", function () {
        show(index);
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    prevBtn.addEventListener("click", function () { show(current - 1); });
    nextBtn.addEventListener("click", function () { show(current + 1); });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---------- Quote request form ---------- */
  // NOTE: This form currently opens the visitor's email client with a
  // pre-filled message (via a mailto: link) so it works with zero backend
  // setup. Once hosting + a business email are finalized, swap this out
  // for a hosted form service (e.g. Formspree or Netlify Forms) so
  // submissions land directly in an inbox without depending on the
  // visitor's local mail client.
  var quoteForm = document.querySelector("#quote-form");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(quoteForm);
      var get = function (key) { return (data.get(key) || "").toString().trim(); };

      var lines = [
        "New quote request from the website:",
        "",
        "Name: " + get("name"),
        "Phone: " + get("phone"),
        "Email: " + get("email"),
        "Project location: " + get("location"),
        "Project type: " + get("project_type"),
        "Estimated budget: " + get("budget"),
        "Desired timeline: " + get("timeline"),
        "",
        "Project description:",
        get("description")
      ];

      var subject = encodeURIComponent("Quote Request — " + (get("name") || "Website Visitor"));
      var body = encodeURIComponent(lines.join("\n"));
      var recipient = quoteForm.getAttribute("data-recipient") || "";

      window.location.href = "mailto:" + recipient + "?subject=" + subject + "&body=" + body;

      var status = document.querySelector("#form-status");
      if (status) {
        status.textContent = "Opening your email app to send this request. If nothing opens, please call or email us directly.";
        status.classList.add("show");
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
