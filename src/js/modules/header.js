$(function () {
  // Обработка выбора города
  $(".header__location-btn")
    .off("click")
    .on("click", function (e) {
      e.stopPropagation();
      $(this).closest(".header__location").addClass("is-open");
    });

  $(".header__location-item").on("click", function () {
    const location = $(this).data("location");
    $(this)
      .closest(".header__location")
      .find(".header__location-current")
      .text(location);
    $(this).closest(".header__location").removeClass("is-open");
  });

  // Клик вне области — закрываем выбор города
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".header__location").length) {
      $(".header__location").removeClass("is-open");
    }
  });

  // Поведение при скролле: добавление класса к шапке
  const header = $(".header");
  $(window).on("scroll", function () {
    header.toggleClass("is-active", $(window).scrollTop() > 0);
  });
});
