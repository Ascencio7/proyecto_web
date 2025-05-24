const users = [
  { username: 'vladimir ascencio', correo: 'ascencio3.45@gmail.com', password: '1234' },
  { username: 'ruth', correo: 'ruth12@turismosv.com', password: 'admin' }
];

const loginForm = document.getElementById('loginForm');
const cancelBtn = document.getElementById('cancelBtn');

const messageModal = document.getElementById('messageModal');
const messageText = document.getElementById('messageText');
const messageOkBtn = document.getElementById('messageOkBtn');

const confirmModal = document.getElementById('confirmModal');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim().toLowerCase();
  const correo = document.getElementById('correo').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const fileInput = document.getElementById('profilePic');

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

    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (!file.type.startsWith('image/')) {
        showMessage('Por favor selecciona una imagen válida.', 'error');
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

cancelBtn.addEventListener('click', () => {
  confirmModal.style.display = 'flex';
});

yesBtn.addEventListener('click', () => {
  window.location.href = '../index.htm';
});

noBtn.addEventListener('click', () => {
  confirmModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === confirmModal || e.target === messageModal) {
    confirmModal.style.display = 'none';
    messageModal.style.display = 'none';
  }
});

messageOkBtn.addEventListener('click', () => {
  messageModal.style.display = 'none';
});

function showMessage(message, type) {
  messageText.textContent = message;
  messageModal.className = `modal ${type}`;
  messageModal.style.display = 'flex';
}