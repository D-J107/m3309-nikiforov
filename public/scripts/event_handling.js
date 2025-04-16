
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
}

const eventSource = new EventSource('items/updates');

eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);

    if (data.type === "created") {
        const newItem = data.item;
        let specialOfferHTML = newItem.specialOffer
            ? `<h4 class="Sale">${newItem.specialOffer}</h4>` 
            : '';
        let discount = newItem.discount
            ? `<h4 class="Discount">-${newItem.discount}%</h4>`
            : '';

        const newProductHTML = `
                        <li class="product-item">
                            <div class="product-image-wrap">
                                <img src="webp-images/${newItem.imagePath}">
                                ${specialOfferHTML}
                                ${discount}
                            </div>
                            <div class="product-title">
                                <p class="product-text-description">${newItem.title}</p>
                            </div>
                            <div class="product-price-and-click-button">
                                <p class="product-text-description">${newItem.price} руб/кг
                                    <a href="payment">
                                        <img class="cart-images" src="images/cart.jpg">
                                    </a>
                                </p>
                        </div>
                        </li>`

        document.querySelector('.product-list .flex-container').insertAdjacentHTML('beforeend', newProductHTML);
        toastr.success(`Внимание! Добавлен новый товар: ${newItem.title}`);
    }

    if (data.type === "updated") {
        const updatedItem = data.item;
        const title = data.previousTitle;
        toastr.warning(`Внимание! Товар ${title} был обновлён`);
        // how to update dom tree ?
        const productElement = document.querySelector(`.product-item[data-title="${title}"]`);
        if (!productElement) {
            console.warn(`❗ Не найден товар с названием "${title}" для обновления.`);
            return
        }

        const specialOfferHTML = updatedItem.specialOffer 
            ? `<h4 class="Sale">${updatedItem.specialOffer}</h4>`
            : '';

        const discountHTML = updatedItem.sale
            ? `<h4 class="Discount">-${updatedItem.discount}%</h4>`
            : '';

        const updatedHTML = `
        <div class="product-image-wrap">
            <img src="webp-images/${updatedItem.imagePath}">
            ${specialOfferHTML}
            ${discountHTML}
        </div>
        <div class="product-title">
            <p class="product-text-description">${updatedItem.title}</p>
        </div>
        <div class="product-price-and-click-button">
            <p class="product-text-description">${updatedItem.price} руб/кг
                <a href="payment">
                    <img class="cart-images" src="images/cart.jpg">
                </a>
            </p>
        </div>
        `
        
        productElement.innerHTML = updatedHTML;
        productElement.setAttribute("data-title", updatedItem.title);
        return
    }

    if (data.type === "deleted") {
        // console.log("data:", data);
        const reason = data.reason;
        const title = data.title;
        toastr.warning(`Внимание! Товар ${title} был удалён по причине: ${reason}`);

        const itemElement = getElementByXpath(`//p[@class='product-text-description' and contains(text(), "${title}")]/../..`);
        if (itemElement) {
            itemElement.singleNodeValue.remove();
        }
        return
    }
}

