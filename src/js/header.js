$(function () {
  $(".header__location-btn")
    .off("click")
    .on("click", function (e) {
      e.stopPropagation();
      var locationElement = $(this).closest(".header__location");
      locationElement.addClass("is-open");
    });

  $(".header__location-item").on("click", function () {
    var location = $(this).data("location");
    $(this)
      .closest(".header__location")
      .find(".header__location-current")
      .text(location);
    $(this).closest(".header__location").removeClass("is-open");
  });

  // Глобальный обработчик клика для закрытия списка при клике вне его
  $(document).on("click", function (e) {
    // Если клик произошел вне элемента .header__location и его потомков
    if (!$(e.target).closest(".header__location").length) {
      $(".header__location").removeClass("is-open");
    }
  });
});
