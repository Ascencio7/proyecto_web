document.addEventListener('DOMContentLoaded', () => {
  // Elementos del formulario
  const reservaForm = document.getElementById('formReserva');
  const destinoSelect = document.getElementById('destination');
  const fechaLlegada = document.getElementById('check-in');
  const fechaSalida = document.getElementById('check-out');
  const adultosSelect = document.getElementById('adults');
  const ninosSelect = document.getElementById('children');
  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const telefonoInput = document.getElementById('telefono');
  const paqueteSelect = document.getElementById('paquete');

  // Modal 
  const reservaModal = new bootstrap.Modal(document.getElementById('reservaModal'));
  const modalTitle = document.getElementById('reservaModalTitle');
  const modalBody = document.getElementById('reservaModalBody');

  // Mapeo completo de paquetes a destinos recomendados
  const paqueteDestinoMap = {
    'eco-aventura': 'Cerro Verde',
    'relax': 'Lago de Coatepeque',
    'solArena': 'Playa El Tunco',
    'atardecer': 'Lago de Coatepeque',
    'bosque': 'Cerro Verde',
    'urbano': 'Zona Rosa'
  };

  // Cargar parámetros de URL
  const params = new URLSearchParams(window.location.search);
  const paqueteParam = params.get('paquete');
  const adultosParam = params.get('adultos');
  const ninosParam = params.get('ninos');

  // Establecer valores iniciales desde parámetros URL
  if (paqueteParam) {
    paqueteSelect.value = paqueteParam;
    if (paqueteDestinoMap[paqueteParam]) {
      destinoSelect.value = paqueteDestinoMap[paqueteParam];
    }
  }

  if (adultosParam) {
    adultosSelect.value = adultosParam;
  }

  if (ninosParam) {
    ninosSelect.value = ninosParam;
  }

  // Event listener para cambios en el select de paquete
  paqueteSelect.addEventListener('change', function () {
    const selectedOption = this.options[this.selectedIndex];
    const paqueteId = selectedOption.value;



    if (paqueteId === '' || paqueteId === 'ninguna') {
      destinoSelect.value = '';
      adultosSelect.value = '1';
      ninosSelect.value = '0';
      actualizarCostoEstimado();
      return;
    }
// Obtener datos del paquete seleccionado
    const precio = selectedOption.getAttribute('data-precio');
    const adultosIncluidos = selectedOption.getAttribute('data-incluye-adultos');
    const ninosIncluidos = selectedOption.getAttribute('data-incluye-ninos');

    if (paqueteDestinoMap[paqueteId]) {
      destinoSelect.value = paqueteDestinoMap[paqueteId];
    }

    adultosSelect.value = adultosIncluidos || '1';
    ninosSelect.value = ninosIncluidos || '0';
    actualizarCostoEstimado();
  });
  // Event listener para cambios en el select de destino
  document.querySelectorAll('.reservar-destino').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const destino = this.getAttribute('data-destino');
      const precio = this.getAttribute('data-precio');
      // Actualizar el formulario
      document.getElementById('destination').value = destino;
      document.getElementById('paquete').value = 'ninguna';
      document.getElementById('adults').value = '1';
      document.getElementById('children').value = '0';

      actualizarCostoEstimado();

      // Mostrar modal de confirmación
       modalTitle.textContent = 'Destino seleccionado';
      modalBody.innerHTML = `
        <div class="alert alert-success">
          <p>Has seleccionado una reservación a: <strong>${this.closest('.card').querySelector('.card-title').textContent}</strong></p>
          <p class="mb-0">Por favor, completa los demás detalles de tu reserva en el formulario.</p>
        </div>
      `;
      reservaModal.show();

      // Desplazarse al formulario
      document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    });
  });
  // Event listener para botones de reserva de paquetes
  document.querySelectorAll('.reservar-paquete').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
// Obtener datos del paquete seleccionado
      const paquete = this.getAttribute('data-paquete');
      const adultos = this.getAttribute('data-adultos');
      const ninos = this.getAttribute('data-ninos');
