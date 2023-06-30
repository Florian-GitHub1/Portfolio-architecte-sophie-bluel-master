const inputEmail = document.getElementById('email')
const inputPassword = document.getElementById('password')
const submitButton = document.getElementById('connexion')
const loginForm = document.querySelector('form')
const logError = document.getElementById('error-Container')

loginForm.addEventListener('submit', (event) => {
    event.preventDefault() // no page reload


    let data = {
        email: inputEmail.value,
        password: inputPassword.value,
    }

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw new Error("E-mail ou mot de passe incorrect")
            }
        })
        .then(response => {
            // token storage + redirection if response 200
            localStorage.setItem('token', response.token)
            location.href = 'index.html'
        })

        .catch(error => {
            logError.textContent = "E-mail ou mot de passe incorrect"
            logError.classList.add('error-Container');
            console.error('Server issues', error);
        })
})
