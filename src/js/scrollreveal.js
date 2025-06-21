import ScrollReveal, { reveal } from "scrollreveal";
ScrollReveal({
  distance: "60px",
  duration: 2800,
});

document.querySelectorAll(".rooms__card").forEach((card, index) => {
  card.style.setProperty("--order", index);
});

function ScrollRevealFunc() {
  ScrollReveal().reveal(".rooms", {
    origin: "top",
  });
  ScrollReveal().reveal(".rooms__title", {
    origin: "right",
  });

  // ScrollReveal().reveal(".satisfied, .hero__product", {
  //   origin: "left",
  // });
  ScrollReveal().reveal(".hero", {
    origin: "bottom",
  });
  const cards = document.querySelectorAll(".rooms__card");

  cards.forEach((card, index) => {
    const isEven = index % 2 === 0;

    ScrollReveal().reveal(card, {
      origin: isEven ? "top" : "bottom",
      distance: "60px",
      duration: 400,
      opacity: 0,
      delay: index * 350, // поочерёдный эффект
      easing: "ease-in-out",
      cleanup: true, // чтобы не пересоздавал каждый раз
    });
  });

  // ScrollReveal().reveal(".rooms__card", {
  //   origin: "left",
  // });
}
export default ScrollRevealFunc;
