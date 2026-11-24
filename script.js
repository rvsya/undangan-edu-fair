const SUPABASE_URL = 'NEXT_PUBLIC_SUPABASE_URL=https://bxhbtxmmqmvozsjonofh.supabase.co';
const SUPABASE_ANON_KEY = 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_XRx4ZnLU1dkv45b88NJWCA_8zqRZlVI';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        to: params.get('to') || 'Bapak/Ibu Tamu Undangan',
        instansi: params.get('instansi') || 'Mitra Edu Fair & Career Day',
        kategori: params.get('kategori') || 'Tamu Kehormatan'
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const data = getQueryParams();

    const nameEl = document.getElementById('recipient-name');
    const instansiEl = document.getElementById('recipient-instansi');
    const kategoriEl = document.getElementById('recipient-kategori');

    if (nameEl) nameEl.textContent = data.to;
    if (instansiEl) instansiEl.textContent = data.instansi;
    if (kategoriEl) kategoriEl.textContent = data.kategori;

    const modal = document.getElementById('rsvp-modal');
    const btnOpen = document.getElementById('btn-open-rsvp');
    const btnClose = document.getElementById('btn-close-rsvp');
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');
    const submitBtn = rsvpForm ? rsvpForm.querySelector('button[type="submit"]') : null;

    if (btnOpen) {
        btnOpen.addEventListener('click', () => {
            document.getElementById('rsvp-nama').value = data.to;
            document.getElementById('rsvp-instansi').value = data.instansi;

            rsvpForm.classList.remove('hidden');
            rsvpSuccess.classList.add('hidden');

            modal.classList.remove('hidden');
            modal.classList.add('flex');
        });
    }

    if (btnClose) {
        btnClose.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nama = document.getElementById('rsvp-nama').value.trim();
            const instansi = document.getElementById('rsvp-instansi').value.trim();
            const status = document.getElementById('rsvp-status').value;
            const pesan = document.getElementById('rsvp-pesan').value.trim();

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Mengirim...';
            }

            const payload = {
                nama,
                instansi,
                kategori: data.kategori,
                status,
                pesan: pesan || null
            };

            const { error } = await supabaseClient
                .from('rsvp')
                .insert([payload]);

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Kirim Konfirmasi';
            }

            if (error) {
                console.error('Supabase RSVP error:', error);
                alert('Gagal menyimpan konfirmasi ke database. Periksa konfigurasi Supabase Anda.');
                return;
            }

            localStorage.setItem('rsvp_edufair_2026', JSON.stringify({
                ...payload,
                waktu: new Date().toLocaleString('id-ID')
            }));

            rsvpForm.classList.add('hidden');
            rsvpSuccess.classList.remove('hidden');

            document.getElementById('rsvp-summary').textContent =
                `Konfirmasi atas nama ${nama} (${instansi}) dengan status "${status}" telah berhasil tersimpan di database.`;
        });
    }
});