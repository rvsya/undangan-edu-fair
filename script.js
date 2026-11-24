const SUPABASE_URL = 'https://bxhbtxmmqmvozsjonofh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_XRx4ZnLU1dkv45b88NJWCA_8zqRZlVI';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        to: params.get('to') || 'Bapak/Ibu Tamu Undangan',
        instansi: params.get('instansi') || 'Mitra Edu Fair & Career Day',
        kategori: params.get('kategori') || 'Tamu Undangan'
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const data = getQueryParams();

    const nameEl = document.getElementById('recipient-name');
    const instansiEl = document.getElementById('recipient-instansi');
    const kategoriEl = document.getElementById('recipient-kategori');
    const namaInput = document.getElementById('rsvp-nama');
    const instansiInput = document.getElementById('rsvp-instansi');

    if (nameEl) nameEl.textContent = data.to;
    if (instansiEl) instansiEl.textContent = data.instansi;
    if (kategoriEl) kategoriEl.textContent = data.kategori;
    if (namaInput && !namaInput.value) namaInput.value = data.to;
    if (instansiInput && !instansiInput.value) instansiInput.value = data.instansi;

    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    let manualPaused = false;

    function syncMusicButton() {
        if (!musicBtn || !bgMusic) return;
        if (bgMusic.paused) {
            musicBtn.textContent = 'Putar Musik';
            musicBtn.classList.add('paused');
        } else {
            musicBtn.textContent = 'Jeda Musik';
            musicBtn.classList.remove('paused');
        }
    }

    async function tryAutoPlay() {
        if (!bgMusic || manualPaused) return;
        try {
            await bgMusic.play();
            syncMusicButton();
        } catch (err) {
            syncMusicButton();
        }
    }

    if (bgMusic && musicBtn) {
        bgMusic.addEventListener('play', syncMusicButton);
        bgMusic.addEventListener('pause', syncMusicButton);

        tryAutoPlay();

        const unlockOnInteraction = async () => {
            if (bgMusic.paused && !manualPaused) {
                await tryAutoPlay();
            }
            if (!bgMusic.paused || manualPaused) {
                document.removeEventListener('click', unlockOnInteraction);
                document.removeEventListener('touchstart', unlockOnInteraction);
                document.removeEventListener('keydown', unlockOnInteraction);
            }
        };

        document.addEventListener('click', unlockOnInteraction, { passive: true });
        document.addEventListener('touchstart', unlockOnInteraction, { passive: true });
        document.addEventListener('keydown', unlockOnInteraction, { passive: true });

        musicBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (bgMusic.paused) {
                manualPaused = false;
                try {
                    await bgMusic.play();
                    syncMusicButton();
                } catch (err) {
                    alert('Pastikan file musik.mp3 ada di folder yang sama dengan index.html.');
                }
            } else {
                manualPaused = true;
                bgMusic.pause();
                syncMusicButton();
            }
        });
    }

    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');
    const rsvpSummary = document.getElementById('rsvp-summary');
    const submitBtn = rsvpForm ? rsvpForm.querySelector('button[type="submit"]') : null;

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nama = document.getElementById('rsvp-nama').value.trim();
            const instansi = document.getElementById('rsvp-instansi').value.trim();
            const status = document.getElementById('rsvp-status').value;
            const pesan = document.getElementById('rsvp-pesan').value.trim();

            if (!nama || !instansi) return;

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
                alert('Gagal mengirim: ' + error.message);
                return;
            }

            if (rsvpSuccess && rsvpSummary) {
                rsvpSummary.textContent = `Terima kasih, konfirmasi atas nama ${nama} (${instansi}) dengan status "${status}" sudah tercatat.`;
                rsvpSuccess.classList.remove('hidden');
            }

            document.getElementById('rsvp-pesan').value = '';
        });
    }
});