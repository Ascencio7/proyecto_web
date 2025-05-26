// Obtener elementos del DOM
const userNameSpan = document.getElementById('userName'); // Nombre en la tarjeta
const usernameInfo = document.getElementById('usernameInfo'); // Nombre en la tarjeta info
const emailInfo = document.getElementById('emailInfo'); // Email en la tarjeta info
const profileImage = document.getElementById('profileImage'); // Imagen perfil en la tarjeta

const navbarProfilePic = document.getElementById('navbarProfilePic'); // Imagen perfil en el navbar
const userEmailDropdown = document.getElementById('userEmail'); // Email en el dropdown del navbar

// Recuperar usuario desde localStorage
const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

// Función para mostrar datos del usuario o invitado
function mostrarDatosUsuario(user) {
  if (user) {
  const capitalizedName = user.username.toUpperCase();
    userNameSpan.textContent = capitalizedName;
    usernameInfo.textContent = user.username;
    emailInfo.textContent = user.correo || 'No proporcionado';

    const foto = user.photo || '../pictureDefault/perfilLogoDefecto.jpg';
    profileImage.src = foto;
    navbarProfilePic.src = foto;

    if(userEmailDropdown) {
      userEmailDropdown.textContent = user.correo || 'Correo no proporcionado';
    }
  } else {
    // Invitado / sin sesión
    userNameSpan.textContent = 'Invitado';
    usernameInfo.textContent = 'Invitado';
    emailInfo.textContent = 'No has iniciado sesión';
    profileImage.src = '../pictureDefault/perfilLogoDefecto.jpg';
    navbarProfilePic.src = '../pictureDefault/perfilLogoDefecto.jpg';

    if(userEmailDropdown) {
      userEmailDropdown.textContent = 'Invitado';
    }
  }
}

// Mostrar los datos al cargar la página
mostrarDatosUsuario(loggedUser);

// Función para cerrar sesión (llamada por el botón)
function cerrarSesion() {
  // Eliminar el usuario guardado en localStorage
  localStorage.removeItem('loggedUser');

  // Opcional: Actualizar la interfaz para mostrar usuario invitado o vacío
  mostrarDatosUsuario(null);

  // Redirigir a la página principal
  window.location.href = '../index.html';
}


// Exponer la función para que pueda ser llamada desde el onclick del botón
window.cerrarSesion = cerrarSesion;

// Código para el menú desplegable ya está en tu script original
const userIcon = document.getElementById('userIcon');
const userDropdown = document.getElementById('userDropdown');

if(userIcon && userDropdown) {
  userIcon.addEventListener('click', () => {
    userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    if (!userIcon.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.style.display = 'none';
    }
  });
}