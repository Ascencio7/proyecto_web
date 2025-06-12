// Script de redirección y modal combinado correctamente

document.addEventListener('DOMContentLoaded', () => {
    const reservaModalEl = document.getElementById('reservaModal');
    const reservaModal = new bootstrap.Modal(reservaModalEl);
    const modalTitle = reservaModalEl.querySelector('.modal-title');
    const modalBody = reservaModalEl.querySelector('.modal-body');
    const modalFooter = reservaModalEl.querySelector('.modal-footer');

    document.querySelectorAll('.reservar-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.promocion');
            const titulo = card.querySelector('h2')?.textContent?.trim();
            const precio = card.querySelector('p strong')?.textContent?.trim();
            const detalles = card.querySelector('ul')?.innerText?.trim();

            modalTitle.textContent = 'Reserva de paquete';
            modalBody.innerHTML = `
        <div class="alert alert-info">
          <p><i class="bx bx-package me-2"></i> <strong>Paquete:</strong> ${titulo}</p>
          ${precio ? `<p><i class="bx bx-dollar me-2"></i> ${precio}</p>` : ''}
          ${detalles ? `<p><i class="bx bx-detail me-2"></i> ${detalles.replace(/\n/g, '<br>')}</p>` : ''}
          <hr><p class="mb-0">Haz clic en continuar para ir al formulario de reserva.</p>
        </div>`;

        const paquete = btn.dataset.paquete;
        const adultos = btn.dataset.adultos || 1;
        const ninos = btn.dataset.ninos || 0;

        modalFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <a href="reservas.html?paquete=${encodeURIComponent(paquete)}&adultos=${adultos}&ninos=${ninos}" class="btn btn-primary">Ir al formulario</a>
      `;
            reservaModal.show();
        });
    });
});


// Script para reproducir el video en el modal
function mostrarVideo(ruta) {
    const video = document.getElementById("videoPromocional");
    const fuente = document.getElementById("fuenteVideo");
    
    fuente.src = ruta;
    video.load();
    
    const modal = new bootstrap.Modal(document.getElementById("modalVideo"));
    modal.show();  
}