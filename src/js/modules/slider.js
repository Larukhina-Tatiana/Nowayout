import Swiper from "swiper";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

let swiper;

function shouldInitSlider() {
  const isWideScreen = window.innerWidth > 425;
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  return isWideScreen || isLandscape;
}

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

export function initRoomsSwiper() {
  const container = document.querySelector(".rooms__cards.swiper");
  const wrapper = container?.querySelector(".swiper-wrapper");
  const slides = wrapper?.querySelectorAll(".swiper-slide") || [];

  const prev = document.querySelector(".slider-nav.prev");
  const next = document.querySelector(".slider-nav.next");

  if (swiper) {
    swiper.destroy(true, true);
    swiper = null;
  }

  if (!shouldInitSlider()) {
    prev?.classList.add("hidden");
    next?.classList.add("hidden");
    if (wrapper) wrapper.style.transform = "none";
    return;
  }

  if (!container || !wrapper || slides.length === 0) return;

  const totalWidth = Array.from(slides).reduce(
    (acc, slide) => acc + slide.offsetWidth + 12,
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

// 📦 Lazy-init через IntersectionObserver
window.addEventListener("load", () => {
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

// 🧭 Слушаем resize
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initRoomsSwiper();
    setTimeout(initRoomsSwiper, 300); // запасной перезапуск
  }, 100);
});

// 📲 И ориентацию
window.addEventListener("orientationchange", () => {
  clearTimeout(resizeTimeout);
  if (swiper) {
    swiper.destroy(true, true);
    swiper = null;
  }

  resizeTimeout = setTimeout(() => {
    initRoomsSwiper();
  }, 150);
});
