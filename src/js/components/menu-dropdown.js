const initMenuDropdown = () => {
  const btn = document.querySelector(".header__menu-link");
  const menu = document.querySelector(".menu-dropdown");
  const menuItems = menu.querySelectorAll('[role="menuitem"]');

  if (!btn || !menu) return;

  const openMenu = () => {
    menu.hidden = false;
    menu.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    if (menuItems.length) menuItems[0].focus();
  };

  const closeMenu = () => {
    menu.hidden = true;
    menu.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    btn.focus();
  };

  const toggleMenu = () => {
    const isOpen = menu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (e) => {
    if (
      menu.classList.contains("is-open") &&
      !menu.contains(e.target) &&
      !btn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!menu.classList.contains("is-open")) return;

    if (e.key === "Escape") {
      closeMenu();
      return;
    }

    const focusedIndex = Array.from(menuItems).indexOf(document.activeElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (focusedIndex + 1) % menuItems.length;
      menuItems[nextIndex].focus();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex =
        (focusedIndex - 1 + menuItems.length) % menuItems.length;
      menuItems[prevIndex].focus();
    }
  });

  // Закрытие при потере фокуса (если кликаешь Tab дальше)
  menu.addEventListener("focusout", (e) => {
    if (!menu.contains(e.relatedTarget) && !btn.contains(e.relatedTarget)) {
      closeMenu();
    }
  });
};

export default initMenuDropdown;
