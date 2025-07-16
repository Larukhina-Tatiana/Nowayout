document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const location = document.querySelector(".header__location");
  const locationBtn = document.querySelector(".header__location-btn");
  const locationCurrent = document.querySelector(".header__location-current");

  if (!header || !location || !locationBtn || !locationCurrent) return;

  // Открытие/закрытие выбора города по клику на текущий город
  locationBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    // Если уже открыт — закрываем
    if (location.classList.contains("is-open")) {
      location.classList.remove("is-open");
      location.setAttribute("aria-expanded", "false");
    } else {
      location.classList.add("is-open");
      location.setAttribute("aria-expanded", "true");
    }
  });

  // Выбор города (делегирование)
  location.addEventListener("click", (e) => {
    const item = e.target.closest(".header__location-item");
    if (item) {
      locationCurrent.textContent = item.dataset.location;
      location.classList.remove("is-open");
      location.setAttribute("aria-expanded", "false");
    }
  });

  // Клик вне области — закрываем выбор города
  document.addEventListener("pointerdown", (e) => {
    if (!e.target.closest(".header__location")) {
      location.classList.remove("is-open");
      location.setAttribute("aria-expanded", "false");
    }
  });

  // Закрытие по ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      location.classList.remove("is-open");
      location.setAttribute("aria-expanded", "false");
    }
  });

  // Добавление класса к шапке при скролле
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-active", window.scrollY > 0);
  });
});
