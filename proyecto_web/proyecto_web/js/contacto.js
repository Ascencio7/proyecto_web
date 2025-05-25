document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.querySelector("form");
  const mensajeExito = document.getElementById("mensajeExito");

  formulario.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita envío real
    mensajeExito.classList.remove("d-none");
    formulario.reset();

    setTimeout(() => {
      mensajeExito.classList.add("d-none");
    }, 4000);
  });
});
