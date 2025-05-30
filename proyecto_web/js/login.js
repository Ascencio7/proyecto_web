document.addEventListener('DOMContentLoaded', () => {
  const users = [
    // Datos de ejemplo de usuarios
    { username: 'vladimir ascencio', correo: 'ascencio3.45@gmail.com', password: '1234' },
    { username: 'ruth', correo: 'ruth12@turismosv.com', password: 'admin' },
    {username: 'emir alvarado', correo: 'alex24@turismosv.com', password: '198623' }
  ];

  // Obtener los elementos del DOM
  const loginForm = document.getElementById('loginForm');
  const cancelBtn = document.getElementById('cancelBtn');

  const messageModalElement = document.getElementById('messageModal');
  const messageText = document.getElementById('messageText');
  const messageOkBtn = document.getElementById('messageOkBtn');

  const confirmModalElement = document.getElementById('confirmModal');
  const confirmModal = new bootstrap.Modal(confirmModalElement);

  // Evento para mostrar modal de confirmación al cancelar
  cancelBtn.addEventListener('click', () => {
    confirmModal.show();
  });

  // Confirmar cancelación: redirigir a la página principal
  document.getElementById('yesBtn').addEventListener('click', () => {
    window.location.href = '../index.htm';
  });

  // Cancelar cancelación: cerrar modal
  document.getElementById('noBtn').addEventListener('click', () => {
    confirmModal.hide();
  });

  // Evento para enviar el formulario de login
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim().toLowerCase();
    const correo = document.getElementById('correo').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const fileInput = document.getElementById('profilePic');

    // Validar campos vacíos
    if (!username || !correo || !password) {
      showMessage('Por favor completa todos los campos', 'ERROR');
      return;
    }

    // Buscar usuario válido
    const user = users.find(u =>
      u.username.toLowerCase() === username &&
      u.correo.toLowerCase() === correo &&
      u.password === password
    );

    if (user) {
      const saveAndRedirect = (userData) => {
        localStorage.setItem('loggedUser', JSON.stringify(userData));
        showMessage('Inicio de sesión exitoso', 'success');
        setTimeout(() => {
          window.location.href = '../plantillas/usuario.html';
        }, 1500);
      };

      // Si hay archivo, validar y leer imagen
      if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (!file.type.startsWith('image/')) {
          showMessage('Por favor selecciona una imagen válida.', 'ERROR');
          return;
        }

        const reader = new FileReader();
        reader.onload = function () {
          saveAndRedirect({ ...user, photo: reader.result });
        };
        reader.readAsDataURL(file);
      } else {
        saveAndRedirect(user);
      }
    } else {
      showMessage('Usuario, correo o contraseña incorrectos', 'ERROR');
    }
  });

  // Cerrar modal de mensaje al hacer clic en botón OK
  messageOkBtn.addEventListener('click', () => {
    const modalInstance = bootstrap.Modal.getInstance(messageModalElement);
    modalInstance.hide();
  });

  // Mostrar mensaje en modal
  function showMessage(message, type) {
    messageText.textContent = message;
    messageModalElement.className = `modal fade show ${type.toLowerCase()}`;
    // Crear instancia o usar existente para mostrar el modal
    let modalInstance = bootstrap.Modal.getInstance(messageModalElement);
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(messageModalElement);
    }
    modalInstance.show();
  }

  // Mostrar mensaje si hubo logout previo
  const logoutMessage = localStorage.getItem('logoutMessage');
  if (logoutMessage) {
    showMessage(logoutMessage, 'success');
    localStorage.removeItem('logoutMessage');
  }
});
