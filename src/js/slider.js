export function initRoomsSlider() {
  const $slider = $("#roomsSlider");
  const $wrapper = $slider.parent();
  const $prevBtn = $wrapper.find(".slider-nav.prev");
  const $nextBtn = $wrapper.find(".slider-nav.next");

  function updateSliderUI() {
    if (window.innerWidth <= 480) return;

    const scrollLeft = $slider.scrollLeft();
    const maxScroll = $slider[0].scrollWidth - $wrapper.outerWidth();

    if ($slider[0].scrollWidth > $wrapper.outerWidth()) {
      $prevBtn.show();
      $nextBtn.show();
    } else {
      $prevBtn.hide();
      $nextBtn.hide();
      $slider.scrollLeft(0);
      return;
    }

    $prevBtn.prop("disabled", scrollLeft <= 10);
    $nextBtn.prop("disabled", scrollLeft >= maxScroll - 10);
  }

  $nextBtn.on("click", function () {
    $slider.animate(
      { scrollLeft: $slider.scrollLeft() + 300 },
      {
        duration: 500,
        easing: "swing",
        complete: updateSliderUI,
      }
    );
  });

  $prevBtn.on("click", function () {
    $slider.animate(
      { scrollLeft: $slider.scrollLeft() - 300 },
      {
        duration: 500,
        easing: "swing",
        complete: updateSliderUI,
      }
    );
  });

  $(window).on("load resize", () => setTimeout(updateSliderUI, 100));
}
