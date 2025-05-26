// Obtener los elementos del DOM
const userNameSpan = document.getElementById('userName'); // Nombre del usuario en la barra de navegación
const usernameInfo = document.getElementById('usernameInfo'); // Nombre de usuario en la sección de información
const emailInfo = document.getElementById('emailInfo'); // Correo electrónico del usuario en la sección de información
const profileImage = document.getElementById('profileImage'); // Imagen de perfil del usuario en la sección de información

// Recuperar el usuario del localStorage
const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

// Verificar si el usuario ha iniciado sesión
if (loggedUser) {
  // Mostrara el nombre
  const capitalizedName = loggedUser.username.charAt(0).toUpperCase() + loggedUser.username.slice(1).toUpperCase(); // Capitaliza el primer carácter del nombre de usuario
  // y convierte el resto a mayúsculas
  userNameSpan.textContent = capitalizedName; // Actualiza el nombre de usuario en la barra de navegación
  usernameInfo.textContent = loggedUser.username; // Actualiza el nombre de usuario en la sección de información
  emailInfo.textContent = loggedUser.correo || 'No proporcionado'; // Actualiza el correo electrónico en la sección de información, si no hay correo, muestra un mensaje por defecto

  // Mostrara la imagen de perfil si la ha agregado
  if (loggedUser.photo) {
    profileImage.src = loggedUser.photo; // Si el usuario tiene una foto, mostrarla
  } else {
    profileImage.src = '../pictureDefault/perfilLogoDefecto.jpg'; // Si no tiene foto, mostrar imagen por defecto
  }
} else {
  alert('No has iniciado sesión'); // Si no hay usuario logueado, mostrar un mensaje de alerta
  window.location.href = '../plantillas/login.html'; // Redirigir al usuario a la página de inicio de sesión
}

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('loggedUser'); // Eliminar el usuario del localStorage
  window.location.href = '../plantillas/login.html'; // Redirigir al usuario a la página de inicio de sesión
}

// Mostrar/ocultar el menú desplegable del usuario
const userIcon = document.getElementById('userIcon');
const userDropdown = document.getElementById('userDropdown');

// Agregar evento de clic al icono del usuario para mostrar/ocultar el menú desplegable
userIcon.addEventListener('click', () => {
  userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block'; // Alterna la visibilidad del menú desplegable
});

// Cierra el menú si haces un clic fuera del menu
document.addEventListener('click', (e) => { 
  // Verifica si el clic fue fuera del icono del usuario y del menú desplegable
  // Si es así, oculta el menú desplegable
  if (!userIcon.contains(e.target) && !userDropdown.contains(e.target)) {
    userDropdown.style.display = 'none'; // Oculta el menú desplegable
  }
});

// Mostrar el correo electrónico del usuario en el encabezado
const user = JSON.parse(localStorage.getItem('loggedUser'));
if (user && user.email) { // Verifica si el usuario y su correo electrónico existen
  document.querySelector('.user-email').textContent = user.email; // Muestra el correo electrónico del usuario
}