import { initCustomSwiper } from "../components/initCustomSwiper.js";

// 📐 Получение профиля экрана
function getScreenProfile() {
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const width = window.innerWidth;

  return {
    isLandscape,
    width,
    isMobileLandscape: width <= 425 && isLandscape,
  };
}

// 🕰 Debounce
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 🎯 Настройка Swiper для блока .rooms
function setupRoomsSwiper() {
  initCustomSwiper({
    containerSelector: ".rooms__cards.swiper",
    prevSelector: ".slider-nav.prev",
    nextSelector: ".slider-nav.next",
    id: "roomsSwiper",
  });
}

// 🔁 Обновление body class при повороте экрана
function updateBodyOrientationClass() {
  const profile = getScreenProfile();
  document.body.classList.toggle(
    "is-landscape-narrow",
    profile.isMobileLandscape
  );
}

// 💡 Ленивый запуск при появлении .rooms
window.addEventListener("load", () => {
  const target = document.querySelector(".rooms");
  if (!target) return;

  const observer = new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      setupRoomsSwiper();
      updateBodyOrientationClass();
      obs.disconnect(); // запускаем один раз
    }
  });

  observer.observe(target);
});

// 📲 🔁 Адаптация при изменении размеров и повороте
const handleViewportChange = debounce(() => {
  updateBodyOrientationClass();
  setupRoomsSwiper();
}, 150);

window.addEventListener("resize", handleViewportChange);
window.addEventListener("orientationchange", handleViewportChange);

export function initRoomsSwiper() {
  setupRoomsSwiper();
  updateBodyOrientationClass();
}
