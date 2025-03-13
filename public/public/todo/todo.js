
import {
    saveTodosIntoLocalStorage,
     getTodosFromLocalStorage,
     getDateRepresentation
    } from "./utils.js";

const addTodoInput = document.querySelector(
    "[data-add-todo-input]"
);
const addTodoBtn = document.querySelector(
    "[data-add-todo-btn]"
);
const searchTodoInput = document.querySelector(
    "[data-search-todo-input]"
);
const todoContainer = document.querySelector(
    "[data-todo-container]"
);
const todoTemplate = document.querySelector(
    "[data-todo-template]"
);

let todoList = getTodosFromLocalStorage();
// используем отдельный массив чтобы никак не влиять на исходный
// массив из localStorage'a
let filteredTodosList = [];

addTodoBtn.addEventListener("click", () => {
    if (addTodoInput.value.trim()) {
        const newTodo = {
            id: Date.now(),
            text: addTodoInput.value.trim(),
            completed: false,
            createdAt: getDateRepresentation(new Date()),
        }
        todoList.push(newTodo);
        addTodoInput.value = "";

        saveTodosIntoLocalStorage(todoList);
        renderTodos();
    }
})

addTodoInput.addEventListener("input", () => {
    if (searchTodoInput.value.trim()) {
        searchTodoInput.value = "";
        renderTodos();
    }
})

const renderFilteredTodos = () => {
    todoContainer.innerHTML = "";

    if (filteredTodosList.length === 0) {
        todoContainer.innerHTML = "<h3>No todos found.</h3>";
        return;
    }

    filteredTodosList.forEach((todo) => {
        const todoElement = createTodoLayout(todo);
        todoContainer.append(todoElement);
    })
}


const renderTodos = () => {
    todoContainer.innerHTML = "";

    if (todoList.length === 0) {
        todoContainer.innerHTML = "<h3>No todos..</h3>";
        return;
    }

    todoList.forEach((todo) => {
        const todoElement = createTodoLayout(todo);
        todoContainer.append(todoElement);
    })
}

searchTodoInput.addEventListener("input", (e) => {
    const searchValue = e.target.value.trim();
    filterAndRenderFilteredTodos(searchValue);
})

const filterAndRenderFilteredTodos = (searchValue) => {
    filteredTodosList = todoList.filter((t) => {
        return t.text.includes(searchValue);
    })
    renderFilteredTodos();
}

const createTodoLayout = (todo) => {
    // получаем темплейт
    const todoElement = document.importNode(todoTemplate.content, true);

    const checkbox = todoElement.querySelector(
        "[data-todo-checkbox]");
    checkbox.checked = todo.completed;

    const todoText = todoElement.querySelector(
        "[data-todo-text]");
    todoText.textContent = todo.text;

    const todoCreatedDate = todoElement.querySelector(
        "[data-todo-date]");
    // todoCreatedDate.textContent =
    //     getDateRepresentation(todo.createdAt);
    todoCreatedDate.textContent = todo.createdAt;

    const removeTodoBtn = todoElement.querySelector(
        "[data-remove-todo-btn]");
    removeTodoBtn.disabled = !todo.completed;

    checkbox.addEventListener("change", (e) => {
        todoList = todoList.map((t) => {
            if (t.id === todo.id) {
                t.completed = e.target.checked;
            }
            return t;
        })
        saveTodosIntoLocalStorage(todoList);

        const searchValue = searchTodoInput.value.trim()
        if (searchValue) {
            filterAndRenderFilteredTodos(searchValue);
        } else {
            renderTodos();
        }

        
    })

    removeTodoBtn.addEventListener("click", () => {
        // filter вернёт список тех todo у которых  не выполнено условие
        // те мы хотим удалить текущий todo, его id будет совпадать с t.id
        todoList = todoList.filter((t) => {
            if (t.id !== todo.id) {
                return t;
            }
        })
        saveTodosIntoLocalStorage(todoList);
        const searchValue = searchTodoInput.value.trim()
        if (searchValue) {
            filterAndRenderFilteredTodos(searchValue);
        } else {
            renderTodos();
        }

    })

    return todoElement;
}

// ну или просто вызываем эту функцию чтобы она вызвалась
// при первом запуске скрипта(те при загрузке страницы)

renderTodos();