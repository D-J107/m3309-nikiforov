const API_BASE_URL = window.location.origin.includes("localhost")
        ? "http://localhost:3000"
        : "https://m3309-nikiforov.onrender.com";


document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("uploadButton")?.addEventListener("click", uploadProduct);
    document.getElementById("deleteButton")?.addEventListener("click", deleteProduct);
    document.getElementById("updateButton")?.addEventListener("click", updateProduct);
    document.getElementById("getAllButton")?.addEventListener("click", getAllProducts);

    const buttons = document.querySelectorAll(".menu-button");
    const forms = document.querySelectorAll(".admin-form");

    // Show relevant form when menu button is clicked
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            forms.forEach(form => form.classList.add("hidden"));
            document.getElementById(button.dataset.form).classList.remove("hidden");
        });
    });
});

// 1. Upload Product
async function uploadProduct() {
    const fileInput = document.getElementById("addImage");
    const titleInput = document.getElementById("addTitle");
    const priceInput = document.getElementById("addPrice");

    if (!fileInput.files.length || !titleInput.value || !priceInput.value) {
        toastr.error("❌ Заполните все поля!");
        return;
    }

    const title = titleInput.value;
    const price = parseFloat(priceInput.value);

    if (isNaN(price) || price <= 0) {
        toastr.error("Цена должна быть положительным числом!");
        return;
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("title", title);
    formData.append("price", price);

    let response = await fetch(`${API_BASE_URL}/items/upload`, {
        method: 'POST',
        body: formData
    });
    
    if (response.ok) {
        toastr.success("✅ Товар добавлен!");
    } else if (response.status === 415) {
        toastr.error(`❌ Неправильный формат файла.`);
    } else {
        toastr.error(`❌ Ошибка: ${response.error}`);
    }
}

// 2. Delete Product
async function deleteProduct() {
    const id = document.getElementById("deleteIdentifier").value;
    const reason = document.getElementById("deleteReason").value;
    if (!id) return alert("❌ Введите идентификатор!");
    if (!reason) return alert("❌ Введите причину удаления предмета!");

    console.log("admin_panel.js reason:", reason); // non undefined output, example: "123"
    

    const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string)
    if (isNumeric(id)) {
        response = await fetch(`${API_BASE_URL}/items/delete/${id}`, {
             method: "DELETE",
             body: JSON.stringify({reason}),
             headers: {
                "Content-Type": "application/json"
             }
            });
    } else {
        const title = id;
        response = await fetch(`${API_BASE_URL}/items/delete/title/${title}`, {
            method: "DELETE",
            body: JSON.stringify({reason}),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    
    
    if (response.ok) {
        toastr.success("✅ Товар удалён!");
    } else {
        toastr.error(`❌ Ошибка: ${response.message || response.error || 'Неизвестная ошибка'}`);
    }
}

// 3. Update Product
async function updateProduct() {

    function appendIfExists(formdata, key, value) {
        if (value !== null && value !== undefined && value !== "") {
            formdata.append(key, value);
        }
    }

    const id = document.getElementById("updateId").value;
    const formData = new FormData();
    if (!id) return alert("❌ Введите ID!");

    appendIfExists(formData, "title", document.getElementById("updateTitle").value);
    appendIfExists(formData, "price", document.getElementById("updatePrice").value);
    appendIfExists(formData, "specialOffer", document.getElementById("updateSpecialOffer").value);
    appendIfExists(formData, "discount", document.getElementById("updateDiscount").value);

    if (document.getElementById("updateImage").files.length > 0) {
        formData.append("image", document.getElementById("updateImage").files[0]);
    }

    // console.log("admin_panel.js formData:", formData);

    const response = await fetch(`http://localhost:3000/items/update/${id}`, {
        method: "PUT",
        body: formData,
    });

    console.log("admin_panel.js response:", response);
    
    if (response.ok) {
        toastr.success("✅ Товар обновлен!");
    } else {
        toastr.error(`❌ Ошибка: ${response.error}`);
    }
}

// 4. Get All Products
async function getAllProducts() {
    const response = await fetch("http://localhost:3000/items/get");
    const products = await response.json();

    const list = document.getElementById("productList");
    list.innerHTML = products.map(item => `<li>${item.id}: ${item.title}, ${item.price} руб. ${item.specialOffer ? `🎉 ${item.specialOffer}` : ''} ${item.discount ? `🔥 -${item.discount}%` : ''}</li>`).join("");
}
