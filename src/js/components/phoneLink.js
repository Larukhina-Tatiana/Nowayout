export default function initPhoneClickFallback() {
  document.addEventListener("DOMContentLoaded", () => {
    const svgIcon = document.querySelector(".header__icon");
    const hiddenPhoneLink = document.querySelector(".header__phone-link");

    if (!svgIcon || !hiddenPhoneLink) return;

    const phoneHref = hiddenPhoneLink.getAttribute("href");

    // Проверим, действительно ли ссылка скрыта (можно по стилям или media query)
    const isLinkHidden = () => {
      const styles = window.getComputedStyle(hiddenPhoneLink);
      return (
        styles.opacity === "0" ||
        styles.width === "0px" ||
        styles.display === "none" ||
        styles.pointerEvents === "none"
      );
    };

    if (isLinkHidden()) {
      svgIcon.style.cursor = "pointer";

      svgIcon.addEventListener("click", () => {
        console.log("click");
        hiddenPhoneLink.click();
      });
    }
  });
}
