import $ from "jquery";
$(function () {
  const $burger = $(".burger-btn");
  const $mobileMenu = $(".burger");
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
