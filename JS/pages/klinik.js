console.log('✅ Klinik.js berhasil di-load dan mulai jalan...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM sudah siap, menjalankan semua fitur Klinik...');
    initScrollReveal();
    initBookingModal();
    initBookingForm();
    initSuccessModal();
});

/* ── 1. SCROLL REVEAL ── */
function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    console.log(`🔍 Ditemukan ${revealEls.length} elemen .reveal`);
    if (!revealEls.length) return;

    revealEls.forEach((el) => {
        const siblings = Array.from(el.parentElement.children).filter((c) =>
            c.classList.contains('reveal')
        );
        const index = siblings.indexOf(el);

        // Kondisi awal (tersembunyi) di-set lewat JS, bukan CSS default.
        // Kalau JS gagal load, konten tetap terlihat normal (fail-safe).
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.6s ease ${Math.min(index * 80, 400)}ms, transform 0.6s ease ${Math.min(index * 80, 400)}ms`;
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
}

/* ── 2. MODAL BOOKING: BUKA / TUTUP ── */
function initBookingModal() {
    const overlay = document.getElementById('bookingModalOverlay');
    const openBtn = document.getElementById('openBookingModal');
    const closeBtn = document.getElementById('bmClose');
    if (!overlay) return;

    const openModal = () => {
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Klik area gelap di luar modal untuk menutup
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Tombol ESC menutup modal booking (kalau sedang terbuka)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            closeModal();
        }
    });

    // Dipakai oleh initBookingForm() setelah submit berhasil
    window.__closeBookingModal = closeModal;
}

/* ── 3. FORM BOOKING: VALIDASI + SUBMIT ── */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    // Field yang wajib diisi (sesuai tanda * di label)
    const requiredFields = [
        { id: 'ownerName', label: 'Nama Pemilik' },
        { id: 'ownerPhone', label: 'Nomor WhatsApp' },
        { id: 'petName', label: 'Nama Hewan' },
        { id: 'petType', label: 'Jenis Hewan' },
        { id: 'serviceNeeded', label: 'Layanan yang Dibutuhkan' },
        { id: 'visitDate', label: 'Tanggal Kunjungan' },
        { id: 'visitTime', label: 'Jam Kunjungan' },
    ];

    // Tanggal kunjungan tidak boleh pilih hari yang sudah lewat
    const visitDateInput = document.getElementById('visitDate');
    if (visitDateInput) {
        const today = new Date().toISOString().split('T')[0];
        visitDateInput.setAttribute('min', today);
    }

    // Hapus status error saat user mulai mengisi ulang field tersebut
    requiredFields.forEach(({ id }) => {
        const field = document.getElementById(id);
        if (field) {
            field.addEventListener('input', () => clearFieldError(field));
            field.addEventListener('change', () => clearFieldError(field));
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        let firstInvalidField = null;

        requiredFields.forEach(({ id, label }) => {
            const field = document.getElementById(id);
            if (!field) return;

            const value = field.value.trim();
            if (!value) {
                isValid = false;
                showFieldError(field, `${label} wajib diisi.`);
                if (!firstInvalidField) firstInvalidField = field;
            } else if (id === 'ownerPhone' && !isValidPhone(value)) {
                isValid = false;
                showFieldError(field, 'Format nomor WhatsApp tidak valid.');
                if (!firstInvalidField) firstInvalidField = field;
            } else {
                clearFieldError(field);
            }
        });

        if (!isValid) {
            // Fokus & scroll otomatis ke field pertama yang bermasalah
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return; // Form TIDAK disubmit kalau ada field kosong/tidak valid
        }

        // Semua valid → kumpulkan data, tutup modal booking, tampilkan modal sukses
        const data = {
            ownerName: form.ownerName.value.trim(),
            petName: form.petName.value.trim(),
            petType: form.petType.value,
            serviceNeeded: form.serviceNeeded.value,
            visitDate: form.visitDate.value,
            visitTime: form.visitTime.value,
        };

        if (typeof window.__closeBookingModal === 'function') {
            window.__closeBookingModal();
        }

        showBookingSuccess(data);
        form.reset();
    });
}

function isValidPhone(value) {
    // Terima format umum nomor Indonesia: boleh pakai spasi/strip, minimal 9 digit
    const digitsOnly = value.replace(/[\s-]/g, '');
    return /^(\+62|62|0)8\d{7,12}$/.test(digitsOnly);
}

function showFieldError(field, message) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');

    let errorEl = group.querySelector('.form-error-msg');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error-msg';
        group.appendChild(errorEl);
    }
    errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
}

function clearFieldError(field) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.remove('has-error');
    const errorEl = group.querySelector('.form-error-msg');
    if (errorEl) errorEl.remove();
}

/* ── 4. MODAL SUKSES BOOKING ── */
function initSuccessModal() {
    const overlay = document.getElementById('bookingSuccessOverlay');
    const closeBtn = document.getElementById('bsmClose');
    const doneBtn = document.getElementById('bsmDone');
    if (!overlay) return;

    if (closeBtn) closeBtn.addEventListener('click', closeBookingSuccess);
    if (doneBtn) doneBtn.addEventListener('click', closeBookingSuccess);

    // Klik area gelap di luar modal juga menutup modal
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeBookingSuccess();
    });

    // Tekan ESC untuk menutup modal sukses
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            closeBookingSuccess();
        }
    });
}

function showBookingSuccess(data) {
    const overlay = document.getElementById('bookingSuccessOverlay');
    const summary = document.getElementById('bsmSummary');
    if (!overlay || !summary) return;

    const formattedDate = formatDateID(data.visitDate);

    summary.innerHTML = `
        <div><span>Nama Pemilik</span><span>${escapeHTML(data.ownerName)}</span></div>
        <div><span>Nama Hewan</span><span>${escapeHTML(data.petName)} (${escapeHTML(data.petType)})</span></div>
        <div><span>Layanan</span><span>${escapeHTML(data.serviceNeeded)}</span></div>
        <div><span>Jadwal</span><span>${formattedDate}, ${escapeHTML(data.visitTime)}</span></div>
    `;

    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeBookingSuccess() {
    const overlay = document.getElementById('bookingSuccessOverlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
}

function formatDateID(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}