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

    const formData = new URLSearchParams();
    formData.append('nama', nama);
    formData.append('instansi', instansi);
    formData.append('status', status);
    formData.append('pesan', pesan);

    // Menggunakan mode no-cors agar aman dari blokir browser
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    })
        .then(() => {
            // Karena mode no-cors response-nya opaque, kita langsung tampilkan sukses
            feedbackBox.innerHTML = `Terima kasih, <strong>${nama}</strong>! Konfirmasi kehadiran Anda (<em>${status}</em>) telah berhasil tersimpan.`;
            feedbackBox.classList.remove('hidden');
            rsvpForm.reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            feedbackBox.innerHTML = `Terjadi kendala jaringan, namun data Anda mungkin tetap terkirim.`;
            feedbackBox.classList.remove('hidden');
        })
        .finally(() => {
            submitBtn.textContent = "Kirim Konfirmasi";
            submitBtn.disabled = false;
        });
});