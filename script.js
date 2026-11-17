// 3. Penanganan Submit Form RSVP ke Google Sheets
const rsvpForm = document.getElementById('rsvp-form');
const feedbackBox = document.getElementById('rsvp-feedback');

// PASTE URL WEB APP GOOGLE APPS SCRIPT KAMU DI SINI:
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxfCUYnIhtxY0_nyoJCEnEB0Qo84d9gw2kN0BQCutC-p4tJkrtP-mScMRFye7r073V-0Q/exec';

rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nama = document.getElementById('rsvp-nama').value;
    const instansi = document.getElementById('rsvp-instansi').value;
    const status = document.getElementById('rsvp-status').value;
    const pesan = document.getElementById('rsvp-pesan').value;

    const submitBtn = rsvpForm.querySelector('button[type="submit"]');
    submitBtn.textContent = "Mengirim...";
    submitBtn.disabled = true;

    // Gunakan URLSearchParams agar terbaca sebagai e.parameter di Apps Script
    const formData = new URLSearchParams();
    formData.append('nama', nama);
    formData.append('instansi', instansi);
    formData.append('status', status);
    formData.append('pesan', pesan);

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                feedbackBox.innerHTML = `Terima kasih, <strong>${nama}</strong>! Konfirmasi kehadiran Anda (<em>${status}</em>) telah tersimpan.`;
                feedbackBox.classList.remove('hidden');
                rsvpForm.reset();
            } else {
                throw new Error(data.error || 'Gagal menyimpan data');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            feedbackBox.innerHTML = `Maaf, terjadi kesalahan saat menyimpan data. Cek console browser untuk detailnya.`;
            feedbackBox.classList.remove('hidden');
        })
        .finally(() => {
            submitBtn.textContent = "Kirim Konfirmasi";
            submitBtn.disabled = false;
        });
});