document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil parameter dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const namaTamu = urlParams.get('to');
    const instansiTamu = urlParams.get('instansi');
    const kategoriTamu = urlParams.get('kategori');

    // 2. Tampilkan ke elemen HTML jika parameter ada
    if (namaTamu) {
        document.getElementById('guest-name').textContent = namaTamu;
        document.getElementById('rsvp-nama').value = namaTamu; // Otomatis isi di form RSVP
    }

    if (instansiTamu) {
        document.getElementById('guest-institution').textContent = instansiTamu;
        document.getElementById('rsvp-instansi').value = instansiTamu; // Otomatis isi di form RSVP
    }

    if (kategoriTamu) {
        document.getElementById('guest-category').textContent = "Kategori: " + kategoriTamu;
    }

    // 3. Penanganan Submit Form RSVP
    const rsvpForm = document.getElementById('rsvp-form');
    const feedbackBox = document.getElementById('rsvp-feedback');

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nama = document.getElementById('rsvp-nama').value;
        const status = document.getElementById('rsvp-status').value;

        feedbackBox.innerHTML = `Terima kasih, <strong>${nama}</strong>! Konfirmasi kehadiran Anda (<em>${status}</em>) telah tercatat.`;
        feedbackBox.classList.remove('hidden');
        rsvpForm.reset();
    });
});