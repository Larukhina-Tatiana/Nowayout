import $ from "jquery";
import TransferElements from "../utils/TransferElements.js";

window.addEventListener("DOMContentLoaded", () => {
  //   // Перемещение элементов в мобильное меню
  //   const mobileMenu = $(".header__mobile-menu")[0];

  //   const mobileMenuTransfers = [
  //     {
  //       source: $(".header__location")[0],
  //       target: mobileMenu,
  //       breakpoint: 1570,
  //       position: 0,
  //       // condition: "min",
  //     },
  //     {
  //       source: $(".header__phone")[0],
  //       target: mobileMenu,
  //       breakpoint: 1570,
  //       position: 1,
  //       // condition: "min",
  //     },
  //     {
  //       source: $(".header__nav-wrapper")[0],
  //       target: mobileMenu,
  //       breakpoint: 1570,
  //       position: 2,
  //       // condition: "min",
  //     },
  //   ];

  //   mobileMenuTransfers.forEach((cfg) => {
  //     if (cfg.source && cfg.target) {
  //       new TransferElements({
  //         sourceElement: cfg.source,
  //         breakpoints: {
  //           [cfg.breakpoint]: {
  //             targetElement: cfg.target,
  //             targetPosition: cfg.position,
  //             condition: cfg.condition,
  //           },
  //         },
  //       });
  //     }
  //   });

  // Перемещение элементов в футере
  const footerTransfers = [
    {
      source: $(".footer__legal")[0],
      target: $(".footer__bottom")[0],
      breakpoint: 768,
      position: 1,
      condition: "min",
    },
    {
      source: $(".footer__social")[0],
      target: $(".footer__bottom")[0],
      breakpoint: 1024,
      position: 2,
      condition: "min",
    },
    {
      source: $(".footer__impressum")[0],
      target: $(".footer__identity")[0],
      breakpoint: 1024,
      position: 1,
      condition: "min",
    },
    {
      source: $(".footer__lang")[0],
      target: $(".footer__main")[0],
      breakpoint: 1024,
      position: 2,
      condition: "min",
    },
  ];

  footerTransfers.forEach((cfg) => {
    if (cfg.source && cfg.target) {
      new TransferElements({
        sourceElement: cfg.source,
        breakpoints: {
          [cfg.breakpoint]: {
            targetElement: cfg.target,
            targetPosition: cfg.position,
            condition: cfg.condition,
          },
        },
      });
    }
  });
});
