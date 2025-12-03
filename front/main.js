// Универсальная функция для работы с формой
function handleFormSubmit(formId, successId, errorId) {
  const form = document.getElementById(formId);
  const formSuccess = document.getElementById(successId);
  const formError = document.getElementById(errorId);

  if (!form || !formSuccess || !formError) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // prevent page reload

    // Скрываем сообщения
    formSuccess.classList.remove("show");
    formError.classList.remove("show");
    document.body.classList.remove("modal-open");

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Приводим agree к 1 или 0
    data.agree = form.elements.agree.checked ? 1 : 0;

    try {
      const response = await fetch("/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Ошибка сервера");
      }

      form.reset();
      formSuccess.classList.add("show");
      document.body.classList.add("modal-open");

      setTimeout(() => {
        formSuccess.classList.remove("show");
        document.body.classList.remove("modal-open");
      }, 5000);
    } catch (error) {
      console.error("Ошибка:", error);
      formError.classList.add("show");
      document.body.classList.add("modal-open");

      setTimeout(() => {
        formError.classList.remove("show");
        document.body.classList.remove("modal-open");
      }, 4000);
    }
  });
}

// Подключаем обработчики к обеим формам
handleFormSubmit("mars-once", "formSuccess", "formError");
handleFormSubmit("mars-once-page", "formSuccessPage", "formErrorPage");

// Оверлей: открытие/закрытие формы в оверлее
const btnCall = document.getElementById("btnCall");
const formOverlay = document.getElementById("formOverlay");
const btnClose = document.getElementById("btnClose");
const navBar = document.getElementById("navbar");

btnCall.addEventListener("click", (e) => {
  e.preventDefault();
  formOverlay.style.display = "flex";
  navBar.style.display = "none";
});

btnClose.addEventListener("click", () => {
  formOverlay.style.display = "none";
  navBar.style.display = "block";
});

formOverlay.addEventListener("click", (e) => {
  if (e.target === formOverlay.querySelector(".overlay-bg")) {
    formOverlay.style.display = "none";
    navBar.style.display = "block";
  }
});
