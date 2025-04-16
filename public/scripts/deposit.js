document.addEventListener("DOMContentLoaded", () => {

  const API_BASE_URL = window.location.origin.includes("localhost")
        ? "http://localhost:3000"
        : "https://m3309-nikiforov.onrender.com";

    const form = document.getElementById("deposit-form");
  
    if (!form) return;
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const depositValue = parseInt(form.deposit.value);
      if (isNaN(depositValue) || depositValue < 1 || depositValue > 9999) {
        toastr.error("Введите сумму от 1 до 9999");
        return;
      }
  
      try {
        // Step 1: Get current user via /me endpoint
        const meRes = await fetch(`${API_BASE_URL}/users/me`);
  
        if (!meRes.ok) {
          toastr.error("Не удалось получить данные пользователя");
          return;
        }
  
        const user = await meRes.json();
        const userId = user.id;
  
        // Step 2: Ask for password confirmation
        const password = prompt("Введите ваш пароль для подтверждения операции:");
  
        if (!password || password.length < 5 || password.length > 12) {
          toastr.error("Неверный пароль или отменено пользователем");
          return;
        }
  
        // Step 3: Send update request with all required fields
        const res = await fetch(`${API_BASE_URL}/users/update/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: user.email,
            password: password,
            deposit: depositValue
          })
        });
  
        if (res.ok) {
          const updatedUser = await res.json();
          toastr.success(`Баланс успешно пополнен. Новый баланс: ${updatedUser.balance} ₽`);
          form.reset();
        } else {
          const error = await res.json();
          toastr.error(error.message || "Не удалось пополнить баланс");
        }
      } catch (err) {
        toastr.error("Ошибка при отправке запроса");
        console.error(err);
      }
    });
  });
  