let nav = document.querySelector('.nav');
let vMenu = document.querySelector('.visible-menu');
let hMenu = document.querySelector('.hidden-menu');
let burger = document.querySelector('.burger');
let burgerCount = document.querySelector('.burger-count');
breaks = [];

function updateNav() {
    // ширина всего меню
    let navWidth = burger.classList.contains('hidden') 
            ? nav.offsetWidth : nav.offsetWidth - burger.offsetWidth;
    let vMenuWidth = vMenu.offsetWidth; // ширина видимого меню
    // в чем идея - если ширина видимого меню больше чем может 
    // позволить себе nav (например на маленьком экране - телефоне)
    // то сохраняем то что не влезло в скрытое меню которое будет
    // вылазить не горизонтально а вертикально
    if (vMenuWidth > navWidth) {
        breaks.push(vMenuWidth); // сохраняем ширину при кой произошел разрыв
        hMenu.prepend(vMenu.lastElementChild) // добавляем последний элем не вошедший в видимое меню
        burger.classList.remove('hidden'); // теперь уже hidden не относится к burger'u
        burgerCount.innerText = breaks.length; // понятно, задаем текст как длина скрытого массива
        updateNav(); // опять же вызываем эту функцию чтобы она регулярно обновляла отображение меню
    } else {
        // если ширина всего меню больше чем последнее значение при котором
        // произошёл разрыв
        if (navWidth > breaks[breaks.length - 1]) {
            // переносим значение из невидимого меню в видимое
            breaks.pop();
            vMenu.append(hMenu.firstElementChild);
            burgerCount.innerText = breaks.length;
        }
        // закончились скрытые пункты
        if (breaks.length < 1) {
            burger.classList.add('hidden');
            hMenu.classList.remove('active');
        }
    }
}

burger.addEventListener('click', function() {
    // toggle это как XOR - если есть такой класс то удаляет
    // если нет то добавляет
    hMenu.classList.toggle('active');
    burger.classList.toggle('active');

})

window.addEventListener('resize', updateNav);
// вызываем как только пользователь зашёл на страничку
document.addEventListener('DOMContentLoaded', updateNav);

