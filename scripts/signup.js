window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const nombre = document.getElementById("inputNombre");
  const apellido = document.getElementById("inputApellido");
  const email = document.getElementById("inputEmail");
  const contraseña = document.getElementById("inputPassword");
  const form = document.querySelector("form");
  const confirmarContraseña = document.getElementById("inputPasswordRepetida");

  console.log(nombre);

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    //-------- PENDIENTE DE HACER VALIDACIÓN DE LOS CAMPOS DEL FORM ------
    /*   if (contraseña.value != confirmarContraseña.value) {
      confirmarContraseña.ariaPlaceholder =
        "La contraseña no coincide con este campo. Verificalo";
      setTimeout(() => (confirmarContraseña.ariaPlaceholder = ""), 25000);
    }

    nombre.ariaPlaceholder =
      contraseña.value === null ?? console.log("Submit del form de registro");
 */
    const userSignUp = {
      firstName: nombre.value,
      lastName: apellido.value,
      email: email.value,
      password: contraseña.value,
    };

    realizarRegister(userSignUp);
  });

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarRegister(user) {
    //Creo parametros del fetch,
    const jsonObject = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };
    const url = "https://ctd-todo-api.herokuapp.com/v1/users";

    fetch(url, jsonObject)
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        console.log(datos);

        if (datos.jwt) {
          localStorage.setItem("jwt", datos.jwt);
          location.replace("/mis-tareas.html");
        }
      });
  }
});
