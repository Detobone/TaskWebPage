// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  const btnCerrarSesion = document.querySelector("#closeApp");
  const userName = document.querySelector(".user-name");
  const taskName = document.querySelector("#nuevaTarea");
  const formCrearTarea = document.querySelector(".nueva-tarea");
  const tareasPendientes = document.querySelector(".tareas-pendientes");
  const tareasTerminadas = document.querySelector(".tareas-terminadas");

  // console.log("Soy userName: ", userName);

  const jsonObject = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("jwt"),
    },
  };
  /* ---------------- variables globales y llamado a funciones ---------------- */

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener("click", function () {
    localStorage.clear();
    location.replace("./index.html");
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const url = "https://ctd-todo-api.herokuapp.com/v1/users/getMe";
    fetch(url, jsonObject)
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        console.log(datos);
        if (datos.firstName) userName.textContent = datos.firstName;
      })
      .catch((err) => alert(err));
  }
  obtenerNombreUsuario();

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */
  // localStorage.remove("tasks");
  function consultarTareas() {
    const url = "https://ctd-todo-api.herokuapp.com/v1/tasks";
    fetch(url, jsonObject)
      .then((information) => information.json())
      .then((datos) => {
        console.log("Soy la solicitud de tareas: " + datos);
        renderizarTareas(datos);
      });
  }
  consultarTareas(); // Temporal
  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault();
    let rederizar;
    const url = "https://ctd-todo-api.herokuapp.com/v1/tasks";
    // Se clona jsonObject y al clon se le añade el body y se modifica el method a POST para cumplir con las condiciones de la request de la API (Documentacion API)
    const jsonObject2 = { ...jsonObject };
    // body:
    const taskFormat = {
      description: taskName.value,
      completed: false,
    };
    jsonObject2.body = JSON.stringify(taskFormat);
    jsonObject2.method = "POST";
    console.log(jsonObject2);
    console.log(jsonObject);

    fetch(url, jsonObject2)
      .then((information) => information.json())
      .then((data) => {
        console.log("Respuesta de creación tarea: " + data);
        limpiarYRenderizar();
      })
      .then(() => renderizarTareas(rederizar))
      .catch((error) => console.log(error));

    formCrearTarea.reset();
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */

  function renderizarTareas(listado) {
    console.log("RENDERIZANDO TAREAS");
    // filtramos las terminadas
    const listadoTareasTerminadas = listado.filter((item) => item.completed);
    const listadoTareasPendientes = listado.filter((item) => !item.completed);

    const contadorTareasPendientes = document.querySelector(
      "#cantidad-pendientes"
    );
    const contadorTareasTerminadas = document.querySelector(
      "#cantidad-finalizadas"
    );

    console.log(
      "SOY LISTADO DE TAREAS PENDIENTES:" +
        listado.filter((item) => !item.completed).length
    );

    contadorTareasPendientes.innerHTML = listadoTareasPendientes.length;
    contadorTareasTerminadas.innerHTML = listadoTareasTerminadas.length;

    console.log("Pendientes:");
    console.log(listadoTareasPendientes);
    console.log("Terminadas:");
    console.log(listadoTareasTerminadas);

    listadoTareasPendientes.forEach((tarea) => {
      // por cada tarea inyectamos un nodo li
      tareasPendientes.innerHTML += `
      <li class="tarea" data-aos="fade-down">
        <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <p class="timestamp">${tarea.createdAt}</p>
        </div>
      </li>
      `;
    });
    listadoTareasTerminadas.forEach((tarea) => {
      // por cada tarea inyectamos un nodo li
      tareasTerminadas.innerHTML += `
      <li class="tarea" data-aos="fade-up">
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
      `;
    });

    botonesCambioEstado();
  }

  /* ---------------------------------------------------------------- */
  /* Crear tarjetas */
  /* -------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */

  // limpiarYRenderizar limpia el contenido del HTML para evitar que la lista de tareas aparezca duplicada.
  function limpiarYRenderizar() {
    tareasPendientes.innerHTML = "";
    tareasTerminadas.innerHTML = "";
    renderizar = consultarTareas();
  }

  function botonesCambioEstado() {
    const changeTaskStatus = document.querySelectorAll(".change");
    const jsonObject3 = { ...jsonObject };
    jsonObject3.method = "PUT";
    let renderizar;

    console.log(changeTaskStatus);

    for (let tareaIncompleta of changeTaskStatus) {
      console.log("TARE INCOMPLETA" + tareaIncompleta);
      tareaIncompleta.addEventListener("click", () => {
        // console.log("Soy tareaIncompleta", tareaIncompleta.id);

        let id = tareaIncompleta.id;

        console.log(id);
        let url = "https://ctd-todo-api.herokuapp.com/v1/tasks/" + `${id}`;

        //CON EL PRIMER FETCH CONSULTO A LA API LA TAREA ESPECIFICA USANDO EL ID DE LA TAREA
        fetch(url, jsonObject3)
          .then((information) => information.json())
          .then((data) => {
            const taskFormat = {
              description: data.description,
              completed: data.completed
                ? (data.completed = false)
                : (data.completed = true),
            };
            jsonObject3.body = JSON.stringify(taskFormat);
            // jsonObject3.method = "PUT";
            // CON EL SEGUNDO FETCH PIDO QUE SE ACTUALICE LA INFORMACION DE LA TAREA
            fetch(url, jsonObject3)
              .then((data) => data.json())
              .then((updatedData) => {
                console.log("Soy UPDATED_DATA: " + updatedData);
                limpiarYRenderizar();
              })
              .then(() => renderizarTareas(renderizar))
              .catch((error) => console.log(error));
          });
      });
    }

    botonBorrarTarea();
  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
    const deleteBtn = document.querySelectorAll(".borrar");
    const jsonObject3 = { ...jsonObject };
    jsonObject3.method = "DELETE";
    let renderizar;

    for (let btn of deleteBtn) {
      console.log("TARE INCOMPLETA" + btn);
      btn.addEventListener("click", () => {
        console.log("Soy btn", btn.id);

        let id = btn.id;
        console.log(id);

        let url = "https://ctd-todo-api.herokuapp.com/v1/tasks/" + `${id}`;

        //SOLICITO LA ELIMINACIÓN DE LA TAREA
        fetch(url, jsonObject3)
          .then((information) => information.json())
          .then((data) => {
            console.log("RESPUESTA ELIMINACIÓN TAREA:" + data);
            limpiarYRenderizar()
              .then(() => renderizarTareas(renderizar))
              .catch((error) => console.log(error));
          });
      });
    }
  }
});
