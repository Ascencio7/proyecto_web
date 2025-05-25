document.addEventListener('DOMContentLoaded', () => { // Esperar a que el DOM esté completamente cargado
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

  const reservaModal = new bootstrap.Modal(document.getElementById('reservaModal'));
  const modalTitle = document.getElementById('reservaModalTitle');
  const modalBody = document.getElementById('reservaModalBody');

  // Cargar cambios para mostrar el costo estimado de la reserva
  [paqueteSelect, destinoSelect, adultosSelect, ninosSelect].forEach(el => {
    el.addEventListener('change', actualizarCostoEstimado);
  });

  const today = new Date().toISOString().split('T')[0];
  fechaLlegada.min = fechaSalida.min = today;

  fechaLlegada.addEventListener('change', () => {
    if (fechaLlegada.value) {
      fechaSalida.min = fechaLlegada.value;
    }
  });

  reservaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      simularReserva();
    }
  });

  function validarFormulario() { // Validar el formulario antes de enviar y evitar el envío si hay errores
    let valido = true;
    const errores = [];

    const validarCampo = (input, mensaje, extraCondicion = () => true) => {
      if (!input.value || !extraCondicion(input.value)) {
        input.classList.add('is-invalid');
        errores.push(`• ${mensaje}`);
        valido = false;
      } else {
        input.classList.remove('is-invalid');
      }
    };

    validarCampo(nombreInput, 'Ingresa tu nombre completo');
    validarCampo(emailInput, 'Ingresa tu correo electrónico', val => /^\S+@\S+\.\S+$/.test(val));
    validarCampo(telefonoInput, 'Ingresa tu número de teléfono');
    validarCampo(destinoSelect, 'Selecciona un destino', () => destinoSelect.selectedIndex !== 0);
    validarCampo(fechaLlegada, 'Ingresa una fecha de llegada');
    validarCampo(fechaSalida, 'Ingresa una fecha de salida');

    if (fechaLlegada.value && fechaSalida.value) {
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

    if (errores.length) {
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

  function simularReserva() { // Simular el proceso de reserva  
    modalTitle.textContent = 'Procesando reserva...';
    modalBody.innerHTML = `
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Estamos procesando tu reserva</p>
      </div>`;
    reservaModal.show();

    setTimeout(() => { // Simular un retraso en el procesamiento para enviar los datos al servidor
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
// Cálculo del costo total y desglose de precios
      if (paqueteSelect.value !== "") {
        precioBase = parseFloat(paqueteSeleccionado.dataset.precio) || 0;
        incluyeAdultos = parseInt(paqueteSeleccionado.dataset.incluyeAdultos) || 0;
        incluyeNinos = parseInt(paqueteSeleccionado.dataset.incluyeNinos) || 0;
        paqueteNombre = paqueteSeleccionado.text;

        if (adultos <= incluyeAdultos && ninos <= incluyeNinos) {
          costoTotal = precioBase;
          desglose = `<li><strong>Base:</strong> $${precioBase.toFixed(2)} (Paquete)</li>`;
        } else {
          const extraAdultos = Math.max(adultos - incluyeAdultos, 0);
          const extraNinos = Math.max(ninos - incluyeNinos, 0);
          const costoExtraAdultos = extraAdultos * (precioBase * 0.6); // 60% del precio base por extra del paquete
          const costoExtraNinos = extraNinos * (precioBase * 0.5); // 50% del precio base por extra de niños
          costoTotal = precioBase + costoExtraAdultos + costoExtraNinos;
// Desglose de precios
          desglose = `
            <li><strong>Base:</strong> $${precioBase.toFixed(2)} (Paquete)</li>
            ${extraAdultos > 0 ? `<li>${extraAdultos} adulto(s) extra x $${(precioBase * 0.6).toFixed(2)}: $${costoExtraAdultos.toFixed(2)}</li>` : ''}
            ${extraNinos > 0 ? `<li>${extraNinos} niño(s) extra x $${(precioBase * 0.5).toFixed(2)}: $${costoExtraNinos.toFixed(2)}</li>` : ''}

          `;
        }
      } else {
        const precioDestino = parseFloat(destinoSeleccionado.dataset.precio) || 0;
        costoTotal = (adultos * precioDestino) + (ninos * precioDestino * 0.5);
        desglose = `
          <li><strong>Adultos:</strong> ${adultos} x $${precioDestino.toFixed(2)} = $${(adultos * precioDestino).toFixed(2)}</li>
          ${ninos > 0 ? `<li><strong>Niños:</strong> ${ninos} x $${(precioDestino * 0.5).toFixed(2)} = $${(ninos * precioDestino * 0.5).toFixed(2)}</li>` : ''}
        `;
      }
// Mostrar el resultado de la reserva en el modal
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
      actualizarCostoEstimado(); // actualizar después del reset
    }, 2000);
  }

  function actualizarCostoEstimado() { // Actualizar el costo estimado de la reserva
    const paqueteSeleccionado = paqueteSelect.selectedOptions[0];
    const destinoSeleccionado = destinoSelect.selectedOptions[0];
    const adultos = parseInt(adultosSelect.value) || 0;
    const ninos = parseInt(ninosSelect.value) || 0;

    let costoTotal = 0;

    if (paqueteSelect.value !== "") {
      const precioBase = parseFloat(paqueteSeleccionado.dataset.precio) || 0;
      const incluyeAdultos = parseInt(paqueteSeleccionado.dataset.incluyeAdultos) || 0;
      const incluyeNinos = parseInt(paqueteSeleccionado.dataset.incluyeNinos) || 0;

      const extraAdultos = Math.max(adultos - incluyeAdultos, 0);
      const extraNinos = Math.max(ninos - incluyeNinos, 0);

      const costoExtraAdultos = extraAdultos * (precioBase * 0.6); // 60% del precio base por extra del paquete
      const costoExtraNinos = extraNinos * (precioBase * 0.5); // 50% del precio base por extra de niños
      costoTotal = precioBase + costoExtraAdultos + costoExtraNinos;
    } else if (destinoSelect.value !== "") {
      const precioDestino = parseFloat(destinoSeleccionado.dataset.precio) || 0;
      costoTotal = (adultos * precioDestino) + (ninos * precioDestino * 0.5);
    }

    const contenedor = document.getElementById('costoEstimado');
    const monto = document.getElementById('montoEstimado');

    if (costoTotal > 0) {
      monto.textContent = costoTotal.toFixed(2);
      contenedor.classList.remove('d-none');
    } else {
      contenedor.classList.add('d-none');
    }
  }

  function formatearFecha(fechaStr) { // Formatear la fecha al formato 'dd/mm/yyyy'
    return new Date(fechaStr).toLocaleDateString('es-SV');
  }

  document.querySelectorAll('.btn-outline-primary, .btn-primary:not([type="submit"])').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.card');
      const titulo = card.querySelector('.card-title')?.textContent;
      const precio = card.querySelector('.price-badge, h4')?.textContent;
      const detalles = card.querySelector('.card-text')?.textContent;

      const esDestino = btn.classList.contains('btn-outline-primary');

      modalTitle.textContent = esDestino ? 'Reserva rápida' : 'Reserva de paquete';
      modalBody.innerHTML = `
        <div class="alert alert-info">
          <p><i class="bx ${esDestino ? 'bx-info-circle' : 'bx-package'} me-2"></i> <strong>${esDestino ? 'Destino' : 'Paquete'}:</strong> ${titulo}</p>
          ${precio ? `<p><i class="bx bx-dollar me-2"></i> ${precio}</p>` : ''}
          ${detalles ? `<p><i class="bx bx-detail me-2"></i> ${detalles}</p>` : ''}
          <hr><p class="mb-0">Serás redirigido al formulario de reserva completa.</p>
        </div>`;
      reservaModal.show();

      if (esDestino) {
        for (const option of destinoSelect.options) {
          if (option.text.includes(titulo)) {
            destinoSelect.value = option.value;
            break;
          }
        }
      } else {
        for (const option of paqueteSelect.options) {
          if (option.text.includes(titulo)) {
            paqueteSelect.value = option.value;
            adultosSelect.value = option.dataset.incluyeAdultos;
            ninosSelect.value = option.dataset.incluyeNinos;
            break;
          }
        }
      }

      actualizarCostoEstimado(); // Actualizar el costo estimado al seleccionar un paquete o destino

      const formSection = document.querySelector('.form-section');
      if (formSection) {
        setTimeout(() => {
          formSection.scrollIntoView({ behavior: 'smooth' });
        }, 1500);
      }
    });
  });

  // Mostrar costo estimado al cargar si ya hay valores por defecto
  actualizarCostoEstimado();
});
