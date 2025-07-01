import $ from "jquery";
import TransferElements from "../utils/TransferElements.js";
window.addEventListener("DOMContentLoaded", () => {
  // Перемещение элементов в мобильное меню
  const burgerExists = $(".burger").length > 0;

  const mobileMenu = $(".header__mobile-menu");
  const headerLocation = $(".header__location")[0];
  const headerPhone = $(".header__phone")[0];
  const headerNav = $(".header__nav-wrapper")[0];

  if (
    burgerExists &&
    mobileMenu.length &&
    headerLocation &&
    headerPhone &&
    headerNav
  ) {
    new TransferElements(
      {
        sourceElement: headerLocation,
        breakpoints: {
          1570: {
            targetElement: mobileMenu[0],
            targetPosition: 0,
          },
        },
      },
      {
        sourceElement: headerPhone,
        breakpoints: {
          1570: {
            targetElement: mobileMenu[0],
            targetPosition: 1,
          },
        },
      },
      {
        sourceElement: headerNav,
        breakpoints: {
          1570: {
            targetElement: mobileMenu[0],
            targetPosition: 2,
          },
        },
      }
    );
  } else {
    console.error("❌ Не найдены элементы для TransferElements");
  }

  // Перемещение элементов в футере

  // Получаем DOM-элементы
  const footerLegal = $(".footer__legal")[0];
  const footerBottom = $(".footer__bottom")[0];
  const footerSocial = $(".footer__social")[0];
  const footerImpressum = $(".footer__impressum")[0];
  const footerIdentity = $(".footer__identity")[0];
  const footerLang = $(".footer__lang")[0];
  const footerMain = $(".footer__main")[0];

  // Проверяем и отдельно инициализируем каждый перемещаемый элемент
  if (footerLegal && footerBottom) {
    new TransferElements({
      sourceElement: footerLegal,
      breakpoints: {
        768: {
          targetElement: footerBottom,
          targetPosition: 1,
          condition: "min",
        },
      },
    });
  }

  if (footerSocial && footerBottom) {
    new TransferElements({
      sourceElement: footerSocial,
      breakpoints: {
        1024: {
          targetElement: footerBottom,
          targetPosition: 2,
          condition: "min",
        },
      },
    });
  }

  if (footerImpressum && footerIdentity) {
    new TransferElements({
      sourceElement: footerImpressum,
      breakpoints: {
        1024: {
          targetElement: footerIdentity,
          targetPosition: 1,
          condition: "min",
        },
      },
    });
  }

  if (footerLang && footerMain) {
    new TransferElements({
      sourceElement: footerLang,
      breakpoints: {
        1024: {
          targetElement: footerMain,
          targetPosition: 2,
          condition: "min",
        },
      },
    });
  }
});
