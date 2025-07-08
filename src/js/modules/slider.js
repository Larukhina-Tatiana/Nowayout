import Swiper from "swiper";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

let swiper;

export function initRoomsSwiper() {
  if (
    window.innerWidth <= 435 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // отключаем стрелки и transform на мобильных устройствах
    document.querySelector(".slider-nav.prev")?.classList.add("hidden");
    document.querySelector(".slider-nav.next")?.classList.add("hidden");
    const wrapper = document.querySelector(".rooms__cards .swiper-wrapper");
    if (wrapper) wrapper.style.transform = "none";
    return; // слайдер не нужен
  }

  const container = document.querySelector(".rooms__cards.swiper");
  const wrapper = container?.querySelector(".swiper-wrapper");
  const slides = wrapper?.querySelectorAll(".swiper-slide") || [];

  const prev = document.querySelector(".slider-nav.prev");
  const next = document.querySelector(".slider-nav.next");

  if (swiper) {
    swiper.destroy(true, true);
    swiper = null;
  }

  if (!container || !wrapper || slides.length === 0) return;

  const totalWidth = Array.from(slides).reduce(
    (acc, slide) => acc + slide.offsetWidth + 12, // 12 = spaceBetween
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
    swiper.update(); // обновим Swiper
    updateNavState(swiper); // обновим состояние кнопок
  }, 0);
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

window.addEventListener("load", () => {
  const target = document.querySelector(".rooms");
  if (!target) return;

  const observer = new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      initRoomsSwiper(); // запускаем слайдер
      obs.disconnect(); // отключаем слежение
    }
  });

  observer.observe(target);
});

window.addEventListener("resize", () => setTimeout(initRoomsSwiper, 100));

window.addEventListener("orientationchange", () => {
  // Добавляем проверку ширины экрана при изменении ориентации
  if (window.innerWidth > 435) {
    setTimeout(initRoomsSwiper, 100);
  }
});
