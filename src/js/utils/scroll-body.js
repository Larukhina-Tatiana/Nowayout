document.addEventListener("DOMContentLoaded", function () {
  const content = document.querySelector(".scroll-content");
  const thumb = document.querySelector(".thumb");
  const scrollbar = document.querySelector(".scrollbar");

  let isDragging = false;
  let startY, startScrollTop;

  // ✅ Перенесено вне updateThumb
  thumb.addEventListener("mousedown", (e) => {
    isDragging = true;
    startY = e.clientY;
    startScrollTop = content.scrollTop;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const deltaY = e.clientY - startY;

    const contentHeight = content.scrollHeight;
    const visibleHeight = content.clientHeight;
    const scrollable = contentHeight - visibleHeight;

    const thumbHeight = thumb.offsetHeight;
    const trackHeight = visibleHeight - thumbHeight;

    const scrollRatio = scrollable / trackHeight;

    content.scrollTop = startScrollTop + deltaY * scrollRatio;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "";
  });

  const updateThumb = () => {
    const contentHeight = content.scrollHeight;
    const visibleHeight = content.clientHeight;
    const maxThumbHeight = 90;

    const thumbHeight = Math.min(
      (visibleHeight / contentHeight) * visibleHeight,
      maxThumbHeight
    );
    thumb.style.height = `${thumbHeight}px`;

    if (contentHeight > visibleHeight) {
      const scrollable = contentHeight - visibleHeight;
      const scrollRatio = content.scrollTop / scrollable;
      const thumbTop = scrollRatio * (visibleHeight - thumbHeight);
      thumb.style.transform = `translateY(${thumbTop}px)`;
    } else {
      thumb.style.transform = `translateY(0px)`;
    }
  };

  content.addEventListener("scroll", updateThumb);
  window.addEventListener("resize", updateThumb);
  updateThumb();
});
