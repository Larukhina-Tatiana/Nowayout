import $ from "jquery";

$(function () {
  const $header = $(".header");
  const $location = $(".header__location");
  const $locationBtn = $(".header__location-btn");
  const $locationItems = $(".header__location-item");
  const $locationCurrent = $(".header__location-current");

  // Открытие выбора города
  $locationBtn.off("click").on("click", function (e) {
    e.stopPropagation();
    $location.addClass("is-open");
  });

  // Выбор города
  $locationItems.each(function () {
    const location = $(this).data("location");
    $locationCurrent.text(location);
    $location.removeClass("is-open");
  });

  // Клик вне области — закрываем выбор города
  document.addEventListener("pointerdown", (e) => {
    if (!e.target.closest(".header__location")) {
      $location.removeClass("is-open");
    }
  });

  // Добавление класса к шапке при скролле
  $(window).on("scroll", function () {
    $header.toggleClass("is-active", window.scrollY > 0);
  });
});
