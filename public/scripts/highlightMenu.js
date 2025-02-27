document.addEventListener("DOMContentLoaded", function () {
    let currentPage = document.location.pathname.split("/").pop();

    let menuLinks = document.querySelectorAll(".visible-menu a");

    // находим нужную секцию меню(текущую активную)
    menuLinks.forEach(link => {
        // получаем ссылку на каждую секцию меню
        let linkPage = link.getAttribute("href");
        if (currentPage === linkPage) {
            link.classList.add("active-menu-section")
        }
    });
});
