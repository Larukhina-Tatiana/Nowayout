document.querySelectorAll(".form__input").forEach((input) => {
  input.addEventListener("blur", () => {
    // console.log(input.value.trim());
    if (input.value.trim() !== "") {
      input.classList.add("has-value");
    } else {
      input.classList.remove("has-value");
    }
  });

  // чтобы сработало при автозаполнении
  if (input.value.trim() !== "") {
    input.classList.add("has-value");
  }
});
