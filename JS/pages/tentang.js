console.log('✅ Tentang.js berhasil di-load dan mulai jalan...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM sudah siap, menjalankan initScrollReveal & initProsesStepper...');
    initScrollReveal();
    initProsesStepper();
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

        // Set kondisi awal (tersembunyi) lewat JS, bukan lewat CSS default.
        // Kalau JS gagal load karena alasan apapun, konten tetap terlihat normal.
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

/* ── 2. PROSES PELAYANAN STEPPER ── */
function initProsesStepper() {
    const steps = document.querySelectorAll('.proses-step');
    const panels = document.querySelectorAll('.proses-panel-item');
    const wrapper = document.querySelector('.proses-wrapper');
    console.log(`🔍 Ditemukan ${steps.length} step dan ${panels.length} panel proses`);
    if (!steps.length || !panels.length) return;

    let current = 0;
    let autoTimer = null;
    const AUTO_DELAY = 4000;

    function setActive(index) {
        current = index;
        steps.forEach((s, i) => s.classList.toggle('is-active', i === index));
        panels.forEach((p, i) => p.classList.toggle('is-active', i === index));
    }

    function nextStep() {
        setActive((current + 1) % steps.length);
    }

    function startAuto() {
        stopAuto();
        autoTimer = setInterval(nextStep, AUTO_DELAY);
    }

    function stopAuto() {
        if (autoTimer) clearInterval(autoTimer);
    }

    steps.forEach((step, i) => {
        step.addEventListener('click', () => {
            setActive(i);
            startAuto(); // reset timer supaya tidak langsung ganti setelah klik manual
        });
    });

    // Auto-advance saat section terlihat, berhenti saat mouse hover / user menjauh
    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAuto);
        wrapper.addEventListener('mouseleave', startAuto);
    }

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startAuto();
                } else {
                    stopAuto();
                }
            });
        },
        { threshold: 0.3 }
    );

    const prosesSection = document.querySelector('.proses-section');
    if (prosesSection) sectionObserver.observe(prosesSection);
}