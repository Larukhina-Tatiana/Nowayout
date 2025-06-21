import TransferElements from "../utils/TransferElements.js";
$(function () {
  const $burger = $(".burger");
  const $mobileMenu = $(".header__mobile-menu");
  let busy = false;

  function openMenu() {
    $burger.addClass("active");
    $mobileMenu.addClass("active");
    $("body").addClass("locked");
  }

  function closeMenu() {
    $burger.removeClass("active");
    $mobileMenu.removeClass("active");
    $("body").removeClass("locked");
  }

  function toggleMenu() {
    if (busy) return;
    busy = true;

    const isActive = $burger.hasClass("active");

    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }

    setTimeout(() => {
      busy = false;
    }, 300);
  }

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

  // Обработчики
  $burger.off("click").on("click", toggleMenu);
});
