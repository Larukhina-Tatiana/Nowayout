import "swiper/swiper.min.css";
import "swiper/modules/navigation.css";
import Swiper from "swiper";
import { Navigation } from "swiper/modules/index.mjs";

// Здесь будут скрипты для взаимодействия с макетом
new Swiper(".rooms__cards.swiper", {
  modules: [Navigation],
  slidesPerView: 1,
  spaceBetween: 12,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1200: {
      slidesPerView: 3,
    },
    1600: {
      slidesPerView: 4,
    },
  },
});
