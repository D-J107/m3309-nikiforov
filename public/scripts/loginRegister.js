document.addEventListener('DOMContentLoaded', function() {
    const loginShowButton = document.getElementById('login-show');
    const loginModal = document.getElementById('login-modal');
    loginShowButton.addEventListener('click', function() {
        loginModal.style.display = 'flex';
    });

    const registerShowButton = document.getElementById('register-show');
    const registerModal = document.getElementById('register-modal');
    registerShowButton.addEventListener('click', function() {
        registerModal.style.display = 'flex';
    });


    { // login logic
        const emailInput = document.getElementById('log-mail-input');
        const pwdInput = document.getElementById('log-pwd-input');
        const submitButton = document.getElementById('login-btn');
        
        submitButton.addEventListener('click', function(event) {
            event.preventDefault();
            const email = emailInput.value.trim();
            const pwd = pwdInput.value.trim();
            console.log('Email:', email);
            console.log('password:', pwd);

            if (!email) {
                alert('⚠ Поле email не должно быть пустым!');
                return;
            }
            if (!pwd) {
                alert('⚠ Поле password не должно быть пустым!');
                return;
            }

            fetch('https://jsonplaceholder.typicode.com/users')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response problem.');
                    }
                    return response.json();
                })
                .then(users => {
                    const matchUser = users.find(user => {
                        return user.username === pwd && user.email === email
                    });

                    if (matchUser) {
                        // console.log('Success');
                        const divLogin = document.querySelector('.div-login-register');
                        divLogin.style.display = 'none';
                        x = document.getElementById("user_not_found_snackbar");
                        if (x.classList.contains("show")) {
                            x.className = x.className.replace("show", "");
                        }
                    } else {
                        x = document.getElementById("user_not_found_snackbar");
                        x.className = "show";
                        setTimeout(function(){
                            x.className = x.className.replace("show", "");
                        }, 3000);
                        console.log('No user');
                    }
                })
                .catch(error => {
                    alert(`⚠ Fetching users: ${error.message}`);
                });
        });
    } // /logic logic 

    {   // register logic
        const titleInput = document.getElementById('reg-title-input');
        const contentInput = document.getElementById('reg-content-input');
        const idInput = document.getElementById('reg-id-input');
        const submitButton = document.getElementById('reg-btn');

        submitButton.addEventListener('click', function(event) {
            event.preventDefault();
            titleV = titleInput.value.trim();
            contentV = contentInput.value.trim();
            idV = idInput.value.trim();
            if (!titleV) {
                alert('⚠ Поле event не должно быть пустым!');
                return;
            }
            if (!contentV) {
                alert('⚠ Поле title не должно быть пустым!');
                return;
            }
            if (!idV) {
                alert('⚠ Поле id не должно быть пустым!');
                return;
            }

            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify({
                    title: titleV,
                    body: contentV,
                    userId: idV,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network problems.");
                    }
                    return response.json();
                })
                .then((json) => {
                    console.log(json);
                    const divRegister = document.querySelector('.div-login-register')
                    divRegister.style.display = "none";
                })
                .catch(error => {
                   alert(`⚠ Error posting : ${error.message}`);
                });
        })
    } // / register logic
});


// Sincere@april.biz
// Bret
