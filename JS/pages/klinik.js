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
    if (!revealEls.length) return;

    revealEls.forEach((el) => {
        const siblings = Array.from(el.parentElement.children).filter((c) =>
            c.classList.contains('reveal')
        );
        const index = siblings.indexOf(el);

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

/* ── 2. MODAL BOOKING: BUKA / TUTUP & VERIFIKASI LOGIN ── */
function initBookingModal() {
    const overlay = document.getElementById('bookingModalOverlay');
    const openBtn = document.getElementById('openBookingModal');
    const closeBtn = document.getElementById('bmClose');
    if (!overlay) return;

    const openModal = () => {
        // 💡 VERIFIKASI LOGIN
        const activeUserName = JSON.parse(sessionStorage.getItem('zoon_active_user'));
        if (!activeUserName) {
            alert("Silakan Login terlebih dahulu untuk menjadwalkan kunjungan Klinik.");
            window.location.href = "Login.html";
            return;
        }

        // 💡 AUTOFILL DATA PEMILIK
        const users = JSON.parse(sessionStorage.getItem('zoon_users')) || [];
        const activeUser = users.find(u => u.username === activeUserName);
        if (activeUser) {
            const ownerName = document.getElementById('ownerName');
            const ownerPhone = document.getElementById('ownerPhone');
            
            if (ownerName) {
                ownerName.value = activeUser.fullname;
                ownerName.setAttribute('disabled', 'true');
                ownerName.style.background = '#f5f7fa';
                ownerName.style.color = '#888';
                ownerName.style.cursor = 'not-allowed';
            }
            if (ownerPhone) {
                ownerPhone.value = activeUser.phone;
                ownerPhone.setAttribute('disabled', 'true');
                ownerPhone.style.background = '#f5f7fa';
                ownerPhone.style.color = '#888';
                ownerPhone.style.cursor = 'not-allowed';
            }
        }

        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            closeModal();
        }
    });

    window.__closeBookingModal = closeModal;
}

/* ── 3. FORM BOOKING: VALIDASI + SUBMIT KE RIWAYAT ── */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    const requiredFields = [
        { id: 'ownerName', label: 'Nama Pemilik' },
        { id: 'ownerPhone', label: 'Nomor WhatsApp' },
        { id: 'petName', label: 'Nama Hewan' },
        { id: 'petType', label: 'Jenis Hewan' },
        { id: 'serviceNeeded', label: 'Layanan yang Dibutuhkan' },
        { id: 'visitDate', label: 'Tanggal Kunjungan' },
        { id: 'visitTime', label: 'Jam Kunjungan' },
    ];

    const visitDateInput = document.getElementById('visitDate');
    if (visitDateInput) {
        const today = new Date().toISOString().split('T')[0];
        visitDateInput.setAttribute('min', today);
    }

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
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return; 
        }

        // 💡 EFEK LOADING TOMBOL
        const btnSubmit = form.querySelector('button[type="submit"]');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Memproses...`;
        btnSubmit.disabled = true;

        setTimeout(() => {
            const data = {
                ownerName: form.ownerName.value.trim(),
                petName: form.petName.value.trim(),
                petType: form.petType.value,
                serviceNeeded: form.serviceNeeded.value,
                preferredDoctor: form.preferredDoctor.value || 'Dokter yang Tersedia',
                visitDate: form.visitDate.value,
                visitTime: form.visitTime.value,
            };

            // 💡 SIMPAN KE RIWAYAT TRANSAKSI
            let zoonHistory = JSON.parse(sessionStorage.getItem('zoon_history')) || [];
            const activeUser = JSON.parse(sessionStorage.getItem('zoon_active_user'));
            
            zoonHistory.push({
                type: 'klinik',
                user: activeUser,
                orderId: 'KLN-' + Math.floor(10000 + Math.random() * 90000),
                kategori: 'Klinik Hewan',
                detail: `${data.serviceNeeded} <br><small>Dokter: ${data.preferredDoctor}</small><br><small>Hewan: ${data.petName} (${data.petType})</small>`,
                jadwal: `${data.visitDate} | Pkl ${data.visitTime}`,
                status: 'Menunggu'
            });
            sessionStorage.setItem('zoon_history', JSON.stringify(zoonHistory));

            if (typeof window.__closeBookingModal === 'function') {
                window.__closeBookingModal();
            }

            showBookingSuccess(data);
            form.reset();

            // Kembalikan tombol
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
        }, 1500);
    });
}

function isValidPhone(value) {
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
        errorEl.style.color = '#e74c3c';
        errorEl.style.fontSize = '12px';
        errorEl.style.fontWeight = '700';
        errorEl.style.marginTop = '4px';
        errorEl.style.display = 'block';
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

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeBookingSuccess();
    });

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
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-gray); font-size: 13px;">Nama Pemilik</span>
            <span style="font-weight: 700; font-size: 13px;">${escapeHTML(data.ownerName)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-gray); font-size: 13px;">Nama Hewan</span>
            <span style="font-weight: 700; font-size: 13px;">${escapeHTML(data.petName)} (${escapeHTML(data.petType)})</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-gray); font-size: 13px;">Layanan</span>
            <span style="font-weight: 700; font-size: 13px; color: var(--teal);">${escapeHTML(data.serviceNeeded)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-gray); font-size: 13px;">Jadwal</span>
            <span style="font-weight: 700; font-size: 13px;">${formattedDate}, ${escapeHTML(data.visitTime)}</span>
        </div>
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