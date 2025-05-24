// Obtener los elementos del DOM
const userNameSpan = document.getElementById('userName');
const usernameInfo = document.getElementById('usernameInfo');
const emailInfo = document.getElementById('emailInfo');
const profileImage = document.getElementById('profileImage');

// Recuperar el usuario del localStorage
const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

if (loggedUser) {
  // Mostrara el nombre
  const capitalizedName = loggedUser.username.charAt(0).toUpperCase() + loggedUser.username.slice(1); // La primer letra sera Mayuscula
  userNameSpan.textContent = capitalizedName;
  usernameInfo.textContent = loggedUser.username;
  emailInfo.textContent = loggedUser.correo || 'No proporcionado';

  // Mostrara la imagen de perfil si la ha agregado
  if (loggedUser.photo) {
    profileImage.src = loggedUser.photo;
  } else {
    profileImage.src = '../pictureDefault/perfilLogoDefecto.jpg';
  }
} else {
  alert('No has iniciado sesión');
  window.location.href = '../plantillas/login.html';
}

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('loggedUser');
  window.location.href = '../plantillas/login.html';
}