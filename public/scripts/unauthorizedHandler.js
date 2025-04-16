document.addEventListener("DOMContentLoaded", () => {
    const protectedLinks = document.querySelectorAll("a[data-protected='true']");

    protectedLinks.forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();

            const targetUrl = link.getAttribute("href");

            try {
                const res = await fetch(targetUrl, {
                    method: "GET",
                    headers: { "Accept": "text/html"}
                });
                if (res.ok) {
                    window.location.href = targetUrl;
                } else {
                    const contentType = res.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await res.json();
                        if (errorData.message === "Пользователь не авторизован") {
                            toastr.error("Авторизуйтесь для доступа к странице!");
                        } else {
                            toastr.error(`Произошла ошибка: ${errorData.message}`);
                        }
                    }
                }
            } catch (err) {
                toastr.error("Произошла ошибка подключения к серверу");
                console.error(`Ошибка при обращении к ${targetUrl}: ${err}`);
            }
        });
    });
});