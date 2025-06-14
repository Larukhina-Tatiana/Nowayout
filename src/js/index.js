import $ from "jquery";
import "../styles/main.scss";
import "./header.js";
import "swiper/swiper.min.css";
import "swiper/modules/navigation.css";

import Swiper from "swiper";
import { Navigation } from "swiper/modules/index.mjs";

// Импортируем все SVG-иконки из директории sprite-icons для генерации спрайта
require.context("../assets/icons/sprite-icons/", false, /\.svg$/);

// Явно импортируем неспрайтовые SVG-файлы, чтобы Webpack их скопировал
// Removed explicit imports for logo.svg, united-kingdom.svg, and germany.svg
// import "../assets/logo/logo.svg";
// import "../assets/icons/united-kingdom.svg";
// import "../assets/icons/germany.svg";

$(function () {
  // Prevent browser from restoring scroll position on refresh
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // Ensure page starts at the very top on DOM ready and after all resources loaded.
  // This uses a robust method to fight browser scroll restoration and ensure scrollTop is 0.
  function resetScroll() {
    $("html, body").scrollTop(0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    console.log(
      "Reset Scroll Function Called. Current scrollTop:",
      $(window).scrollTop()
    );
  }

  // Call on DOM ready
  resetScroll();

  // Call on window load (after all images, etc. are loaded)
  $(window).on("load", function () {
    resetScroll();
    // Manually trigger scroll event after load to set initial state of button
    $(window).trigger("scroll");
  });

  // Additionally, ensure scroll is at top if a hash is present, but then reset if not top
  $(window).on("hashchange", function () {
    if (window.location.hash) {
      // Let default hash behavior occur, then potentially reset
      setTimeout(function () {
        if ($(window).scrollTop() !== 0) {
          resetScroll();
        }
      }, 50);
    } else {
      resetScroll();
    }
  });

  // Здесь будут скрипты для взаимодействия с макетом
  new Swiper(".rooms__cards.swiper", {
    modules: [Navigation],
    slidesPerView: 1,
    spaceBetween: 30,
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

  // Scroll button logic based on provided code
  var scrollButton = $("#scroll-toggle");

  function updateScrollButton() {
    var currentScrollY = $(window).scrollTop();
    var windowHeight = $(window).height();
    var documentHeight = $(document).height();

    // Visibility logic: show if scrolled more than 100px
    if (currentScrollY > 100) {
      scrollButton.addClass("visible");
    } else {
      scrollButton.removeClass("visible");
    }

    // Direction logic: if in top half of view (and page is scrollable), point down; else point up.
    // scroll-arrow.svg points UP by default. 'down-arrow' class rotates it 180deg (points down).
    if (currentScrollY < windowHeight / 2 && documentHeight > windowHeight) {
      scrollButton.addClass("down-arrow"); // Arrow points DOWN
    } else {
      scrollButton.removeClass("down-arrow"); // Arrow points UP
    }
  }

  scrollButton.on("click", function () {
    // If button does NOT have 'down-arrow' class, it means it's pointing UP (default SVG) and should scroll to the top.
    if (!$(this).hasClass("down-arrow")) {
      // Scroll to top
      $("html, body").animate(
        {
          scrollTop: 0,
        },
        600
      );
    } else {
      // If button HAS 'down-arrow' class, it means it's pointing DOWN (rotated SVG) and should scroll to the bottom.
      $("html, body").animate(
        {
          scrollTop: $(document).height(),
        },
        600
      ); // Using $(document).height() for full scroll
    }
    return false;
  });

  $(window).on("scroll", updateScrollButton);
  updateScrollButton(); // Initial call to set state
});
