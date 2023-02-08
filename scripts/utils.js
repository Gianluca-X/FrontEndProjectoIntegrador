/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {
    let text = normalizarTexto(texto)
    if(text.length <= 50) {
        console.log(text)
        return text
    }
}

function normalizarTexto(texto) {
    if(isNaN(texto)) {
        console.log(texto)
        return texto.toUpperCase().trim()
    }
    else {
        return false;
    }
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
    let mail = normalizarEmail(email);
     if (mail.includes('@') && mail.includes('.COM')) {
        console.log(mail)
        return mail;
       }
}

function normalizarEmail(email) {
        
        return email.toUpperCase();
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([^ ]){8,15}$/;
    if(regex.test(contrasenia)) {
        console.log(contrasenia)
        return contrasenia;
    }
    else {
        console.log("contraseña no valida");
    }
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    if ( contrasenia_1 === contrasenia_2 ) {
        validarContrasenia(contrasenia_1)
        return contrasenia_1
    }
    else {
        console.log("Contraseñas distintas")
        return false;
    }

}
