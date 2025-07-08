export default function initScrollToggle(options = {}) {
  const scrollButton = document.getElementById(
    options.buttonId || "scroll-toggle"
  );

  if (!scrollButton) {
    console.warn("🔘 scroll-toggle: кнопка не найдена");
    return;
  }

  const threshold = options.threshold || 100;
  const duration = options.scrollDuration || 600;
  const visibleClass = options.visibleClass || "visible";
  const downArrowClass = options.downArrowClass || "down-arrow";

  const updateButton = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    scrollButton.classList.toggle(visibleClass, scrollY > threshold);
    scrollButton.classList.toggle(
      downArrowClass,
      scrollY < windowHeight / 2 && documentHeight > windowHeight
    );
  };

  const scrollToPosition = () => {
    const documentHeight = document.documentElement.scrollHeight;
    const isDown = scrollButton.classList.contains(downArrowClass);

    window.scrollTo({
      top: isDown ? documentHeight : 0,
      behavior: "smooth",
    });
  };

  scrollButton.addEventListener("click", scrollToPosition);

  window.addEventListener("scroll", updateButton);
  window.addEventListener("resize", updateButton);
  updateButton();
}
// Initialize the scroll toggle functionality
document.addEventListener("DOMContentLoaded", () => {
  initScrollToggle({
    buttonId: "scroll-toggle",
    threshold: 100,
    scrollDuration: 600,
    visibleClass: "visible",
    downArrowClass: "down-arrow",
  });
});
