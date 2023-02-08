/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  const token = JSON.parse(localStorage.getItem('jwt'));

  const urlTareas = 'http://todo-api.ctd.academy:3000/v1/tasks';
  const urlUsuario = 'http://todo-api.ctd.academy:3000/v1/users/getMe';

  const formCrearTarea = document.querySelector('.nueva-tarea');
  const nuevaTarea = document.querySelector('#nuevaTarea');
  const btnCerrarSesion = document.querySelector('#closeApp');

  obtenerNombreUsuario()
  consultarTareas()
  AOS.init();
  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
    // if(confirm('¿Desea cerrar sesion?')) {
    //   // localStorage.clear()
    //   localStorage.removeItem('jwt')
    //   location.replace('index.html')
    // }

    Swal.fire({
      title: '¿Desea cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          '¡Hasta luego!',
          'Te esperamos pronto.',
          'success'
        );
        localStorage.clear();
        location.replace('./index.html');
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */
  const p = document.querySelector('#username')

  async function obtenerNombreUsuario() {

      const settings = {
        headers: {
           authorization: token,
        }
      }

      try {
        const response = await fetch(`${urlUsuario}`, settings)
        const data = await response.json()
  
        p.innerText = data.firstName
      }
      catch ( err ) {
        p.innerText = err
      }

  }


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {

    const settings = {
      headers: {
         authorization: token,
      }
    }

    fetch(`${urlTareas}`, settings)
    .then( response => response.json())
    .then( data => {
      renderizarTareas(data)

    })
    .catch(err => console.log(err))
  };


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault();

    const payload = {
      description: normalizarTexto(nuevaTarea.value),
      completed: false
    }

    const settings = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-type': 'application/json',
         authorization: token,
      }
    }

    fetch(`${urlTareas}`, settings)
    .then( response => response.json())
    .then( data => {
      console.log(data)
      consultarTareas()
    })

    //limpiamos el form
    formCrearTarea.reset();
  })


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {

    // obtengo listados y limpio cualquier contenido interno
    const tareasPendientes = document.querySelector('.tareas-pendientes');
    const tareasTerminadas = document.querySelector('.tareas-terminadas');
    tareasPendientes.innerHTML = "";
    tareasTerminadas.innerHTML = "";

    // buscamos el numero de finalizadas


    listado.forEach(tarea => {
      //variable intermedia para manipular la fecha
      let fecha = new Date(tarea.createdAt);

      if (tarea.completed) {
        //lo mandamos al listado de tareas completas
        tareasTerminadas.innerHTML += `
          <li class="tarea" data-aos="flip-up">
            <div class="hecha">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button class="change incompleta" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>
                        `
      } else {
        //lo mandamos al listado de tareas sin terminar
        tareasPendientes.innerHTML += `
          <li class="tarea"" data-aos="flip-up">
            <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <p class="timestamp">${fecha.toLocaleDateString()}</p>
            </div>
          </li>
                        `
      }
      // actualizamos el contador en la pantalla
    })

    botonesCambioEstado()
    botonBorrarTarea()
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    const btnCambioEstado = document.querySelectorAll('.change');

    btnCambioEstado.forEach( boton => {

      boton.addEventListener("click", (e) => {
        console.log(e);
        const id = e.target.id

        let payload = {}

        if(!e.target.classList.contains("incompleta")) {
          payload.completed = true
        }
        else {
          payload.completed = false
        }

        const settings = {
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          }
        }

        fetch(`${urlTareas}/${id}`, settings) 
        .then(res => res.json())
        .then(data => consultarTareas())
        .catch(err => console.log(err))


      })
    })

  }
 
  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
    //obtenemos los botones de borrado
    const btnBorrarTarea = document.querySelectorAll('.borrar');

    btnBorrarTarea.forEach( boton => {

      boton.addEventListener("click", (e) => {
  
         const id = e.target.id
         console.log(id)
         console.log(e.target.id)
         const settings = {
          method: 'DELETE',
          headers: {
            authorization: token,
          }
         }
         fetch(`${urlTareas}/${id}`, settings)
         .then(res => res.json())
         .then(data => consultarTareas())
         .catch(err => console.log(err))
      })

    })
    
  }

});