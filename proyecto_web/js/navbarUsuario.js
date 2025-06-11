// Script para actualizar la imagen de perfil y el correo del usuario en la barra de navegación

// Obtener los elementos del DOM
document.addEventListener('DOMContentLoaded', () => {
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  const navbarProfilePic = document.getElementById('navbarProfilePic');
  const userEmailDisplay = document.getElementById('userEmail');

  // Verificar si el usuario ha iniciado sesión
  if (loggedUser) {
    // Actualizar imagen
    if (loggedUser.photo) {
      // Si el usuario tiene una foto, mostrarla
      navbarProfilePic.src = loggedUser.photo;
    } else {
      // Si no tiene foto, mostrar imagen por defecto
     // navbarProfilePic.src = './pictureDefault/perfilLogoDefecto.jpg';
    }

    // Mostrar correo
    userEmailDisplay.textContent = loggedUser.correo || 'No proporcionado'; // Si no hay correo, mostrar un mensaje por defecto
  } else {
    
    userEmailDisplay.textContent = 'Invitado';
  }
});

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('loggedUser'); // Eliminar el usuario del localStorage
  localStorage.setItem('logoutMessage', 'Sesión cerrada correctamente'); // Guardar mensaje de cierre de sesión
  window.location.href = '../plantillas/login.html'; // Redirigir al usuario a la página de inicio de sesión
}