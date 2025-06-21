$(function () {
  // Отключаем автоматическое восстановление скролла браузером
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const $scrollButton = $("#scroll-toggle");

  function resetScroll() {
    $("html, body").scrollTop(0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function updateScrollButton() {
    const scrollY = $(window).scrollTop();
    const windowHeight = $(window).height();
    const documentHeight = $(document).height();

    if (scrollY > 100) {
      $scrollButton.addClass("visible");
    } else {
      $scrollButton.removeClass("visible");
    }

    if (scrollY < windowHeight / 2 && documentHeight > windowHeight) {
      $scrollButton.addClass("down-arrow");
    } else {
      $scrollButton.removeClass("down-arrow");
    }
  }

  $scrollButton.on("click", function () {
    const isDown = $(this).hasClass("down-arrow");

    $("html, body").animate(
      {
        scrollTop: isDown ? $(document).height() : 0,
      },
      600
    );

    return false;
  });

  // Сброс прокрутки на 0 при разных событиях
  resetScroll();

  $(window).on("load", function () {
    resetScroll();
    $(window).trigger("scroll");
  });

  $(window).on("hashchange", function () {
    if (window.location.hash) {
      setTimeout(function () {
        if ($(window).scrollTop() !== 0) {
          resetScroll();
        }
      }, 50);
    } else {
      resetScroll();
    }
  });

  $(window).on("scroll", updateScrollButton);
  updateScrollButton();
});
