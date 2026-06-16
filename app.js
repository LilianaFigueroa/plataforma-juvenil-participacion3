const botonesPerfil = document.querySelectorAll(".btnPerfil");
const detallePerfil = document.getElementById("detallePerfil");

botonesPerfil.forEach(function (boton) {
  boton.addEventListener("click", function () {
    const perfil = boton.getAttribute("data-perfil");

    detallePerfil.innerHTML = `
      <h3>Información del perfil</h3>
      <p><strong>Perfil seleccionado:</strong> ${perfil}</p>
      <p>
        Este perfil es ficticio y se utiliza únicamente como parte de una práctica académica
        para aprender a construir interfaces de participación ciudadana.
      </p>
      <p>
        No corresponde a una candidatura real, no permite votar y no debe usar datos personales reales.
      </p>
    `;
  });
});

const btnGuardarCandidato = document.getElementById("btnGuardarCandidato");
const mensajeGuardado = document.getElementById("mensajeGuardado");
const contenedorCandidatosGuardados = document.getElementById("contenedorCandidatosGuardados");

async function cargarCandidatosGuardados() {
  const respuesta = await fetch("/api/candidatos");
  const candidatos = await respuesta.json();

  contenedorCandidatosGuardados.innerHTML = "";

  candidatos.forEach(function (candidato) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-guardada");

    tarjeta.innerHTML = `
      <h3>${candidato.nombre}</h3>
      <p><strong>Rol:</strong> ${candidato.rol}</p>
      <p><strong>Propuesta:</strong> ${candidato.propuesta}</p>
      <p><strong>Estado:</strong> ${candidato.estado}</p>
    `;

    contenedorCandidatosGuardados.appendChild(tarjeta);
  });
}

btnGuardarCandidato.addEventListener("click", async function () {
  const nombre = document.getElementById("nombreCandidato").value.trim();
  const rol = document.getElementById("rolCandidato").value.trim();
  const propuesta = document.getElementById("propuestaCandidato").value.trim();

  console.log("Botón guardado clickeado");
  console.log("Nombre:", nombre, "Rol:", rol, "Propuesta:", propuesta);

  if (!nombre || !rol || !propuesta) {
    mensajeGuardado.textContent = "Completa nombre, rol y propuesta.";
    console.log("Validación fallida");
    return;
  }

  const nuevoPerfil = {
    nombre: nombre,
    rol: rol,
    propuesta: propuesta
  };

  try {
    console.log("Enviando perfil al servidor:", nuevoPerfil);
    const respuesta = await fetch("/api/candidatos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoPerfil)
    });

    console.log("Respuesta del servidor:", respuesta.status);
    const resultado = await respuesta.json();
    console.log("Resultado:", resultado);
    mensajeGuardado.textContent = resultado.mensaje;

    document.getElementById("nombreCandidato").value = "";
    document.getElementById("rolCandidato").value = "";
    document.getElementById("propuestaCandidato").value = "";

    cargarCandidatosGuardados();
  } catch (error) {
    console.error("Error:", error);
    mensajeGuardado.textContent = "Error al guardar: " + error.message;
  }
});

cargarCandidatosGuardados();