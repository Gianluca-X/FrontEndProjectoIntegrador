window.addEventListener('load', function () {
    const token = localStorage.getItem('jwt')
    
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.forms[0];
    const nombre = document.querySelector('#inputNombre');
    const apellido = document.querySelector('#inputApellido');
    const email = document.querySelector('#inputEmail');
    const password = document.querySelector('#inputPassword');
    const passwordRepetida = document.querySelector('#inputPasswordRepetida');
    const url = 'http://todo-api.ctd.academy:3000/v1';
    const nombreError = this.document.querySelector("#nombreError");
  const apellidoError = this.document.querySelector("#apellidoError");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");
  const passwordErrorRepeat = this.document.querySelector("#passwordErrorRepeat");
 
    
    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('change', e =>{
        validarTexto(nombre.value)? nombreError.classList.remove("visible") 
        : nombreError.classList.add("visible");
        validarTexto(apellido.value)? apellidoError.classList.remove("visible") 
        : apellidoError.classList.add("visible");
        validarEmail(email.value) ? emailError.classList.remove("visible")
        : emailError.classList.add("visible");
        validarContrasenia(password.value)?  passwordError.classList.remove("visible") 
        : passwordError.classList.add("visible");
        compararContrasenias(password.value, passwordRepetida.value)? passwordErrorRepeat.classList.remove("visible")
        : passwordErrorRepeat.classList.add("visible");
    })
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const payload = {
            firstName: validarTexto(nombre.value),
            lastName: validarTexto(apellido.value),
            email: validarEmail(email.value),
            password:  compararContrasenias(password.value, passwordRepetida.value)
        }
        console.log(payload);

        realizarRegister(payload)
        //limpio los campos del formulario
        form.reset();
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(usuario) {
        console.log("Lanzamos la consulta a la API...");
        const settings = {
          method: "POST",
          body: JSON.stringify(usuario),
          headers: {
            "Content-Type": "application/json",
          },
        };
      
        // hacemos el fetch, le pasamos los dos parametros que necesita
      
        fetch(`${url}/users`, settings )
          .then((response) => {
            // captamos la respuesta "cruda" de la API (promesa)
            console.log(response);
            // chequeamos si salio todo mal
            if (response.ok != true) {
              alert("Algo malió sal.");
            }
            return response.json(); // transformamos de JSON a objeto JS
          })
          .then((data) => {
            // obtenemos el resultado del .then anterior, la rta "procesada", podemos manipular los datos
            console.log("Promesa cumplida");
            console.log(data);
            if (data.jwt) {
              // guardamos el token en el local storage
              localStorage.setItem("jwt", data.jwt);
              location.replace("./mis-tareas.html");
            }
          })
          .catch((error) => console.log(error));
      }
});