// Actualizar el formulario con los datos del paquete
      document.getElementById('paquete').value = paquete;
      document.getElementById('adults').value = adultos;
      document.getElementById('children').value = ninos;

      if (paqueteDestinoMap[paquete]) { // Si el paquete tiene un destino asociado, actualizar el select de destino
        document.getElementById('destination').value = paqueteDestinoMap[paquete]; // Actualizar el destino
      }

      actualizarCostoEstimado();
      document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });

      modalTitle.textContent = 'Paquete seleccionado'; // Título del modal
      // Contenido del modal
      // Mostrar mensaje de confirmación
      modalBody.innerHTML = `
        <div class="alert alert-success">
          <p>Has seleccionado el paquete: <strong>${this.closest('.card').querySelector('.card-title').textContent}</strong></p>
          <p class="mb-0">Por favor completa los demás detalles de tu reserva en el formulario.</p>
        </div>
      `;
      reservaModal.show();
    });
  });

  // Validación de teléfono
  telefonoInput.addEventListener('input', () => {
    telefonoInput.value = telefonoInput.value.replace(/\D/g, '');
  });

  // Event listeners para actualizar costo estimado
  [paqueteSelect, destinoSelect, adultosSelect, ninosSelect].forEach(el => {
    el.addEventListener('change', actualizarCostoEstimado);
  });

  // Configurar fechas mínimas
  const today = new Date().toISOString().split('T')[0];
  fechaLlegada.min = fechaSalida.min = today;

  fechaLlegada.addEventListener('change', () => { // Actualizar fecha mínima de salida
    if (fechaLlegada.value) {
      fechaSalida.min = fechaLlegada.value;
    }
  });

  // Manejar envío del formulario
  reservaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      simularReserva();
    }
  });

  // Función para validar el formulario
  function validarFormulario() {
    let valido = true;
    const errores = [];

    const validarCampo = (input, mensaje, extraCondicion = () => true) => { // Función para validar cada campo
      if (!input.value || !extraCondicion(input.value)) { // Validar si el campo está vacío o no cumple con la condición extra
        input.classList.add('is-invalid');  // Agregar clase de error
        errores.push(`• ${mensaje}`);
        valido = false; // Marcar como inválido
      } else {
        input.classList.remove('is-invalid');
      }
    };
// Validar cada campo del formulario 
    validarCampo(nombreInput, 'Ingresa tu nombre completo');
    validarCampo(emailInput, 'Ingresa tu correo electrónico', val => /^\S+@\S+\.\S+$/.test(val));
    validarCampo(telefonoInput, 'Ingresa un número de teléfono válido (solo números)', val => /^[0-9]+$/.test(val));
    validarCampo(destinoSelect, 'Selecciona un destino', () => destinoSelect.selectedIndex !== 0);
    validarCampo(fechaLlegada, 'Ingresa una fecha de llegada');
    validarCampo(fechaSalida, 'Ingresa una fecha de salida');

    if (fechaLlegada.value && fechaSalida.value) { // Validar fechas de llegada y salida (si ambas están llenas)
      const llegada = new Date(fechaLlegada.value);
      const salida = new Date(fechaSalida.value);
      if (salida <= llegada) {
        fechaSalida.classList.add('is-invalid');
        errores.push('• La fecha de salida debe ser posterior a la de llegada');
        valido = false;
      } else {
        fechaSalida.classList.remove('is-invalid');
      }
    }

    if (errores.length) { // Si hay errores, mostrar modal de error
      modalTitle.textContent = 'Error en el formulario';
      modalBody.innerHTML = `
        <div class="alert alert-danger">
          <p>Por favor corrige los siguientes errores:</p>
          <ul class="mb-0">${errores.map(e => `<li>${e}</li>`).join('')}</ul>
        </div>`;
      reservaModal.show();
    }

    return valido;
  }

  // Función para simular el proceso de reserva
  function simularReserva() {
    modalTitle.textContent = 'Procesando reserva...'; // Título del modal
    // Mostrar efecto spinner de carga
    modalBody.innerHTML = `
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Estamos procesando tu reserva</p>
      </div>`;
    reservaModal.show();

    setTimeout(() => {
      const numeroReserva = 'RSV-' + Math.floor(100000 + Math.random() * 900000);
      const paqueteSeleccionado = paqueteSelect.selectedOptions[0];
      const destinoSeleccionado = destinoSelect.selectedOptions[0];

      let paqueteNombre = 'Sin paquete (solo destino)';
      let incluyeAdultos = 0;
      let incluyeNinos = 0;

      const adultos = parseInt(adultosSelect.value) || 0;
      const ninos = parseInt(ninosSelect.value) || 0;

      let precioBase = 0;
      let costoTotal = 0;
      let desglose = '';

      if (paqueteSelect.value && paqueteSelect.value !== "ninguna") {
        precioBase = parseFloat(paqueteSeleccionado.getAttribute('data-precio')) || 0;
        incluyeAdultos = parseInt(paqueteSeleccionado.getAttribute('data-incluye-adultos')) || 0;
        incluyeNinos = parseInt(paqueteSeleccionado.getAttribute('data-incluye-ninos')) || 0;
        paqueteNombre = paqueteSeleccionado.text;

        if (adultos <= incluyeAdultos && ninos <= incluyeNinos) { //
          costoTotal = precioBase;
          desglose = `<li><strong>Base:</strong> $${precioBase.toFixed(2)} (Paquete)</li>`;
        } else {
          const extraAdultos = Math.max(adultos - incluyeAdultos, 0);
          const extraNinos = Math.max(ninos - incluyeNinos, 0);
          const costoExtraAdultos = extraAdultos * (precioBase * 0.6);
          const costoExtraNinos = extraNinos * (precioBase * 0.5);
          costoTotal = precioBase + costoExtraAdultos + costoExtraNinos;
// Desglose de costos 
          desglose = `
            <li><strong>Base:</strong> $${precioBase.toFixed(2)} (Paquete)</li> 
            ${extraAdultos > 0 ? `<li>${extraAdultos} adulto(s) extra x $${(precioBase * 0.6).toFixed(2)}: $${costoExtraAdultos.toFixed(2)}</li>` : ''}
            ${extraNinos > 0 ? `<li>${extraNinos} niño(s) extra x $${(precioBase * 0.5).toFixed(2)}: $${costoExtraNinos.toFixed(2)}</li>` : ''}
          `;
          // Calcular costo total considerando extras de adultos y niños con el paquete seleccionado
        } 
      } else if (destinoSelect.value && destinoSelect.value !== "Ninguna opción") { // Si no hay paquete, calcular solo por destino
        const precioDestino = parseFloat(destinoSeleccionado.getAttribute('data-precio')) || 0; // Obtener el precio del destino
        costoTotal = (adultos * precioDestino) + (ninos * precioDestino * 0.5); // Calcular costo total por destino
        desglose = `
          <li><strong>Adultos:</strong> ${adultos} x $${precioDestino.toFixed(2)} = $${(adultos * precioDestino).toFixed(2)}</li>
          ${ninos > 0 ? `<li><strong>Niños:</strong> ${ninos} x $${(precioDestino * 0.5).toFixed(2)} = $${(ninos * precioDestino * 0.5).toFixed(2)}</li>` : ''}
        `;
      }
// Mostrar el modal de éxito c0n los detalles de la reserva
      modalTitle.innerHTML = '<i class="bx bx-check-circle text-success me-2"></i> ¡Reserva exitosa!';
      modalBody.innerHTML = ` 
        <div class="alert alert-success">
          <h6 class="alert-heading">¡Gracias por tu reserva, ${nombreInput.value.split(' ')[0]}!</h6>
          <hr>
          <p><i class="bx bx-package me-2"></i> <strong>Paquete:</strong> ${paqueteNombre}</p>
          <p><i class="bx bx-map me-2"></i> <strong>Destino:</strong> ${destinoSeleccionado.text}</p>
          <p><i class="bx bx-calendar me-2"></i> <strong>Fecha:</strong> ${formatearFecha(fechaLlegada.value)} al ${formatearFecha(fechaSalida.value)}</p>
          <p><i class="bx bx-user me-2"></i> <strong>Personas:</strong> ${adultos} adulto(s), ${ninos} niño(s)</p>
          <p><i class="bx bx-envelope me-2"></i> <strong>Email:</strong> ${emailInput.value}</p>
          <p><i class="bx bx-phone me-2"></i> <strong>Teléfono:</strong> ${telefonoInput.value}</p>
          <p><i class="bx bx-barcode me-2"></i> <strong>Número de reserva:</strong> ${numeroReserva}</p>
          <p><i class="bx bx-dollar me-2"></i> <strong>Desglose:</strong></p>
          <ul class="mb-2">${desglose}</ul>
          <p class="fw-bold"><i class="bx bx-money me-2"></i> <strong>Total a pagar:</strong> $${costoTotal.toFixed(2)}</p>
          <hr>
          <p class="mb-0"><i class="bx bx-envelope me-2"></i> Te hemos enviado los detalles a tu correo electrónico.</p>
        </div>`;
      reservaForm.reset();
      actualizarCostoEstimado();
    }, 2000);
  }

  // Función para actualizar el costo estimado
  function actualizarCostoEstimado() { //
    const paqueteSeleccionado = paqueteSelect.selectedOptions[0]; // Obtener el paquete seleccionado
    const destinoSeleccionado = destinoSelect.selectedOptions[0]; // Obtener el destino seleccionado
    const adultos = parseInt(adultosSelect.value) || 0; // Obtener el número de adultos
    const ninos = parseInt(ninosSelect.value) || 0; // Obtener el número de niños

    let costoTotal = 0;

    // Validar que se haya seleccionado un paquete o destino

    if (paqueteSelect.value && paqueteSelect.value !== "ninguna") {
      const precioBase = parseFloat(paqueteSeleccionado.getAttribute('data-precio')) || 0; // Obtener el precio base del paquete
      const incluyeAdultos = parseInt(paqueteSeleccionado.getAttribute('data-incluye-adultos')) || 0; // Obtener los adultos  incluidos en el paquete
      const incluyeNinos = parseInt(paqueteSeleccionado.getAttribute('data-incluye-ninos')) || 0; // Obtener los niños incluidos en el paquete

      const extraAdultos = Math.max(adultos - incluyeAdultos, 0); // Calcular adultos extra
      const extraNinos = Math.max(ninos - incluyeNinos, 0); // Calcular niños extra

      const costoExtraAdultos = extraAdultos * (precioBase * 0.6); // 60% del precio base por adulto extra
      const costoExtraNinos = extraNinos * (precioBase * 0.5); // 50% del precio base por niño extra
      costoTotal = precioBase + costoExtraAdultos + costoExtraNinos; // Costo total considerando extras
    } else if (destinoSelect.value && destinoSelect.value !== "Ninguna opción") {
      const precioDestino = parseFloat(destinoSeleccionado.getAttribute('data-precio')) || 0; // Obtener el precio del destino
      costoTotal = (adultos * precioDestino) + (ninos * precioDestino * 0.5); // Calcular costo total por destino
    }

    const contenedor = document.getElementById('costoEstimado');
    const monto = document.getElementById('montoEstimado');
// Mostrar u ocultar el contenedor de costo estimado
    if (costoTotal > 0) {
      monto.textContent = costoTotal.toFixed(2);
      contenedor.classList.remove('d-none');
    } else {
      contenedor.classList.add('d-none');
    }
  }

  // Función para formatear fechas
function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr + 'T00:00:00'); // Asegurarse de que la fecha tenga hora para evitar problemas de zona horaria
  return fecha.toLocaleDateString('es-ES', { // Formatear fecha en formato dd/mm/yyyy
    timeZone: 'UTC', // Usar zona horaria UTC para evitar problemas de conversión
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

  // Event listeners para los botones de reserva rápida
  document.querySelectorAll('.btn-outline-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.card');
      const titulo = card.querySelector('.card-title')?.textContent;

      for (const option of destinoSelect.options) { // Recorrer las opciones del select de destino
        if (option.text.includes(titulo)) { // Verificar si el texto del título está en la opción
          destinoSelect.value = option.value; // Actualizar el select de destino
          break;
        }
      }

      actualizarCostoEstimado(); // Instanciar actualizacion de costo estimado al seleccionar un destino
      document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' }); // Desplazarse al formulario
    });
  });

  // Mostrar costo estimado al cargar
  actualizarCostoEstimado();
});