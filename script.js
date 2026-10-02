/* ==========================================================================
   Mídia Uai — script.js
   ========================================================================== */

/* ---------- CONFIGURAÇÃO ----------
   TODO: insira o número do WhatsApp da Mídia Uai.
   Formato: só números, com DDI (55) + DDD + número. Ex.: "5531999998888".
   Enquanto estiver vazio, os botões abrem o WhatsApp com a mensagem pronta
   e a pessoa escolhe o contato manualmente. */
const CONFIG = {
  whatsappNumber: "",
  whatsappMessage: "Olá! Vim pelo site da Mídia Uai e gostaria de saber mais sobre os serviços."
};

document.documentElement.classList.add("js");

/* ---------- Links do WhatsApp ---------- */
(function setupWhatsApp() {
  const number = CONFIG.whatsappNumber.replace(/\D/g, "");
  const url = `https://wa.me/${number}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = url;
  });

  // Exibe o número formatado no card de contato, se configurado
  if (number.length >= 12) {
    const local = number.slice(2);
    const formatted = `(${local.slice(0, 2)}) ${local.slice(2, -4)}-${local.slice(-4)}`;
    document.querySelectorAll("[data-whatsapp-display]").forEach((el) => {
      el.textContent = formatted;
    });
  }
})();

/* ---------- Header + menu mobile ---------- */
(function setupHeader() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu");
  const desktop = window.matchMedia("(min-width: 1024px)");

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  desktop.addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });
})();

/* ---------- Link ativo no menu conforme a seção visível ---------- */
(function setupActiveLink() {
  if (!("IntersectionObserver" in window)) return;

  const links = new Map();
  document.querySelectorAll('.nav-list a[href^="#"]').forEach((link) => {
    links.set(link.getAttribute("href").slice(1), link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.remove("is-active"));
        const active = links.get(entry.target.id);
        if (active) active.classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
})();

/* ---------- Animações de entrada + botão flutuante ---------- */
(function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => observer.observe(el));
  }

  // WhatsApp flutuante aparece depois que os botões da hero saem da tela
  const floatBtn = document.querySelector(".wa-float");
  const heroActions = document.querySelector(".hero-actions");
  if (floatBtn && heroActions && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      floatBtn.classList.toggle("is-visible", !entry.isIntersecting && entry.boundingClientRect.top < 0);
    }).observe(heroActions);
  } else if (floatBtn) {
    floatBtn.classList.add("is-visible");
  }
})();

/* ---------- Ano no rodapé ---------- */
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});
