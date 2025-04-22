
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

    

    // logout logic
    logoutButton.addEventListener('click', async function () {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include', // хз почему так но ГПТ пишет что важно
            });

            localStorage.removeItem("username");
            
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
    // </logout>

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
        // x.textContent = message;
        x.innerHTML = message.replace(/\n/g, "<br>");
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
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    body: JSON.stringify({email, password})
                })

                const data = await response.json();
                // console.log("loginRegister.js login data:",data);
                // console.log("loginRegister.js login data.username:",data.username);
                // console.log("loginRegister.js login JSON.stringify(data.username):",JSON.stringify(data.username));

                if (response.status === 200) {
                    handleSuccessfullAction(loginModal, "Successfully logged in.");
                    hideLogRegButtonsAndShowAuthorized(data.username);
                    localStorage.setItem("username", JSON.stringify(data.username));
                } else {
                    let messageString = data.message;
                    showSnackbar(messageString, "bad");
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
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username, password, email})
                });
                const data = await response.json();

                if (response.status === 201) {
                    handleSuccessfullAction(registerModal, "Successfully registered new account!");
                    hideLogRegButtonsAndShowAuthorized(username);
                    localStorage.setItem("username", JSON.stringify(data.username));
                } else {
                    let messageString = data.message;
                    showSnackbar(messageString, "bad");
                }
            } catch (error) {
                showSnackbar("Network error, try again later.", "bad");
                console.log("Network error:", error)
            }
        });
    } // / register logic


    function checkSession() {
        const savedUsername = localStorage.getItem("username");

        if (savedUsername) {
            console.log("checkSession saved user", savedUsername)
            const username = JSON.parse(savedUsername);
            hideLogRegButtonsAndShowAuthorized(username); 
        } 
    }

    checkSession(); // проверяем наличие сессии после загрузки страницы
});
