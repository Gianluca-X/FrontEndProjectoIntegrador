window.addEventListener('load', function () {


    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.forms[0];
    const emailInput = document.querySelector('#inputEmail')
    const passwordInput = document.querySelector('#inputPassword')
    const url = 'http://todo-api.ctd.academy:3000/v1';
    const emailError = document.querySelector("#emailError");
    const loginError = document.querySelector("#loginError");


    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const payload = {
            email: validarEmail(emailInput.value)? emailError.classList.remove("visible")
            : emailError.classList.add("visible"),
            password: passwordInput.value
          }

        const settings = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-type': 'application/json'
            }
        }

        realizarLogin(settings)
        //limpio los campos del formulario
        form.reset();
    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {

        fetch(`${url}/users/login`, settings) 
         .then( response => response.json())
         .then( data => {
            if(data.jwt) {
                localStorage.setItem('jwt', JSON.stringify(data.jwt))
                location.replace('mis-tareas.html')
            }
        })
         .catch( error => console.log(error) + loginError.classList.add("visible"))
        
    };


});