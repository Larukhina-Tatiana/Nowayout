import TransferElements from "./utils/TransferElements";

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

  // Mobile menu logic
  var burgerButton = $(".header__burger");
  var mobileMenu = $(".header__mobile-menu");
  var mobileMenuCloseButton = $(".header__mobile-menu-close");
  var headerLocation = $(".header__location")[0];
  var headerPhone = $(".header__phone")[0];
  var headerNav = $(".header__nav-wrapper")[0];

  if (mobileMenu.length && headerLocation && headerPhone && headerNav) {
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
    console.error(
      "Ошибка: Один или несколько элементов хедера для TransferElements не найдены в DOM"
    );
  }

  function toggleMobileMenu() {
    mobileMenu.toggleClass("is-open");
    $("body").toggleClass("no-scroll");
  }

  if (burgerButton.length) burgerButton.on("click", toggleMobileMenu);
  if (mobileMenuCloseButton.length)
    mobileMenuCloseButton.on("click", toggleMobileMenu);

  $(function () {
    var header = $(".header");

    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 0) {
        header.addClass("is-active");
      } else {
        header.removeClass("is-active");
      }
    });
  });

  function updateRoomsSliderVisibility() {
    const $slider = $("#roomsSlider");
    const $wrapper = $slider.parent();
    const $arrows = $wrapper.find(".slider-nav");

    if ($slider[0].scrollWidth > $wrapper.outerWidth()) {
      $arrows.show();
    } else {
      $arrows.hide();
      $slider.scrollLeft(0);
    }
  }

  $(".slider-nav.next").on("click", function () {
    $("#roomsSlider").animate(
      {
        scrollLeft: $("#roomsSlider").scrollLeft() + 300,
      },
      400
    );
  });

  $(".slider-nav.prev").on("click", function () {
    $("#roomsSlider").animate(
      {
        scrollLeft: $("#roomsSlider").scrollLeft() - 300,
      },
      400
    );
  });

  // вызываем после полной загрузки
  $(window).on("load resize", function () {
    setTimeout(updateRoomsSliderVisibility, 100); // небольшая задержка — на всякий случай
  });
});
