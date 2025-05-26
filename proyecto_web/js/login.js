const users = [
  // Datos de ejemplo de usuarios
  { username: 'vladimir ascencio', correo: 'ascencio3.45@gmail.com', password: '1234' },
  { username: 'ruth', correo: 'ruth12@turismosv.com', password: 'admin' }
];

// Obtener los elementos del DOM
const loginForm = document.getElementById('loginForm');
const cancelBtn = document.getElementById('cancelBtn');

const messageModal = document.getElementById('messageModal');
const messageText = document.getElementById('messageText');
const messageOkBtn = document.getElementById('messageOkBtn');

const confirmModal = document.getElementById('confirmModal');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

// Agregar evento de envío al formulario de inicio de sesión
loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim().toLowerCase(); // Convertir a minúsculas para comparación
  const correo = document.getElementById('correo').value.trim().toLowerCase(); // Convertir a minúsculas para comparación
  const password = document.getElementById('password').value; // Mantener la contraseña como está para la comparación
  const fileInput = document.getElementById('profilePic'); // Obtener el input de archivo para la imagen de perfil

  // Validar que los campos no estén vacíos
  if (!username || !correo || !password) {
    showMessage('Por favor completa todos los campos', 'ERROR');
    return;
  }

  // Buscar usuario que coincida en username, correo y password
  const user = users.find(u =>
    u.username.toLowerCase() === username &&
    u.correo.toLowerCase() === correo &&
    u.password === password
  );

  // Validar que el usuario exista
  if (user) {
    // Si el usuario existe, guardar los datos en localStorage y redirigir
    const saveAndRedirect = (userData) => {
      // Guardar los datos del usuario en localStorage
      localStorage.setItem('loggedUser', JSON.stringify(userData));
      showMessage('Inicio de sesión exitoso', 'success'); // Mostrar mensaje de éxito
      setTimeout(() => {
        window.location.href = '../plantillas/usuario.html'; // Redirigir a la página de usuario después de 1.5 segundos
      }, 1500);
    };

    // Si hay un archivo seleccionado, leerlo y guardarlo como imagen de perfil
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0]; // Obtener el primer archivo seleccionado
      if (!file.type.startsWith('image/')) {
        showMessage('Por favor selecciona una imagen válida.', 'ERROR'); // Validar que el archivo sea una imagen
        return; // Detener la ejecución si no es una imagen y volver a mostrar el formulario
      }

      // Leer el archivo como Data URL para poder guardarlo en localStorage
      const reader = new FileReader();
      reader.onload = function () {
        saveAndRedirect({ ...user, photo: reader.result }); // Guardar el usuario con la imagen de perfil
      };
      reader.readAsDataURL(file); // Leer el archivo como Data URL
    } else {
      saveAndRedirect(user); // Si no hay archivo seleccionado, guardar el usuario sin imagen de perfil
    }
  } else {
    showMessage('Usuario, correo o contraseña incorrectos', 'ERROR'); // Mostrar mensaje de error si las credenciales son incorrectas
  }
});

// Agregar evento al botón de cancelar
cancelBtn.addEventListener('click', () => {
  confirmModal.style.display = 'flex';
});

// Agregar eventos a los botones de confirmación
yesBtn.addEventListener('click', () => {
  window.location.href = '../index.htm';
});

noBtn.addEventListener('click', () => {
  confirmModal.style.display = 'none';
});

// Agregar evento para cerrar el modal al hacer clic fuera de él
window.addEventListener('click', (e) => {
  // Verificar si el clic fue fuera del modal de confirmación o del modal de mensaje
  if (e.target === confirmModal || e.target === messageModal) {
    // Si es así, ocultar ambos modales
    confirmModal.style.display = 'none';
    messageModal.style.display = 'none';
  }
});

// Agregar evento al botón de aceptar del mensaje
messageOkBtn.addEventListener('click', () => {
  // Ocultar el modal de mensaje al hacer clic en el botón de aceptar
  messageModal.style.display = 'none';
});

// Función para mostrar mensajes en un modal
function showMessage(message, type) {
  // Mostrar un mensaje en un modal con el tipo especificado
  messageText.textContent = message;
  messageModal.className = `modal ${type}`;
  messageModal.style.display = 'flex'; // Mostrar el modal
}

// Mostrar mensaje de cierre de sesión
const logoutMessage = localStorage.getItem('logoutMessage');
if (logoutMessage) {
  // Si hay un mensaje de cierre de sesión guardado se muestra
  showMessage(logoutMessage, 'success');
  localStorage.removeItem('logoutMessage');
}