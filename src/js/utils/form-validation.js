document.addEventListener("DOMContentLoaded", () => {
  // Получаем все формы на странице
  const forms = document.querySelectorAll("form");
  // Регулярное выражение для проверки email
  const regExpEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Задержка для показа уведомления (мс)
  const NOTIFICATION_DELAY = 5000;
  // Элемент уведомления об успешной отправке
  const notification = document.querySelector(".js-alert");
  // id таймера для скрытия уведомления
  let timeoutId = null;

  // Для каждой формы навешиваем обработчики событий и восстанавливаем данные из localStorage
  forms.forEach((form) => {
    form.addEventListener("submit", handleFormSubmit); // обработка отправки формы
    form.addEventListener("input", () => saveFormData(form)); // сохранение данных при вводе
    restoreFormData(form); // восстановление данных из localStorage
  });

  // Обработка отправки формы
  function handleFormSubmit(event) {
    event.preventDefault(); // отменяем стандартную отправку
    const form = event.target;
    const isNull = checkingForEmpty(form); // проверка на пустые обязательные поля
    const isValid = validateForm(form); // валидация email

    // Если все поля заполнены и email валиден
    if (isValid && !isNull) {
      const formData = new FormData(form);
      form.reset(); // сбрасываем форму
      localStorage.removeItem(form.id); // удаляем сохранённые данные
      showSuccessMessage(); // показываем уведомление об успехе
    }
  }

  // Проверка email на валидность
  function validateForm(form) {
    let isValid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      const parentElem = field.parentNode;
      const errorElem = parentElem.querySelector(".error");
      // Если поле email и оно невалидно — показываем ошибку
      if (field.type === "email" && !regExpEmail.test(field.value.trim())) {
        isValid = false;
        showError(field, errorElem);
      }
    });
    return isValid;
  }

  // Проверка на пустые обязательные поля
  function checkingForEmpty(form) {
    let isNull = false;
    form.querySelectorAll("[required]").forEach((field) => {
      const parentElem = field.parentNode;
      const errorElem = parentElem.querySelector(".error");
      // Если поле пустое — показываем ошибку
      if (field.value.trim() === "") {
        isNull = true;
        showError(field, errorElem);
      }
    });
    return isNull;
  }

  // Показать ошибку для поля
  function showError(field, errorElem) {
    if (errorElem) {
      errorElem.style.opacity = 1;
      field.style.boxShadow = "rgb(255 6 6) 0px 0px 4px";
      // Скрыть ошибку при следующем вводе
      const onErrorsInput = () => {
        errorElem.style.opacity = 0;
        field.style.boxShadow = "none";
        field.removeEventListener("input", onErrorsInput);
      };
      field.addEventListener("input", onErrorsInput);
    }
  }

  // Сохраняем данные формы в localStorage
  function saveFormData(form) {
    const formData = {};
    new FormData(form).forEach((value, key) => {
      formData[key] = value;
    });
    localStorage.setItem(form.id, JSON.stringify(formData));
  }

  // Восстанавливаем данные формы из localStorage
  function restoreFormData(form) {
    const savedData = localStorage.getItem(form.id);
    if (savedData) {
      const formData = JSON.parse(savedData);
      Object.entries(formData).forEach(([key, value]) => {
        const field = form.elements[key];
        if (field) {
          field.value = value;
          // Добавляем класс, если поле не пустое (для label)
          if (value.trim() !== "") {
            field.classList.add("has-value");
          }
        }
      });
    }
  }

  // Показать уведомление об успешной отправке
  function showSuccessMessage() {
    notification.style.transform = "translate(0%, 0%)";
    notification.addEventListener("click", hideNotification);
    timeoutId = setTimeout(hideNotification, NOTIFICATION_DELAY);
  }

  // Скрыть уведомление
  function hideNotification() {
    notification.style.transform = "translateX(-100vw)";
    notification.removeEventListener("click", hideNotification);
    clearTimeout(timeoutId);
  }
});

/*
email — проверка по блюру 
паспорт — проверка по input
незаполненные поля — по submit
*/
