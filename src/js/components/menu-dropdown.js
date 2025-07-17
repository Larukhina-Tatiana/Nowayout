export default function initDropdownMenus() {
  const dropdowns = document.querySelectorAll(".dropdown-wrapper");

  dropdowns.forEach((wrapper) => {
    const toggle = wrapper.querySelector(".dropdown-toggle");
    const menu = wrapper.querySelector(".menu-dropdown");
    const menuItems = menu.querySelectorAll('[role="menuitem"]');

    if (!toggle || !menu || !menuItems.length) return;
    // Клик на всю область пункта меню
    wrapper.querySelectorAll(".menu-dropdown__item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();

        const link = item.querySelector('[role="menuitem"]');
        if (link) {
          // Обновим текст выбранного города, если нужно
          const current = wrapper.querySelector("[data-current-target]");
          if (current) current.textContent = link.textContent.trim();

          // Закрываем меню
          close();

          // Переход по ссылке, если есть href
          const href = link.getAttribute("href");
          if (href && href !== "#") {
            window.location.href = href;
          }
        }
      });
    });

    const open = () => {
      wrapper.classList.add("active");
      menu.classList.add("is-open");
      menu.classList.remove("is-closing");
      toggle.setAttribute("aria-expanded", "true");
      menuItems.forEach((item) => item.setAttribute("tabindex", "0"));
      menu.removeAttribute("hidden"); // 👈 после is-open
      menuItems[0]?.focus();
    };

    const close = () => {
      wrapper.classList.remove("active");
      menu.classList.remove("is-open");
      menu.classList.add("is-closing");
      toggle.setAttribute("aria-expanded", "false");
      menuItems.forEach((item) => item.setAttribute("tabindex", "-1"));
      toggle.focus();

      // 👇 ждём завершения transition, затем скрываем
      setTimeout(() => {
        menu.setAttribute("hidden", "");
      }, 300); // должно совпадать с transition-duration
    };

    const toggleMenu = () => {
      menu.classList.contains("is-open") ? close() : open();
    };

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    document.addEventListener("click", (e) => {
      if (menu.classList.contains("is-open") && !wrapper.contains(e.target)) {
        close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!menu.classList.contains("is-open")) return;

      const index = Array.from(menuItems).indexOf(document.activeElement);

      if (e.key === "Escape") return close();

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = (index + 1) % menuItems.length;
        menuItems[next]?.focus();
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (index - 1 + menuItems.length) % menuItems.length;
        menuItems[prev]?.focus();
      }
    });

    menu.addEventListener("focusout", (e) => {
      const related = e.relatedTarget;
      if (!related || (!menu.contains(related) && !toggle.contains(related))) {
        close();
      }
    });
  });
}
