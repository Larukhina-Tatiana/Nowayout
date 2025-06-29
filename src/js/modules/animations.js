const content = document.querySelector(".scroll-content");
document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const isTarget = entry.target.classList.contains("shake");

        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          if (isTarget) {
            setupShakeLoop(entry.target);
          } else {
            clearShakeLoop(entry.target);
          }

          // observer.unobserve(entry.target); // если нужно только один раз
          // // console.log("✅ Элемент в зоне видимости:", entry.target);
        } else {
          entry.target.classList.remove("in-view");
          if (isTarget) {
            entry.target.classList.remove("shake-loop");
          }
        }
      });
    },
    {
      root: content,
      threshold: 0.2, // чуть раньше
      // rootMargin: "0px 0px -10% 0px", // ещё раньше
    }
  );

  function setupShakeLoop(el) {
    if (el.dataset.shaking === "true") return; // уже запущено

    el.dataset.shaking = "true"; // маркер
    const intervalId = setInterval(() => {
      if (!el.classList.contains("in-view")) return;
      el.classList.add("shake-loop");
      setTimeout(() => el.classList.remove("shake-loop"), 1200); // длительность анимации
    }, 3000); // каждые 5 секунд

    el.dataset.shakeInterval = intervalId;
  }

  function clearShakeLoop(el) {
    const id = el.dataset.shakeInterval;
    if (id) clearInterval(id);
    el.dataset.shaking = "false";
  }

  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el);
  });
});
