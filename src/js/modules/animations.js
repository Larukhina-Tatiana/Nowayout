const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const isTarget = entry.target.classList.contains("gift__img-pic");
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        if (isTarget) entry.target.classList.add("shake-loop");

        // observer.unobserve(entry.target); // если нужно только один раз
        // console.log("✅ Элемент в зоне видимости:", entry.target);
      } else {
        entry.target.classList.remove("in-view");
        if (isTarget) {
          entry.target.classList.remove("shake-loop");
        }
      }
    });
  },
  {
    threshold: 0.2, // чуть раньше
    // rootMargin: "0px 0px -10% 0px", // ещё раньше
  }
);

document.querySelectorAll(".animate-on-scroll").forEach((el) => {
  observer.observe(el);
  console.log("🔍 Наблюдаю:", el);
});
