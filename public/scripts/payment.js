document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = window.location.origin.includes("localhost")
        ? "http://localhost:3000"
        : "https://m3309-nikiforov.onrender.com";

    const passwordInput = document.getElementById('password');
    const confirmBtn = document.getElementById('confirm-purchase');

    if (!passwordInput || !confirmBtn) return;
    
    confirmBtn.addEventListener('click', async () => {
        const password = passwordInput.value;
        const itemId = +confirmBtn.dataset.itemId;
        const user = window.currentUser;
        const userId = user?.id;
        if (!userId) {
            toastr.error("Вы не авторизованы!");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/auth/validate-password`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password })
            });

            const result = await res.json();

            if (!res.ok) {
                toastr.error(result.message  || 'Неверный пароль!');
                return;
            }

            const purchaseResponse = await fetch(`${API_BASE_URL}/purchases`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, itemId })
            });

            const purchaseResult = await purchaseResponse.json();

            if (purchaseResponse.ok) {
                toastr.success(`Покупка завершена успешно! ID покупки: ${purchaseResult.id}`);
                setTimeout(() => window.location.href = '/catalogue', 2000);
            } else {
                toastr.error(purchaseResult.message || 'Ошибка при покупке!');
            }
        } catch(err) {
            toastr.error(`Произошла ошибка: ${err}`);
            console.error(err);
        }
    });
});