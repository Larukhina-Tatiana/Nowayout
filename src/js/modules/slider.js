import Swiper from "swiper";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

let swiper;
let resizeTimeout;

// 📐 Контекст экрана
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

// ⏯ Обновление состояния кнопок
function updateNavState(swiper) {
  const prev = document.querySelector(".slider-nav.prev");
  const next = document.querySelector(".slider-nav.next");

  if (!swiper) return;

  swiper.isBeginning
    ? prev?.classList.add("hidden")
    : prev?.classList.remove("hidden");

  swiper.isEnd
    ? next?.classList.add("hidden")
    : next?.classList.remove("hidden");
}

// 🚀 Запуск Swiper
export function initRoomsSwiper() {
  const container = document.querySelector(".rooms__cards.swiper");
  const wrapper = container?.querySelector(".swiper-wrapper");
  const slides = wrapper?.querySelectorAll(".swiper-slide") || [];

  const prev = document.querySelector(".slider-nav.prev");
  const next = document.querySelector(".slider-nav.next");

  const profile = getScreenProfile();

  if (!profile.canInitSwiper) {
    prev?.classList.add("hidden");
    next?.classList.add("hidden");
    if (wrapper) {
      wrapper.style.transform = "none";
    }
    return;
  }

  if (!container || !wrapper || slides.length === 0) return;

  if (swiper) {
    swiper.destroy(true, true);
    swiper = null;
  }

  const totalWidth = Array.from(slides).reduce(
    (acc, slide) => acc + slide.offsetWidth + 12, // spaceBetween
    0
  );
  const visibleWidth = container.offsetWidth;
  const fitsWithoutScroll = totalWidth <= visibleWidth + 1;

  if (fitsWithoutScroll) {
    prev?.classList.add("hidden");
    next?.classList.add("hidden");
    wrapper.style.transform = "none";
    return;
  } else {
    prev?.classList.remove("hidden");
    next?.classList.remove("hidden");
  }

  swiper = new Swiper(container, {
    modules: [Navigation],
    slidesPerView: "auto",
    spaceBetween: 12,
    allowTouchMove: window.innerWidth > 480,
    navigation: {
      nextEl: next,
      prevEl: prev,
    },
    on: {
      afterInit(swiper) {
        swiper.update();
        swiper.slideTo(0, 0);
        updateNavState(swiper);
      },
      slideChange: updateNavState,
      resize: updateNavState,
      reachBeginning: updateNavState,
      reachEnd: updateNavState,
      fromEdge: updateNavState,
    },
  });

  setTimeout(() => {
    swiper.update();
    updateNavState(swiper);
  }, 0);
}

// 🕵️ Проверка при загрузке
window.addEventListener("load", () => {
  const profile = getScreenProfile();

  if (profile.isMobileLandscape) {
    document.body.classList.add("is-landscape-narrow");
  } else {
    document.body.classList.remove("is-landscape-narrow");
  }

  const target = document.querySelector(".rooms");
  if (!target) return;

  const observer = new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      initRoomsSwiper();
      obs.disconnect();
    }
  });

  observer.observe(target);
});

// 🔁 Обработка resize
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initRoomsSwiper();
  }, 150);
});

// 📲 Реакция на поворот экрана
window.addEventListener("orientationchange", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const profile = getScreenProfile();

    if (profile.isMobileLandscape) {
      document.body.classList.add("is-landscape-narrow");
    } else {
      document.body.classList.remove("is-landscape-narrow");
    }

    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }

    if (profile.canInitSwiper) {
      initRoomsSwiper();
    } else {
      const wrapper = document.querySelector(".rooms__cards .swiper-wrapper");
      document.querySelector(".slider-nav.prev")?.classList.add("hidden");
      document.querySelector(".slider-nav.next")?.classList.add("hidden");
      if (wrapper) wrapper.style.transform = "none";
    }
  }, 150);
});
