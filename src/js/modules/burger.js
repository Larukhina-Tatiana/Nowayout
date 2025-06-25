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

  // Обработчики
  $burger.off("click").on("click", toggleMenu);
});
