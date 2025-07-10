import Swiper from "swiper";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

let swipers = {}; // Словарь для хранения экземпляров Swiper

// 🕰 Debounce
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 📐 Получение профиля экрана
function getScreenProfile() {
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const width = window.innerWidth;

  return {
    isLandscape,
    width,
    isMobileLandscape: width <= 425 && isLandscape,
    canInitSwiper: width > 425 || (isLandscape && width > 375),
  };
}

// ⏯ Управление кнопками
function updateNavState(swiper, prevEl, nextEl) {
  if (!swiper) return;
  prevEl?.classList.toggle("hidden", swiper.isBeginning);
  nextEl?.classList.toggle("hidden", swiper.isEnd);
}

/**
 * 🎯 Универсальная инициализация Swiper
 * @param {Object} options - настройки
 * @param {string} options.containerSelector - селектор контейнера swiper
 * @param {string} options.prevSelector - селектор кнопки "назад"
 * @param {string} options.nextSelector - селектор кнопки "вперёд"
 * @param {string} [options.id] - уникальный ключ для хранения экземпляра swiper
 * @param {Function} [options.onReady] - колбэк после инициализации
 */
export function initCustomSwiper({
  containerSelector,
  prevSelector,
  nextSelector,
  id = containerSelector,
  onReady,
}) {
  const container = document.querySelector(containerSelector);
  const wrapper = container?.querySelector(".swiper-wrapper");
  const prevEl = document.querySelector(prevSelector);
  const nextEl = document.querySelector(nextSelector);

  // if (!container || !wrapper || !prevEl || !nextEl) return;
  if (!container || !wrapper || !prevEl || !nextEl) {
    console.warn(`[Swiper] Не найден один из элементов:`, {
      container,
      wrapper,
      prevEl,
      nextEl,
    });
    return;
  }

  const profile = getScreenProfile();
  if (!profile.canInitSwiper) {
    prevEl.classList.add("hidden");
    nextEl.classList.add("hidden");
    wrapper.style.transform = "none";
    return;
  }

  // Удаление старого экземпляра, если есть
  if (swipers[id]) {
    swipers[id].destroy(true, true);
    swipers[id] = null;
  }

  const swiper = new Swiper(container, {
    modules: [Navigation],
    slidesPerView: "auto",
    spaceBetween: 12,
    // allowTouchMove: window.innerWidth > 480,
    allowTouchMove: profile.width > 480,
    navigation: {
      nextEl,
      prevEl,
    },
    on: {
      afterInit(swiper) {
        swiper.update();
        swiper.slideTo(0, 0);
        updateNavState(swiper, prevEl, nextEl);
        if (typeof onReady === "function") onReady(swiper);
      },
      slideChange: () => updateNavState(swiper, prevEl, nextEl),
      resize: () => updateNavState(swiper, prevEl, nextEl),
      reachBeginning: () => updateNavState(swiper, prevEl, nextEl),
      reachEnd: () => updateNavState(swiper, prevEl, nextEl),
      fromEdge: () => updateNavState(swiper, prevEl, nextEl),
    },
  });

  swipers[id] = swiper;

  setTimeout(() => {
    swiper.update();
    updateNavState(swiper, prevEl, nextEl);
  }, 0);
}
