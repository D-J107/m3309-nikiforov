document.addEventListener('DOMContentLoaded', function() {

    const API_BASE_URL = window.location.origin.includes("localhost")
        ? "http://localhost:3000"
        : "https://m3309-nikiforov.onrender.com";

    const userMessage = document.getElementById("user-message");
    const logoutButton = document.getElementById("logout-btn");

    const loginShowButton = document.getElementById('login-show');
    const loginModal = document.getElementById('login-modal');

    const registerShowButton = document.getElementById('register-show');
    const registerModal = document.getElementById('register-modal');

    // открытие
    function showModal(modal) {
        modal.classList.remove('hide');
        modal.classList.add('show');
    }
    // smooth закрытие
    function hideModal(modal) {
        modal.classList.remove('show');
        modal.classList.add('hide');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
    }

    


    logoutButton.addEventListener('click', async function () {
        try {
            await fetch(`${API_BASE_URL}/users/logout`, {method: 'POST' });

            localStorage.removeItem("user");
            // прячу сообщение о том что пользователь вошел в систему
            userMessage.textContent = "";
            userMessage.style.display = "none";
            logoutButton.style.display = "none";

            // снова показываю кнопку регистрации/логина
            loginShowButton.style.display = "inline";
            registerShowButton.style.display = "inline";

            window.location.reload(); 
        } catch (error) {
            console.error("Error logging out", error);
        }
    });

    function hideLogRegButtonsAndShowAuthorized(username) {
        loginShowButton.style.display = "none";
        registerShowButton.style.display = "none";
        
        userMessage.textContent = `Вы вошли в систему как ${username}`;
        userMessage.style.display = "inline";
        logoutButton.style.display = "inline";
    }

    
    // Открытие блоков при нажатии на кнопки Регистрация или Логин
    // Изменения:
    loginShowButton.addEventListener('click', function() {
        loginModal.style.display = 'flex';
        setTimeout(() => showModal(loginModal), 100);
    });
    registerShowButton.addEventListener('click', function() {
        registerModal.style.display = 'flex';
        setTimeout(() => showModal(registerModal), 100);
    });
    //


    // Закрытие блоков на нажатие кнопки X
    document.getElementById("close-login").addEventListener('click', function() {
        hideModal(loginModal);
    });
    document.getElementById("close-register").addEventListener('click', function() {
        hideModal(registerModal);
    });
    //

    function showSnackbar(message, goodOrBad) {
        var x = document.getElementById("snackbar");
        x.className = "show";
        x.textContent = message;
        x.classList.remove("bad");
        x.classList.remove("good");
        x.classList.add(goodOrBad);
        setTimeout(function() {
            x.className = x.className.replace("show", "");
        }, 3000);
    }

    // Плавное закрытие формы после успешной регистрации или логина
    function handleSuccessfullAction(modal, message) {
        showSnackbar(message, "good");
        hideModal(modal);
    }
    

    { // login logic
        const mailInput = document.getElementById('log-email-input');
        const pwdInput = document.getElementById('log-pwd-input');
        const submitButton = document.getElementById('login-btn');
        
        submitButton.addEventListener('click', async function(event) {
            event.preventDefault();
            const email = mailInput.value.trim();
            const password = pwdInput.value.trim();

            if (!email) {
                alert('⚠ Поле email не должно быть пустым!');
                return;
            }
            if (!password) {
                alert('⚠ Поле password не должно быть пустым!');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/users/login`, {
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    body: JSON.stringify({email, password})
                })

                const data = await response.json();

                if (response.status === 201) {
                    handleSuccessfullAction(loginModal, "Successfully logged in.");
                    hideLogRegButtonsAndShowAuthorized(data.user.username);
                    localStorage.setItem("user", JSON.stringify(data.user));
                } else if (response.status === 401) {
                    showSnackbar("User account with such credentials does not exist!", "bad");
                } else {
                    showSnackbar("Sorry, our service is currently ofline. Try again later.", "bad");
                    console.log(response.status);
                }
            } catch (error) {
                showSnackbar("Network error, try again later.", "bad");
                console.log("Network error:", error)
            }
        });
    } // /logic logic 

    {   // register logic
        const usernameInput = document.getElementById('reg-username-input');
        const passwordInput = document.getElementById('reg-password-input');
        const emailInput = document.getElementById('reg-email-input');
        const submitButton = document.getElementById('reg-btn');

        submitButton.addEventListener('click', async function(event) {
            event.preventDefault();
            username = usernameInput.value.trim();
            password = passwordInput.value.trim();
            email = emailInput.value.trim();
            if (!username) {
                alert('⚠ Поле event не должно быть пустым!');
                return;
            }
            if (!password) {
                alert('⚠ Поле title не должно быть пустым!');
                return;
            }
            if (!email) {
                alert('⚠ Поле id не должно быть пустым!');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/users/register`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username, password, email})
                });

                if (response.status === 201) {
                    handleSuccessfullAction(registerModal, "Successfully registered new account!");
                    hideLogRegButtonsAndShowAuthorized(username);
                    localStorage.setItem("user", JSON.stringify(data.user)); // сохраняем сессию пользователя в локальное хранилище
                } else if (response.status === 409) {
                    console.log("Already registered!");
                    showSnackbar("User account already registered!", "bad");
                } else {
                    showSnackbar("Sorry, out service is currently offline. Try again later.", "bad");
                }
            } catch (error) {
                showSnackbar("Network error, try again later.", "bad");
                console.log("Network error:", error)
            }
        });
    } // / register logic


    function checkSession() {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            const user = JSON.parse(savedUser);
            hideLogRegButtonsAndShowAuthorized(user.username); 
        } else { 
            // иначе запрашиваем у сервера залогинен ли юзер
            fetch(`${API_BASE_URL}/users/check-session`, {method: 'POST'})
                .then(response => response.json())
                .then(data => {
                    if (data.isLoggenIn) {
                        localStorage.setItem("user", JSON.stringify(data.user));
                        hideLogRegButtonsAndShowAuthorized(data.user.username);
                    }
                })
                .catch(error => console.error("Error checking session", error));
        }
    }

    checkSession(); // проверяем наличие сессии после загрузки страницы
});

